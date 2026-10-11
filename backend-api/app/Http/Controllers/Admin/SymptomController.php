<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Symptom;
use App\Models\BullyingType;
use Illuminate\Http\Request;

class SymptomController extends Controller
{
    // Cek Akses (Hanya Admin & Superadmin yang boleh)
    private function checkAdminAccess(Request $request)
    {
        if (!in_array($request->user()->role, ['admin', 'superadmin'])) {
            abort(403, 'Akses Ditolak! Anda bukan Admin.');
        }
    }

    // 1. READ: Ambil semua data (sekaligus dengan nama jenis bullying-nya)
    public function index(Request $request)
    {
        $this->checkAdminAccess($request);
        
        $symptoms = Symptom::with('bullyingType')->orderBy('code', 'asc')->get();
        $types = BullyingType::all(); // Untuk pilihan dropdown di Frontend

        return response()->json([
            'symptoms' => $symptoms,
            'bullying_types' => $types
        ]);
    }

    // 2. CREATE: Tambah Gejala Baru
    public function store(Request $request)
    {
        $this->checkAdminAccess($request);

        $request->validate([
            'bullying_type_id' => 'required|exists:bullying_types,id',
            'code' => 'required|string|unique:symptoms,code',
            'question_text' => 'required|string'
        ]);

        $symptom = Symptom::create($request->all());

        return response()->json(['message' => 'Gejala berhasil ditambahkan!', 'data' => $symptom], 201);
    }

    // 3. UPDATE: Edit Gejala
    public function update(Request $request, $id)
    {
        $this->checkAdminAccess($request);

        $symptom = Symptom::findOrFail($id);

        $request->validate([
            'bullying_type_id' => 'required|exists:bullying_types,id',
            'code' => 'required|string|unique:symptoms,code,' . $symptom->id,
            'question_text' => 'required|string'
        ]);

        $symptom->update($request->all());

        return response()->json(['message' => 'Gejala berhasil diperbarui!', 'data' => $symptom]);
    }

    // 4. DELETE: Hapus Gejala
    public function destroy(Request $request, $id)
    {
        $this->checkAdminAccess($request);

        $symptom = Symptom::findOrFail($id);
        $symptom->delete();

        return response()->json(['message' => 'Gejala berhasil dihapus!']);
    }
}