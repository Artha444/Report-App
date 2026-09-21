<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        User::factory()->create([
    'name' => 'Admin',
    'email' => 'admin@test.com',
    'role' => 'admin',
]);
User::factory()->create([
    'name' => 'Joko',
    'email' => 'teacher@test.com',
    'role' => 'teacher',
]);
User::factory()->create([
    'name' => 'Teddy',
    'email' => 'teacher2@test.com',
    'role' => 'teacher',
]);
User::factory()->create([
    'name' => 'Budi',
    'email' => 'teacher3@test.com',
    'role' => 'teacher',
]);
User::factory()->create([
    'name' => 'Slamet',
    'email' => 'janitor@test.com',
    'role' => 'janitor',
]);
User::factory()->create([
    'name' => 'Udin',
    'email' => 'janitor2@test.com',
    'role' => 'janitor',
]);
User::factory()->create([
    'name' => 'Ucup',
    'email' => 'technician@test.com',
    'role' => 'technician',
]);
User::factory()->create([
    'name' => 'Artha',
    'email' => 'student@test.com',
    'role' => 'student',
]);


    }
}
