<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Confession;
use App\Models\Question;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;

class AdminController extends Controller
{
    public function getStats(Request $request)
    {
        if ($request->user()->role !== 'admin' && $request->user()->role !== 'superadmin') {
            return response()->json([
                'error' => 'Akses Ditolak! Anda bukan Admin.'
            ], 403);
        }

        // =========================================================
        // 1. DATA DASAR
        // =========================================================
        $totalUsers = User::count();
        $totalConfessions = Confession::count();

        try {
            $totalTests = DB::table('test_results')->count();
        } catch (\Exception $e) {
            $totalTests = 0;
        }

        // =========================================================
        // 2. GRAFIK TINGKAT KEPARAHAN
        // =========================================================
        try {
            $severityData = DB::table('test_results')
                ->select('severity_level', DB::raw('count(*) as count'))
                ->groupBy('severity_level')
                ->get();
        } catch (\Exception $e) {
            $severityData = [];
        }

        // =========================================================
        // 3. GRAFIK GEJALA PALING SERING DIALAMI
        // Support format lama:
        // ["G01","G02"]
        //
        // Support format baru:
        // [{"code":"G01","score":1,"level":"Pernah"}]
        // =========================================================
        $frequentSymptoms = [];

        try {
            $questions = Question::orderBy('id')->get();

            $testResults = DB::table('test_results')
                ->whereNotNull('detected_tendencies')
                ->where('detected_tendencies', '!=', '')
                ->get();

            $counts = [];

            foreach ($testResults as $result) {
                $items = json_decode($result->detected_tendencies, true);

                if (is_string($items)) {
                    $items = json_decode($items, true);
                }

                if (!is_array($items)) {
                    continue;
                }

                foreach ($items as $item) {
                    if (is_array($item)) {
                        $code = $item['code'] ?? '';
                    } else {
                        $code = $item;
                    }

                    $code = trim((string) $code);

                    if ($code === '') {
                        continue;
                    }

                    if (!isset($counts[$code])) {
                        $counts[$code] = 0;
                    }

                    $counts[$code]++;
                }
            }

            foreach ($counts as $code => $total) {
                $number = (int) str_replace('G', '', $code);
                $question = $questions[$number - 1] ?? null;

                $frequentSymptoms[] = [
                    'code' => $code,
                    'label' => $code,
                    'teks_pertanyaan' => $question ? $question->teks_pertanyaan : 'Pertanyaan tidak ditemukan',
                    'total' => $total,
                ];
            }

            usort($frequentSymptoms, function ($a, $b) {
                return $b['total'] <=> $a['total'];
            });

            $frequentSymptoms = array_slice($frequentSymptoms, 0, 5);
        } catch (\Throwable $e) {
            $frequentSymptoms = [];
        }

        // =========================================================
        // 4. RIWAYAT PEMETAAN GEJALA PENGGUNA
        // Ini yang tadi kosong.
        // Sekarang dibuat support format lama dan baru.
        // =========================================================
        $userConsultationHistory = [];

        try {
            $questions = Question::orderBy('id')->get();

            $rawHistory = DB::table('test_results')
                ->leftJoin('users', 'test_results.user_id', '=', 'users.id')
                ->select(
                    'test_results.id',
                    'test_results.user_id',
                    'users.name as user_name',
                    'test_results.bullying_type',
                    'test_results.severity_level',
                    'test_results.detected_tendencies',
                    'test_results.created_at'
                )
                ->orderBy('test_results.created_at', 'desc')
                ->take(10)
                ->get();

            $userConsultationHistory = collect($rawHistory)->map(function ($item) use ($questions) {
                $detectedSymptoms = [];

                if (!empty($item->detected_tendencies)) {
                    $items = json_decode($item->detected_tendencies, true);

                    if (is_string($items)) {
                        $items = json_decode($items, true);
                    }

                    if (is_array($items)) {
                        foreach ($items as $data) {
                            // Format baru
                            if (is_array($data)) {
                                $code = $data['code'] ?? '';
                                $score = (int) ($data['score'] ?? 1);
                                $level = $data['level'] ?? 'Pernah';
                            } 
                            // Format lama
                            else {
                                $code = trim((string) $data);
                                $score = 1;
                                $level = 'Pernah';
                            }

                            if ($code === '') {
                                continue;
                            }

                            $number = (int) str_replace('G', '', $code);
                            $question = $questions[$number - 1] ?? null;

                            $detectedSymptoms[] = [
                                'code' => $code,
                                'score' => $score,
                                'level' => $level,
                                'text' => $question ? $question->teks_pertanyaan : 'Pertanyaan tidak ditemukan',
                            ];
                        }
                    }
                }

                return [
                    'id' => $item->id,
                    'user_id' => $item->user_id,
                    'user_name' => $item->user_name ?? 'Anonim Pengguna',
                    'bullying_type' => $item->bullying_type ?? 'Tidak diketahui',
                    'severity_level' => $item->severity_level ?? 'Tidak diketahui',
                    'created_at' => $item->created_at,
                    'detected_symptoms' => $detectedSymptoms,
                ];
            })->values();
        } catch (\Throwable $e) {
            $userConsultationHistory = [];
        }

        // =========================================================
        // 5. CERITA CURHAT TERBARU
        // =========================================================
        try {
            $recentConfessions = Confession::orderBy('created_at', 'desc')
                ->take(20)
                ->get();
        } catch (\Throwable $e) {
            $recentConfessions = [];
        }

        return response()->json([
            'total_users' => $totalUsers,
            'total_tests' => $totalTests,
            'total_confessions' => $totalConfessions,
            'severity_data' => $severityData,
            'frequent_symptoms' => $frequentSymptoms,
            'consultation_history' => $userConsultationHistory,
            'recent_confessions' => $recentConfessions,
        ]);
    }

    public function deleteConfession(Request $request, $id)
    {
        if ($request->user()->role !== 'admin' && $request->user()->role !== 'superadmin') {
            return response()->json([
                'error' => 'Akses Ditolak! Anda bukan Admin.'
            ], 403);
        }

        Confession::destroy($id);

        return response()->json([
            'status' => 'success',
            'message' => 'Cerita berhasil dihapus secara permanen dari sistem.',
        ]);
    }
}