<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Membuat akun Superadmin / Tester
        User::factory()->create([
            'name' => 'Super Admin',
            'email' => "ulilalfarizi1986@gmail.com",
            'password' => Hash::make('password123'), // Jangan lupa passwordnya
            'role' => 'superadmin',
            'is_verified' => true // Langsung lolos verifikasi OTP
        ]);

        User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@example.com',
            'password' => Hash::make('password123'),
            'role' => 'user',
            'is_verified' => true
        ]);

        // 2. Menjalankan Seeder Pertanyaan Sistem Pakar
        $this->call([
            QuestionSeeder::class,
        ]);
        
        $this->command->info('Database berhasil di-seed! 25 Pertanyaan sistem pakar telah dimasukkan.');
    }
}