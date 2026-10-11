<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens; // <-- 1. Tambahkan pemanggil Sanctum ini

class User extends Authenticatable
{
    // 2. Tambahkan HasApiTokens di sini agar User bisa membuat token login
    use HasApiTokens, HasFactory, Notifiable; 

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'otp',           // <--- TAMBAHKAN INI
        'is_verified',   // <--- TAMBAHKAN INI
        'role',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    // 3. Letakkan fungsi relasi Database di sini (Paling Bawah)
    /**
     * Relasi ke tabel test_results
     * 1 User bisa memiliki banyak Hasil Tes
     */
    public function testResults()
    {
        return $this->hasMany(TestResult::class);
    }
    public function tasks()
    {
        return $this->hasMany(UserTask::class);
    }
}