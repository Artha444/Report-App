<?php

namespace App\Http\Controllers;

use App\Models\Report;
use App\Models\Team;
use App\Models\User;
use App\Notifications\ReportResolved;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class TeamController extends Controller
{
    public function dashboard(): Response
    {
        $teamIds = auth()->user()->teams()->pluck('teams.id');

        $assignedCount = Report::whereIn('team_id', $teamIds)->where('status', 'in_progress')->count();
        $resolvedCount = Report::whereIn('team_id', $teamIds)->where('status', 'resolved')->count();
        $recentReports = Report::whereIn('team_id', $teamIds)
            ->with(['user', 'team'])
            ->latest()
            ->take(5)
            ->get();

        return Inertia::render('team/Dashboard', [
            'assignedCount' => $assignedCount,
            'resolvedCount' => $resolvedCount,
            'recentReports' => $recentReports,
        ]);
    }

    public function reports(): Response
    {
        $teamIds = auth()->user()->teams()->pluck('teams.id');

        return Inertia::render('team/Reports', [
            'reports' => Report::whereIn('team_id', $teamIds)
                ->with(['user', 'team', 'images'])
                ->latest()
                ->paginate(20),
        ]);
    }

    public function markInProgress(Report $report): RedirectResponse
    {
        abort_unless($this->userCanActOnReport($report), 403);

        $report->update(['status' => 'in_progress']);
        $report->addLog('in_progress', 'Work started');

        return back()->with('success', 'Report marked in progress.');
    }

    public function resolve(Request $request, Report $report): RedirectResponse
    {
        abort_unless($this->userCanActOnReport($report), 403);

        $validated = $request->validate([
            'resolution_evidence' => 'required|image|max:10240',
            'resolution_notes' => 'required|string|max:1000',
        ]);

        $path = $request->file('resolution_evidence')->store('evidence', 'public');

        $report->update([
            'status' => 'resolved',
            'resolved_at' => now(),
            'resolution_evidence' => $path,
            'resolution_notes' => $validated['resolution_notes'],
        ]);

        $report->addLog('resolved', $validated['resolution_notes']);

        $report->user->notify(new ReportResolved($report));

        return back()->with('success', 'Report resolved.');
    }

    // Admin team management

    public function index(): Response
    {
        return Inertia::render('admin/Teams', [
            'teams' => Team::with('members')->latest()->get(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);

        Team::create($validated);

        return redirect()->route('admin.teams')->with('success', 'Team created.');
    }

    public function update(Request $request, Team $team): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);

        $team->update($validated);

        return back()->with('success', 'Team updated.');
    }

    public function destroy(Team $team): RedirectResponse
    {
        $team->delete();

        return redirect()->route('admin.teams')->with('success', 'Team deleted.');
    }

    public function addMember(Request $request, Team $team): RedirectResponse
    {
        $validated = $request->validate(['user_id' => 'required|exists:users,id']);
        $user = User::findOrFail($validated['user_id']);

        abort_unless($user->isTeacher(), 422, 'Only teachers can be added to teams.');

        $team->members()->syncWithoutDetaching($user);

        return back()->with('success', 'Member added.');
    }

    public function removeMember(Team $team, User $user): RedirectResponse
    {
        $team->members()->detach($user);

        return back()->with('success', 'Member removed.');
    }

    private function userCanActOnReport(Report $report): bool
    {
        return auth()->user()->teams()->where('team_id', $report->team_id)->exists();
    }
}
