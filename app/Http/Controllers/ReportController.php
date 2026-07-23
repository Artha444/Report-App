<?php

namespace App\Http\Controllers;

use App\Models\Report;
use App\Models\User;
use App\Notifications\NewReportSubmitted;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ReportController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('reports/Index', [
            'reports' => Report::where('user_id', auth()->id())
                ->with(['images', 'user', 'team'])
                ->latest()
                ->paginate(15),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('reports/Create');
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'location' => 'required|string|max:255',
            'priority' => 'required|in:low,medium,high,critical',
            'images' => 'nullable|array|max:5',
            'images.*' => 'image|max:10240',
        ]);

        $report = Report::create([
            ...$validated,
            'user_id' => auth()->id(),
            'status' => 'pending',
        ]);

        $report->addLog('created', 'Report submitted');

        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $image) {
                $path = $image->store('reports', 'public');
                $report->images()->create(['path' => $path]);
            }
        }

        // ponytail: notifying all admins iteratively; deduplicate if admin count grows
        $admins = User::where('role', 'admin')->get();
        foreach ($admins as $admin) {
            $admin->notify(new NewReportSubmitted($report));
        }

        return redirect()->route('reports.index')->with('success', 'Report submitted.');
    }

    public function show(Report $report): Response
    {
        $report->load(['images', 'logs.user', 'team', 'user']);

        return Inertia::render('reports/Show', [
            'report' => $report,
        ]);
    }

    public function reopen(Request $request, Report $report): RedirectResponse
    {
        abort_unless($report->user_id === auth()->id(), 403);
        abort_unless($report->status === 'resolved', 400);

        $validated = $request->validate([
            'user_feedback' => 'required|string|max:1000',
        ]);

        $report->update([
            'status' => 'reopened',
            'user_feedback' => $validated['user_feedback'],
        ]);

        $report->addLog('reopened', $validated['user_feedback']);

        return back()->with('success', 'Report reopened.');
    }
}
