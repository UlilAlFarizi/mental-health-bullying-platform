<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserTask extends Model
{
    use HasFactory;

    // Mengizinkan Laravel untuk menyimpan data secara massal (Mass Assignment) ke kolom-kolom ini
    protected $fillable = [
        'user_id',
        'task_key',
        'is_completed',
    ];

    // Opsional tapi sangat disarankan: Mendefinisikan bahwa is_completed adalah tipe data boolean
    protected $casts = [
        'is_completed' => 'boolean',
    ];

    // Mendefinisikan relasi "Kebalikan" (Belongs To)
    // Artinya: Satu tugas (task) ini adalah milik satu pengguna (user) tertentu
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}