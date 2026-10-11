<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\TestResult;
use App\Models\UserTask;
use App\Models\Symptom;
use App\Models\BullyingType;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Schema;
use App\Mail\VerifyOtpMail;
use App\Mail\ResetPasswordMail;

class AuthController extends Controller
{
    // =========================================================
    // FUNGSI AUTENTIKASI & OTP
    // =========================================================

    public function register(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:6',
        ]);

        $otp = rand(100000, 999999);

        $data = [
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'otp' => $otp,
            'is_verified' => false,
        ];

        if (Schema::hasColumn('users', 'role')) {
            $data['role'] = 'user';
        }

        $user = User::create($data);

        Mail::to($user->email)->send(new VerifyOtpMail($otp));

        return response()->json([
            'message' => 'Registrasi Berhasil. Silakan cek email Anda untuk kode OTP.',
            'email' => $user->email,
        ], 201);
    }

    public function verifyOtp(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'otp' => 'required',
        ]);

        $user = User::where('email', $request->email)
            ->where('otp', $request->otp)
            ->first();

        if (!$user) {
            return response()->json([
                'message' => 'Kode OTP salah atau tidak valid!',
            ], 400);
        }

        $user->is_verified = true;
        $user->otp = null;

        if (Schema::hasColumn('users', 'email_verified_at')) {
            $user->email_verified_at = now();
        }

        $user->save();

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Email berhasil diverifikasi!',
            'access_token' => $token,
            'token_type' => 'Bearer',
            'role' => $user->role ?? 'user',
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role ?? 'user',
            ],
        ]);
    }

    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required|string',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json([
                'message' => 'Email atau Password salah',
            ], 401);
        }

        if (Schema::hasColumn('users', 'is_verified') && !$user->is_verified) {
            return response()->json([
                'message' => 'Akun belum diverifikasi. Silakan daftar ulang atau cek email Anda.',
            ], 403);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Login berhasil',
            'access_token' => $token,
            'token_type' => 'Bearer',
            'role' => $user->role ?? 'user',
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role ?? 'user',
            ],
        ]);
    }

    public function forgotPassword(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user) {
            return response()->json([
                'message' => 'Email tidak terdaftar di sistem kami.',
            ], 404);
        }

        $otp = rand(100000, 999999);

        $user->otp = $otp;
        $user->save();

        Mail::to($user->email)->send(new ResetPasswordMail($otp));

        return response()->json([
            'message' => 'Kode OTP pemulihan telah dikirim ke email Anda.',
        ]);
    }

    public function resetPassword(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'otp' => 'required',
            'password' => 'required|string|min:6',
        ]);

        $user = User::where('email', $request->email)
            ->where('otp', $request->otp)
            ->first();

        if (!$user) {
            return response()->json([
                'message' => 'Kode OTP salah atau sudah kadaluarsa.',
            ], 400);
        }

        $user->password = Hash::make($request->password);
        $user->otp = null;
        $user->save();

        return response()->json([
            'message' => 'Password berhasil diubah! Silakan login dengan password baru.',
        ]);
    }

