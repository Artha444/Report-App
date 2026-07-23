<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Auth\LogoutController;
use App\Http\Controllers\Auth\RegisterController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\DeviceTokenController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\TeamController;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');

Route::middleware('guest')->group(function () {
    Route::get('login', [LoginController::class, 'create'])->name('login');
    Route::post('login', [LoginController::class, 'store']);
    Route::get('register', [RegisterController::class, 'create'])->name('register');
    Route::post('register', [RegisterController::class, 'store']);
});

Route::middleware('auth')->group(function () {
    Route::post('logout', [LogoutController::class, 'destroy'])->name('logout');
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::post('device-tokens', [DeviceTokenController::class, 'store'])->name('device-tokens.store');

    Route::prefix('reports')->name('reports.')->group(function () {
        Route::get('/', [ReportController::class, 'index'])->name('index');
        Route::get('create', [ReportController::class, 'create'])->name('create');
        Route::post('/', [ReportController::class, 'store'])->name('store');
        Route::get('{report}', [ReportController::class, 'show'])->name('show');
    });

    Route::middleware('role:admin')->prefix('admin')->name('admin.')->group(function () {
        Route::get('reports', [AdminController::class, 'reports'])->name('reports');
        Route::post('reports/{report}/confirm', [AdminController::class, 'confirm'])->name('reports.confirm');
        Route::post('reports/{report}/assign', [AdminController::class, 'assign'])->name('reports.assign');
        Route::get('users', [AdminController::class, 'users'])->name('users');
        Route::patch('users/{user}/role', [AdminController::class, 'updateRole'])->name('users.role');

        Route::get('teams', [TeamController::class, 'index'])->name('teams');
        Route::post('teams', [TeamController::class, 'store'])->name('teams.store');
        Route::put('teams/{team}', [TeamController::class, 'update'])->name('teams.update');
        Route::delete('teams/{team}', [TeamController::class, 'destroy'])->name('teams.destroy');
        Route::post('teams/{team}/members', [TeamController::class, 'addMember'])->name('teams.members.add');
        Route::delete('teams/{team}/members/{user}', [TeamController::class, 'removeMember'])->name('teams.members.remove');
    });

    Route::middleware('role:teacher')->prefix('team')->name('team.')->group(function () {
        Route::get('dashboard', [TeamController::class, 'dashboard'])->name('dashboard');
        Route::get('reports', [TeamController::class, 'reports'])->name('reports');
        Route::post('reports/{report}/in-progress', [TeamController::class, 'markInProgress'])->name('reports.in-progress');
        Route::post('reports/{report}/resolve', [TeamController::class, 'resolve'])->name('reports.resolve');
    });
});
