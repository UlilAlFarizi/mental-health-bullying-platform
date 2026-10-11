<?php

namespace App\Http\Controllers;

use App\Models\Confession;
use Illuminate\Http\Request;

class CommunityController extends Controller
{
    public function index()
    {
        // Ambil 50 cerita terbaru
        $confessions = Confession::orderBy('created_at', 'desc')->take(50)->get();
        return response()->json($confessions);
    }

    public function store(Request $request)
    {
        $request->validate([
            'story' => 'required|string|max:1000',
        ]);

        // Daftar nama hewan lucu sebagai anonimitas
        $animals = ['Kucing', 'Panda', 'Kelinci', 'Koala', 'Beruang', 'Burung Hantu', 'Singa', 'Rubah'];
        $adjectives = ['Pemberani', 'Kuat', 'Tangguh', 'Sabar', 'Tenang', 'Hebat', 'Baik Hati'];
        
        $randomName = $animals[array_rand($animals)] . ' ' . $adjectives[array_rand($adjectives)];

        $confession = Confession::create([
            'author_alias' => $randomName,
            'story' => $request->story,
        ]);

        return response()->json(['message' => 'Cerita berhasil dikirim', 'data' => $confession]);
    }

    public function giveHug($id)
    {
        $confession = Confession::findOrFail($id);
        $confession->increment('hugs_count');
        return response()->json(['message' => 'Dukungan diberikan', 'data' => $confession]);
    }
}