<?php

use App\Models\Report;
use App\Models\ReportLog;
use App\Models\Team;
use App\Models\User;
use Illuminate\Http\UploadedFile;

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

test('team member can resolve report with evidence', function () {
    $teacher = User::factory()->create(['role' => 'teacher']);
    $team = Team::factory()->create();
    $team->members()->attach($teacher);

    $report = Report::factory()->create([
        'status' => 'in_progress',
        'team_id' => $team->id,
    ]);

    $this->actingAs($teacher)->post("/team/reports/{$report->id}/resolve", [
        'resolution_evidence' => UploadedFile::fake()->image('evidence.jpg'),
        'resolution_notes' => 'Issue fixed',
    ]);

    expect($report->fresh()->status)->toBe('resolved');
    expect($report->fresh()->resolved_at)->not->toBeNull();
    expect($report->fresh()->resolution_notes)->toBe('Issue fixed');
});

test('resolve requires evidence and notes', function () {
    $teacher = User::factory()->create(['role' => 'teacher']);
    $team = Team::factory()->create();
    $team->members()->attach($teacher);

    $report = Report::factory()->create([
        'status' => 'in_progress',
        'team_id' => $team->id,
    ]);

    $response = $this->actingAs($teacher)->post("/team/reports/{$report->id}/resolve", []);
    $response->assertSessionHasErrors(['resolution_evidence', 'resolution_notes']);
});

test('admin can reject report', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    $report = Report::factory()->create(['status' => 'pending']);

    $this->actingAs($admin)->post("/admin/reports/{$report->id}/reject", [
        'rejection_reason' => 'Insufficient detail',
    ]);

    expect($report->fresh()->status)->toBe('rejected');
    expect($report->fresh()->rejection_reason)->toBe('Insufficient detail');
    expect(ReportLog::where('report_id', $report->id)->where('action', 'rejected')->exists())->toBeTrue();
});

test('reject requires reason', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    $report = Report::factory()->create(['status' => 'pending']);

    $response = $this->actingAs($admin)->post("/admin/reports/{$report->id}/reject", []);
    $response->assertSessionHasErrors('rejection_reason');
});

test('student can reopen resolved report', function () {
    $user = User::factory()->create(['role' => 'student']);
    $team = Team::factory()->create();
    $report = Report::factory()->create([
        'status' => 'resolved',
        'user_id' => $user->id,
        'team_id' => $team->id,
    ]);

    $this->actingAs($user)->post("/reports/{$report->id}/reopen", [
        'user_feedback' => 'Problem still exists',
    ]);

    expect($report->fresh()->status)->toBe('in_progress');
    expect($report->fresh()->user_feedback)->toBe('Problem still exists');
    expect(ReportLog::where('report_id', $report->id)->where('action', 'reopened')->exists())->toBeTrue();
});

test('student cannot reopen non-resolved report', function () {
    $user = User::factory()->create(['role' => 'student']);
    $report = Report::factory()->create([
        'status' => 'pending',
        'user_id' => $user->id,
    ]);

    $this->actingAs($user)->post("/reports/{$report->id}/reopen", [
        'user_feedback' => 'Test',
    ])->assertStatus(400);
});

test('non-owner cannot reopen report', function () {
    $owner = User::factory()->create(['role' => 'student']);
    $other = User::factory()->create(['role' => 'student']);
    $report = Report::factory()->create([
        'status' => 'resolved',
        'user_id' => $owner->id,
    ]);

    $this->actingAs($other)->post("/reports/{$report->id}/reopen", [
        'user_feedback' => 'Test',
    ])->assertForbidden();
});

test('reopen requires feedback', function () {
    $user = User::factory()->create(['role' => 'student']);
    $report = Report::factory()->create([
        'status' => 'resolved',
        'user_id' => $user->id,
    ]);

    $response = $this->actingAs($user)->post("/reports/{$report->id}/reopen", []);
    $response->assertSessionHasErrors('user_feedback');
});

test('reject requires pending status', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    $report = Report::factory()->create(['status' => 'confirmed']);

    $this->actingAs($admin)->post("/admin/reports/{$report->id}/reject", [
        'rejection_reason' => 'Too late',
    ])->assertStatus(400);

    expect($report->fresh()->status)->toBe('confirmed');
});

test('resolve requires in_progress status', function () {
    $teacher = User::factory()->create(['role' => 'teacher']);
    $team = Team::factory()->create();
    $team->members()->attach($teacher);

    $report = Report::factory()->create([
        'status' => 'pending',
        'team_id' => $team->id,
    ]);

    $this->actingAs($teacher)->post("/team/reports/{$report->id}/resolve", [
        'resolution_evidence' => UploadedFile::fake()->image('evidence.jpg'),
        'resolution_notes' => 'Done',
    ])->assertStatus(400);

    expect($report->fresh()->status)->toBe('pending');
});

test('reopen clears resolved_at', function () {
    $user = User::factory()->create(['role' => 'student']);
    $report = Report::factory()->create([
        'status' => 'resolved',
        'user_id' => $user->id,
        'resolved_at' => now(),
    ]);

    $this->actingAs($user)->post("/reports/{$report->id}/reopen", [
        'user_feedback' => 'Still broken',
    ]);

    expect($report->fresh()->resolved_at)->toBeNull();
});
