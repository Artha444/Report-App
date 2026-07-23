<?php

namespace App\Http\Controllers;

use App\Models\Report;
use App\Models\Team;
use App\Models\User;
use App\Notifications\ReportAssigned;
use App\Notifications\ReportConfirmed;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AdminController extends Controller
{
    public function reports(): Response
    {
        return Inertia::render('admin/Reports', [
            'reports' => Report::with(['user', 'team', 'images'])
                ->latest()
                ->paginate(20),
            'teams' => Team::all(),
        ]);
    }

    public function confirm(Report $report): RedirectResponse
    {
        $report->update([
            'status' => 'confirmed',
            'confirmed_at' => now(),
        ]);

        $report->addLog('confirmed', 'Report confirmed by admin');

        $report->user->notify(new ReportConfirmed($report));

        return back()->with('success', 'Report confirmed.');
    }

    public function assign(Request $request, Report $report): RedirectResponse
    {
        $validated = $request->validate(['team_id' => 'required|exists:teams,id']);

        $report->update([
            'team_id' => $validated['team_id'],
            'status' => 'in_progress',
        ]);

        $report->addLog('assigned', "Assigned to team: {$report->team->name}");

        $team = Team::find($validated['team_id']);
        foreach ($team->members as $member) {
            $member->notify(new ReportAssigned($report));
        }

        return back()->with('success', 'Report assigned to team.');
    }

    public function users(): Response
    {
        return Inertia::render('admin/Users', [
            'users' => User::latest()->paginate(20),
        ]);
    }

    public function updateRole(Request $request, User $user): RedirectResponse
    {
        $validated = $request->validate([
            'role' => 'required|in:student,teacher,admin',
        ]);

        $user->update(['role' => $validated['role']]);

        return back()->with('success', 'Role updated.');
    }
}
