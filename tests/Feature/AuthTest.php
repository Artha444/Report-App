<?php

use App\Models\User;

test('registration screen can be rendered', function () {
    $response = $this->get('/register');

    $response->assertSuccessful();
});

test('new users can register', function () {
    $response = $this->post('/register', [
        'name' => 'Test User',
        'email' => 'test@example.com',
        'password' => 'password',
        'password_confirmation' => 'password',
    ]);

    $this->assertAuthenticated();
    $response->assertRedirect(route('dashboard', absolute: false));
});

test('login screen can be rendered', function () {
    $response = $this->get('/login');

    $response->assertSuccessful();
});

test('users can authenticate', function () {
    $user = User::factory()->create();

    $response = $this->post('/login', [
        'email' => $user->email,
        'password' => 'password',
    ]);

    $this->assertAuthenticated();
    $response->assertRedirect(route('dashboard', absolute: false));
});

test('users can logout', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->post('/logout');

    $this->assertGuest();
    $response->assertRedirect(route('home', absolute: false));
});

test('guests are redirected to login when accessing dashboard', function () {
    $response = $this->get('/dashboard');

    $response->assertRedirect(route('login', absolute: false));
});

test('registration requires name', function () {
    $response = $this->post('/register', [
        'email' => 'test@example.com',
        'password' => 'password',
        'password_confirmation' => 'password',
    ]);

    $response->assertSessionHasErrors('name');
});

test('registration requires valid email', function () {
    $response = $this->post('/register', [
        'name' => 'Test User',
        'email' => 'not-an-email',
        'password' => 'password',
        'password_confirmation' => 'password',
    ]);

    $response->assertSessionHasErrors('email');
});

test('registration requires password confirmation', function () {
    $response = $this->post('/register', [
        'name' => 'Test User',
        'email' => 'test@example.com',
        'password' => 'password',
        'password_confirmation' => 'wrong',
    ]);

    $response->assertSessionHasErrors('password');
});

test('registration requires minimum password length', function () {
    $response = $this->post('/register', [
        'name' => 'Test User',
        'email' => 'test@example.com',
        'password' => 'short',
        'password_confirmation' => 'short',
    ]);

    $response->assertSessionHasErrors('password');
});

test('login requires email', function () {
    $response = $this->post('/login', [
        'password' => 'password',
    ]);

    $response->assertSessionHasErrors('email');
});

test('login requires password', function () {
    $response = $this->post('/login', [
        'email' => 'test@example.com',
    ]);

    $response->assertSessionHasErrors('password');
});

test('registered user has student role', function () {
    $this->post('/register', [
        'name' => 'Test User',
        'email' => 'test@example.com',
        'password' => 'password',
        'password_confirmation' => 'password',
    ]);

    expect(User::first()->role)->toBe('student');
});

test('user model role helpers', function () {
    $student = User::factory()->create(['role' => 'student']);
    $teacher = User::factory()->create(['role' => 'teacher']);
    $admin = User::factory()->create(['role' => 'admin']);

    expect($student->isStudent())->toBeTrue();
    expect($student->isTeacher())->toBeFalse();
    expect($student->isAdmin())->toBeFalse();

    expect($teacher->isTeacher())->toBeTrue();
    expect($teacher->isStudent())->toBeFalse();

    expect($admin->isAdmin())->toBeTrue();
    expect($admin->isStudent())->toBeFalse();
});

test('check role middleware allows matching role', function () {
    $user = User::factory()->create(['role' => 'teacher']);

    Route::get('/_test/check-role', function () {
        return 'ok';
    })->middleware('role:teacher,admin');

    $this->actingAs($user)
        ->get('/_test/check-role')
        ->assertSuccessful();
});

test('check role middleware blocks non-matching role', function () {
    $user = User::factory()->create(['role' => 'student']);

    Route::get('/_test/check-role-block', function () {
        return 'ok';
    })->middleware('role:teacher,admin');

    $this->actingAs($user)
        ->get('/_test/check-role-block')
        ->assertForbidden();
});

test('check role middleware blocks guests', function () {
    Route::get('/_test/check-role-guest', function () {
        return 'ok';
    })->middleware('role:teacher,admin');

    $this->get('/_test/check-role-guest')
        ->assertForbidden();
});
