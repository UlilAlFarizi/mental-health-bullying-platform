<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Models\Question;
use App\Http\Controllers\Api\SuperAdminController;
use App\Http\Controllers\Api\ChatController;
use App\Http\Controllers\Admin\SymptomController;

// ==========================================
// RUTE PUBLIK (Bisa diakses siapa saja tanpa login / Mode Tamu)
// ==========================================
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/verify-otp', [AuthController::class, 'verifyOtp']);
Route::get('/statistics', [AuthController::class, 'getStatistics']);
Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);
Route::post('/reset-password', [AuthController::class, 'resetPassword']);

// 1. Agar tamu bisa mengambil dan menjawab soal tes statis (bawaan lama)
Route::get('/pertanyaan', function () {
    return Question::all();
});

// 2. Agar tamu bisa membaca (melihat) cerita di Ruang Curhat
Route::get('/community/confessions', [\App\Http\Controllers\CommunityController::class, 'index']);

// 3. Agar tamu bisa mengakses tabel list gejala di halaman Home tanpa error 401
Route::get('/education/symptoms', [AuthController::class, 'getPublicSymptoms']);

// 4. 💡 PINDAHKAN KE SINI: Agar Mode Tamu juga bisa mengambil 25 soal acak dari Admin di Test.jsx
Route::get('/questions/random', [AuthController::class, 'getDynamicQuestions']);


// ==========================================
// RUTE TERPROTEKSI (Harus login & punya Token)
// ==========================================
Route::middleware('auth:sanctum')->group(function () {
    
    // Fitur Utama (Hanya submit yang wajib login jika ingin simpan riwayat)
    Route::post('/submit-test', [AuthController::class, 'submitTest']);
    Route::get('/history', [AuthController::class, 'getHistory']);
    
    // Fitur Self-Care
    Route::get('/tasks', [AuthController::class, 'getTasks']);
    Route::post('/tasks/toggle', [AuthController::class, 'toggleTask']);

    // Route Khusus Admin
    Route::get('/admin/stats', [\App\Http\Controllers\AdminController::class, 'getStats']);
    Route::delete('/admin/confessions/{id}', [\App\Http\Controllers\AdminController::class, 'deleteConfession']);

    // --- API UNTUK CRUD GEJALA (ADMIN) ---
    Route::get('/admin/symptoms', [SymptomController::class, 'index']);
    Route::post('/admin/symptoms', [SymptomController::class, 'store']);
    Route::put('/admin/symptoms/{id}', [SymptomController::class, 'update']);
    Route::delete('/admin/symptoms/{id}', [SymptomController::class, 'destroy']);

    // Route Khusus Superadmin
    Route::post('/superadmin/create-admin', [SuperAdminController::class, 'createAdmin']);

    // Route Komunitas
    Route::post('/community/confessions', [\App\Http\Controllers\CommunityController::class, 'store']);
    Route::post('/community/confessions/{id}/hug', [\App\Http\Controllers\CommunityController::class, 'giveHug']);

});