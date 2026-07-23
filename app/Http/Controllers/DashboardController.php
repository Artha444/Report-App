<?php

namespace App\Http\Controllers;

use App\Models\Report;
use App\Models\Team;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(): Response
    {
        $user = Auth::user();

        $data = match ($user->role) {
            'admin' => $this->adminDashboard(),
            'teacher' => $this->teacherDashboard(),
            default => $this->studentDashboard(),
        };

        return Inertia::render('dashboard/Index', $data);
    }

    private function studentDashboard(): array
    {
        $userId = auth()->id();
        $query = Report::where('user_id', $userId);

        return [
            'myReportsCount' => (clone $query)->count(),
            'pendingCount' => (clone $query)->pending()->count(),
            'inProgressCount' => (clone $query)->inProgress()->count(),
            'resolvedCount' => (clone $query)->resolved()->count(),
            'rejectedCount' => (clone $query)->rejected()->count(),
            'recentReports' => Report::where('user_id', $userId)
                ->latest()->take(5)->get(),
        ];
    }

    private function teacherDashboard(): array
    {
        $teamIds = Auth::user()->teams()->pluck('teams.id');

        return [
            'assignedCount' => Report::whereIn('team_id', $teamIds)->where('status', 'in_progress')->count(),
            'resolvedCount' => Report::whereIn('team_id', $teamIds)->where('status', 'resolved')->count(),
            'recentReports' => Report::whereIn('team_id', $teamIds)
                ->with('team')->latest()->take(5)->get(),
            'teams' => Auth::user()->teams,
        ];
    }

    private function adminDashboard(): array
    {
        return [
            'pendingCount' => Report::pending()->count(),
            'confirmedCount' => Report::confirmed()->count(),
            'rejectedCount' => Report::rejected()->count(),
            'resolvedCount' => Report::resolved()->count(),
            'totalReports' => Report::count(),
            'recentReports' => Report::with(['user', 'team'])
                ->latest()->take(5)->get(),
            'teams' => Team::with('members')->get(),
        ];
    }
}
