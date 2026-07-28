<?php

namespace App\Http\Controllers;

use App\Models\Report;
use App\Models\Team;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(): Response | \Illuminate\Http\RedirectResponse
    {
        $user = Auth::user();

        if ($user->role === 'admin') {
            return Inertia::render('dashboard/Index', $this->adminDashboard());
        }

        if (in_array($user->role, ['teacher', 'janitor', 'technician'])) {
            if ($user->teams()->exists()) {
                return redirect()->route('team.dashboard');
            }
        }

        return Inertia::render('dashboard/Index', $this->studentDashboard());
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
