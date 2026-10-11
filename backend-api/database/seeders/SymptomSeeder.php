<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\BullyingType;
use App\Models\Symptom;

class SymptomSeeder extends Seeder
{
    public function run()
    {
        $data = [
            'Verbal (Lisan)' => [
                ['code' => 'G01', 'question_text' => 'Menerima panggilan nama (julukan) yang merendahkan atau rasis.'],
                ['code' => 'G02', 'question_text' => 'Mendapatkan komentar negatif tentang bentuk tubuh (body shaming).'],
                ['code' => 'G03', 'question_text' => 'Terus-menerus dibentak atau ditertawakan saat mencoba berbicara.'],
                ['code' => 'G04', 'question_text' => 'Menginternalisasi hinaan (korban mulai percaya bahwa ucapan buruk pelaku itu benar).'],
                ['code' => 'G05', 'question_text' => 'Menjadi sangat pendiam dan takut salah bicara ketika berada di dekat pelaku.'],
            ],
            'Fisik (Tubuh)' => [
                ['code' => 'G06', 'question_text' => 'Memiliki memar, luka, atau goresan di tubuh yang tidak bisa dijelaskan.'],
                ['code' => 'G07', 'question_text' => 'Barang pribadi (seragam, tas, buku) sering pulang dalam keadaan rusak, kotor, atau hilang.'],
                ['code' => 'G08', 'question_text' => 'Memiliki refleks defensif (kaget / refleks melindungi kepala) saat ada orang mendekat tiba-tiba.'],
                ['code' => 'G09', 'question_text' => 'Sengaja memakai pakaian tertutup (jaket/baju panjang) meski cuaca panas untuk menutupi memar.'],
                ['code' => 'G10', 'question_text' => 'Memalsukan alasan sakit (psikosomatis seperti sakit perut mendadak) agar tidak perlu ke sekolah.'],
            ],
            'Sosial (Pengucilan)' => [
                ['code' => 'G11', 'question_text' => 'Secara sengaja tidak diajak bergaul atau ditinggalkan oleh teman sekelas.'],
                ['code' => 'G12', 'question_text' => 'Menjadi sasaran rumor, fitnah, atau gosip yang menghancurkan reputasi di sekolah.'],
                ['code' => 'G13', 'question_text' => 'Selalu terlihat makan siang sendiri atau kesulitan mencari teman saat tugas kelompok.'],
                ['code' => 'G14', 'question_text' => 'Mengurung diri di tempat sepi secara sengaja (seperti perpustakaan, UKS, atau toilet) saat jam istirahat.'],
                ['code' => 'G15', 'question_text' => 'Menunjukkan ketakutan luar biasa untuk tampil di depan umum karena takut disoraki.'],
            ],
            'Siber (Digital)' => [
                ['code' => 'G16', 'question_text' => 'Menerima pesan (DM), email, atau komentar yang berisi ancaman/kebencian.'],
                ['code' => 'G17', 'question_text' => 'Menunjukkan kepanikan, gemetar, atau kecemasan berlebih setiap kali notifikasi HP berbunyi.'],
                ['code' => 'G18', 'question_text' => 'Menjadi sasaran penyebaran foto/video diam-diam di grup obrolan atau media sosial.'],
                ['code' => 'G19', 'question_text' => 'Menghapus akun media sosial secara tiba-tiba tanpa alasan yang jelas.'],
                ['code' => 'G20', 'question_text' => 'Terlihat sangat murung, sedih, atau menangis tepat setelah mengecek layar HP/Laptop.'],
            ],
            'Emosional (Mental)' => [
                ['code' => 'G21', 'question_text' => 'Kehilangan minat secara drastis pada hobi atau aktivitas yang dulunya sangat disukai.'],
                ['code' => 'G22', 'question_text' => 'Mengalami gangguan pola tidur parah (insomnia atau tidur terus-menerus karena overthinking).'],
                ['code' => 'G23', 'question_text' => 'Mengalami perubahan nafsu makan ekstrem (tidak mau makan sama sekali atau stress-eating).'],
                ['code' => 'G24', 'question_text' => 'Menyalahkan diri sendiri atas semua kejadian buruk dan merasa tidak berharga (worthless).'],
                ['code' => 'G25', 'question_text' => 'Mudah meledak marah, menangis, atau sangat sensitif terhadap hal-hal kecil (mood swing).'],
            ],
        ];

        foreach ($data as $typeName => $symptoms) {
            // 1. Buat Jenis Bullying
            $type = BullyingType::create(['name' => $typeName]);

            // 2. Masukkan Gejalanya berdasarkan ID jenis tersebut
            foreach ($symptoms as $symptom) {
                Symptom::create([
                    'bullying_type_id' => $type->id,
                    'code' => $symptom['code'],
                    'question_text' => $symptom['question_text']
                ]);
            }
        }
    }
}