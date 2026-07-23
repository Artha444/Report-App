<?php

use App\Models\Report;
use App\Models\ReportLog;
use App\Models\Team;
use App\Models\User;

test('student can submit report', function () {
    $user = User::factory()->create(['role' => 'student']);

    $response = $this->actingAs($user)->post('/reports', [
        'title' => 'Broken window',
        'description' => 'Window in room 203 is cracked',
        'location' => 'Room 203',
        'priority' => 'medium',
    ]);

    $response->assertRedirect();
    expect(Report::where('title', 'Broken window')->exists())->toBeTrue();
    expect(ReportLog::where('action', 'created')->exists())->toBeTrue();
});

test('admin can confirm and assign report', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    $teacher = User::factory()->create(['role' => 'teacher']);
    $team = Team::factory()->create(['name' => 'Maintenance']);
    $team->members()->attach($teacher);

    $report = Report::factory()->create(['status' => 'pending']);

    $this->actingAs($admin)->post("/admin/reports/{$report->id}/confirm");
    expect($report->fresh()->status)->toBe('confirmed');

    $this->actingAs($admin)->post("/admin/reports/{$report->id}/assign", [
        'team_id' => $team->id,
    ]);
    expect($report->fresh()->status)->toBe('in_progress');
    expect($report->fresh()->team_id)->toBe($team->id);
});

test('team member can resolve report', function () {
    $teacher = User::factory()->create(['role' => 'teacher']);
    $team = Team::factory()->create();
    $team->members()->attach($teacher);

    $report = Report::factory()->create([
        'status' => 'in_progress',
        'team_id' => $team->id,
    ]);

    $this->actingAs($teacher)->post("/team/reports/{$report->id}/resolve");
    expect($report->fresh()->status)->toBe('resolved');
    expect($report->fresh()->resolved_at)->not->toBeNull();
});