// =========================================================
    // FUNGSI UTAMA: SISTEM PAKAR (FIX KATEGORI DINAMIS)
    // =========================================================
    public function submitTest(Request $request)
    {
        $request->validate([
            'scores' => 'nullable|array',
            'answers' => 'nullable|array',
        ]);

        $user = $request->user();
        $detectedSymptomDetails = [];
        $listOfSymptomCodesOnly = [];

        // 💡 FIX FATAL: Hapus nama kategori statis. Kita gunakan array kosong
        // agar nama kategori apa pun dari database bisa otomatis masuk!
        $categoriesScores = [];
        $totalScore = 0;

        $allSymptomsInDb = \App\Models\Symptom::with('bullyingType')->orderBy('id', 'asc')->get()->values();

        // 1. PEMETAAN JAWABAN
        if ($request->has('answers') && is_array($request->answers)) {
            foreach ($request->answers as $ans) {
                $symptomId = intval($ans['symptom_id'] ?? 0);
                $scoreValue = intval($ans['score'] ?? 0);
                
                $symptomModel = \App\Models\Symptom::with('bullyingType')->find($symptomId);
                if ($symptomModel) {
                    $totalScore += $scoreValue;
                    $categoryName = $symptomModel->bullyingType ? $symptomModel->bullyingType->name : 'Umum';
                    
                    if ($scoreValue > 0) {
                        // Tambahkan kategori baru ke array secara dinamis jika belum ada
                        if (!isset($categoriesScores[$categoryName])) {
                            $categoriesScores[$categoryName] = 0;
                        }
                        $categoriesScores[$categoryName] += $scoreValue;
                        
                        $this->logUserAnswer($user->id, $symptomModel->id, $scoreValue, $symptomModel->code, $detectedSymptomDetails, $listOfSymptomCodesOnly);
                    }
                }
            }
        } else {
            $scores = array_map('intval', $request->scores ?? []);
            $totalScore = array_sum($scores);

            foreach ($allSymptomsInDb as $index => $symptomModel) {
                $scoreValue = isset($scores[$index]) ? intval($scores[$index]) : 0;
                $categoryName = $symptomModel->bullyingType ? $symptomModel->bullyingType->name : 'Umum';

                if ($scoreValue > 0) {
                    if (!isset($categoriesScores[$categoryName])) {
                        $categoriesScores[$categoryName] = 0;
                    }
                    $categoriesScores[$categoryName] += $scoreValue;

                    $this->logUserAnswer($user->id, $symptomModel->id, $scoreValue, $symptomModel->code, $detectedSymptomDetails, $listOfSymptomCodesOnly);
                }
            }
        }

        // 2. TAHAP EVALUASI ATURAN KATEGORI AKTIF
        $detectedTypes = [];
        $tendencyDetails = [];

        foreach ($categoriesScores as $type => $catTotal) {
            if ($catTotal > 0) {
                $percentage = round(($catTotal / 15) * 100); 
                $tendencyDetails[] = [
                    'type' => $type,
                    'score' => $catTotal,
                    'percentage' => $percentage . '%',
                ];

                $detectedTypes[] = [
                    'type' => $type,
                    'score' => $catTotal,
                ];
            }
        }

        // 3. PENENTUAN DOMINAN JENIS (1-3 Kategori)
        $totalActiveCategories = count($detectedTypes);

        if ($totalActiveCategories === 0) {
            $dominantType = 'Tidak Terindikasi Sistematis';
        } elseif ($totalActiveCategories >= 1 && $totalActiveCategories <= 3) {
            usort($detectedTypes, function ($a, $b) {
                return $b['score'] <=> $a['score'];
            });
            $typesArray = array_column($detectedTypes, 'type');
            $dominantType = 'Bullying ' . implode(', ', $typesArray);
        } else {
            $dominantType = 'Multi-Indikasi Bullying (Trauma Kompleks)';
        }

        $listOfSymptomCodesOnly = array_unique($listOfSymptomCodesOnly);
        $detectedSymptomsString = count($listOfSymptomCodesOnly) > 0 
            ? implode(', ', $listOfSymptomCodesOnly) 
            : 'Tidak ada gejala spesifik';

        // 4. PENENTUAN KEPARAHAN GLOBAL
        if ($totalScore >= 40) {
            $severity = 'Tingkat Berat (Kritis)';
            $rec = 'Analisis mendeteksi indikasi kuat bullying tingkat lanjut. Trauma yang dialami sangat berisiko. Segera hubungi guru BK, psikolog, atau layanan SAPA 129.';
        } elseif ($totalScore >= 15) {
            $severity = 'Tingkat Sedang';
            $rec = 'Dampak perundungan membebani pikiranmu secara psikologis. Sangat disarankan untuk mulai mencari dukungan dari ahli atau orang dewasa yang dipercaya.';
        } elseif ($totalScore > 0) {
            $severity = 'Tingkat Ringan';
            $rec = 'Indikasi awal trauma bullying terbentuk. Tetap waspada, bangun kembali kepercayaan dirimu, dan jangan ragu untuk bercerita pada sahabat.';
        } else {
            $severity = 'Stabil / Konflik Biasa';
            $rec = 'Gejala belum memenuhi kriteria mutlak bullying penindasan. Ini mungkin konflik pertemanan biasa atau kesalahpahaman. Tetap jaga kesehatan mentalmu ya!';
        }

        // 5. SIMPAN KE DATABASE
        $resultData = [
            'user_id' => $user ? $user->id : null,
            'total_score' => $totalScore,
            'bullying_type' => $dominantType,
            'severity_level' => $severity,
            'recommendation' => $rec,
            'detected_tendencies' => json_encode($detectedSymptomDetails),
        ];

        if (\Illuminate\Support\Facades\Schema::hasColumn('test_results', 'detected_symptoms')) {
            $resultData['detected_symptoms'] = $detectedSymptomsString;
        }

        $result = TestResult::create($resultData);

        return response()->json([
            'message' => 'Hasil berhasil dianalisis',
            'tendencies' => $tendencyDetails,
            'detected_symptoms' => $detectedSymptomDetails,
            'data' => $result,
        ]);
    }

    /**
     * Helper privat pencatatan user_answers
     */
    private function logUserAnswer($userId, $symptomId, $scoreValue, $code, &$detectedSymptomDetails, &$listOfSymptomCodesOnly)
    {
        $levelLabel = 'Pernah';
        if ($scoreValue === 2) { $levelLabel = 'Sering'; } 
        elseif ($scoreValue === 3) { $levelLabel = 'Sangat Sering'; }

        $detectedSymptomDetails[] = ['code' => $code, 'score' => $scoreValue, 'level' => $levelLabel];
        $listOfSymptomCodesOnly[] = $code . ' - ' . $levelLabel;

        try {
            DB::table('user_answers')->insert([
                'user_id' => $userId, 'question_id' => $symptomId, 'is_yes' => true, 'created_at' => now(), 'updated_at' => now()
            ]);
        } catch (\Exception $e) {}
    }

    // =========================================================
    // FUNGSI RIWAYAT & USER LOGIN
    // =========================================================

    public function getHistory(Request $request)
    {
        $user = $request->user();

        $history = TestResult::where('user_id', $user->id)
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role ?? 'user',
            ],
            'history' => $history,
        ]);
    }

    // =========================================================
    // FUNGSI SELF-CARE TASK
    // =========================================================

    public function getTasks(Request $request)
    {
        $user = $request->user();

        $defaultTasks = [
            [
                'key' => 'breathing',
                'title' => 'Berhenti sejenak & tarik napas dalam',
                'subtitle' => '5 Menit',
            ],
            [
                'key' => 'journal',
                'title' => 'Catat satu hal positif hari ini',
                'subtitle' => 'Jurnal',
            ],
            [
                'key' => 'affirmation',
                'title' => 'Ucapkan afirmasi positif',
                'subtitle' => 'Pagi',
            ],
        ];

        $completed = [];

        if (Schema::hasTable('user_tasks')) {
            try {
                $completed = UserTask::where('user_id', $user->id)
                    ->whereDate('created_at', now()->toDateString())
                    ->pluck('task_key')
                    ->toArray();
            } catch (\Exception $e) {
                $completed = [];
            }
        }

        $tasks = collect($defaultTasks)->map(function ($task) use ($completed) {
            $task['completed'] = in_array($task['key'], $completed);
            return $task;
        })->values();

        return response()->json([
            'tasks' => $tasks,
            'completed_count' => count($completed),
            'total' => count($defaultTasks),
        ]);
    }

    public function toggleTask(Request $request)
    {
        $request->validate([
            'task_key' => 'required|string',
        ]);

        $user = $request->user();

        if (!Schema::hasTable('user_tasks')) {
            return response()->json([
                'message' => 'Tabel user_tasks belum tersedia.',
            ], 500);
        }

        $task = UserTask::where('user_id', $user->id)
            ->where('task_key', $request->task_key)
            ->whereDate('created_at', now()->toDateString())
            ->first();

        if ($task) {
            $task->delete();

            return response()->json([
                'message' => 'Task dibatalkan.',
                'completed' => false,
            ]);
        }

        UserTask::create([
            'user_id' => $user->id,
            'task_key' => $request->task_key,
        ]);

        return response()->json([
            'message' => 'Task ditandai selesai.',
            'completed' => true,
        ]);
    }

    // =========================================================
    // STATISTIK PUBLIK
    // =========================================================

    public function getStatistics()
    {
        $totalUsers = User::count();

        $totalTests = 0;
        if (Schema::hasTable('test_results')) {
            $totalTests = TestResult::count();
        }

        return response()->json([
            'total_users' => $totalUsers,
            'total_tests' => $totalTests,
        ]);
    }

    // =========================================================
    // MENGAMBIL PERTANYAAN SECARA ACAK PROPORSIONAL
    // =========================================================
    public function getDynamicQuestions()
    {
        try {
            $types = BullyingType::all();
            $questions = [];

            // 💡 PERBAIKAN UTAMA: Mengambil tepat 5 soal per kategori secara adil (5 Kategori x 5 Soal = 25 Soal)
            foreach ($types as $type) {
                $symptoms = Symptom::where('bullying_type_id', $type->id)
                    ->inRandomOrder()
                    ->limit(5)
                    ->get();

                foreach ($symptoms as $symp) {
                    $questions[] = [
                        'id' => $symp->id,
                        'symptom_id' => $symp->id,
                        'code' => $symp->code,
                        'type' => $type->name,
                        'bullying_type_id' => $symp->bullying_type_id,
                        'text' => $symp->question_text,
                        'teks_pertanyaan' => $symp->question_text // Mengunci dual-property mapping agar aman
                    ];
                }
            }
            
            shuffle($questions);
            return response()->json($questions);
        } catch (\Exception $e) {
            return response()->json([]);
        }
    }

    // 💡 FITUR TAMBAHAN: Mengambil semua data gejala untuk Tabel Edukasi di Home.jsx
    public function getPublicSymptoms()
    {
        try {
            $symptoms = Symptom::with('bullyingType')
                ->orderBy('code', 'asc')
                ->get();
            return response()->json($symptoms);
        } catch (\Exception $e) {
            return response()->json([]);
        }
    }
}