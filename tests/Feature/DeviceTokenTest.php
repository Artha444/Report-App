<?php

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

it('stores a device token for authenticated user', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->postJson('/device-tokens', [
        'token' => 'abc-123',
    ]);

    $response->assertOk();
    $this->assertDatabaseHas('device_tokens', [
        'user_id' => $user->id,
        'token' => 'abc-123',
    ]);
});

it('updates user_id when same token is registered by different user', function () {
    $userA = User::factory()->create();
    $userB = User::factory()->create();

    $this->actingAs($userA)->postJson('/device-tokens', ['token' => 'shared-token']);

    $response = $this->actingAs($userB)->postJson('/device-tokens', ['token' => 'shared-token']);

    $response->assertOk();
    $this->assertDatabaseHas('device_tokens', [
        'user_id' => $userB->id,
        'token' => 'shared-token',
    ]);
    $this->assertDatabaseCount('device_tokens', 1);
});

it('reregisters same token for same user without error', function () {
    $user = User::factory()->create();

    $this->actingAs($user)->postJson('/device-tokens', ['token' => 'my-token']);
    $response = $this->actingAs($user)->postJson('/device-tokens', ['token' => 'my-token']);

    $response->assertOk();
    $this->assertDatabaseCount('device_tokens', 1);
});

it('requires authentication', function () {
    $response = $this->postJson('/device-tokens', ['token' => 'abc']);

    $response->assertUnauthorized();
});

it('requires token field', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->postJson('/device-tokens', []);

    $response->assertUnprocessable();
});

it('removes old tokens when registering new one', function () {
    $user = User::factory()->create();

    $this->actingAs($user)->postJson('/device-tokens', ['token' => 'old-token']);
    $this->actingAs($user)->postJson('/device-tokens', ['token' => 'new-token']);

    $this->assertDatabaseCount('device_tokens', 1);
    $this->assertDatabaseHas('device_tokens', ['token' => 'new-token']);
    $this->assertDatabaseMissing('device_tokens', ['token' => 'old-token']);
});
