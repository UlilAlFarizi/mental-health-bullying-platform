<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Question;
use Illuminate\Support\Facades\DB;

class QuestionSeeder extends Seeder
{
    public function run(): void
    {
        // Kosongkan tabel sebelum seeding ulang agar tidak duplikat
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        Question::truncate();
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');

        $questions = [
            // ================= KATEGORI VERBAL (Indeks 0 - 4) =================
            // G01
            ['teks_pertanyaan' => 'Apakah kamu pernah menerima panggilan nama (julukan) yang merendahkan, mengejek, atau bernada rasis?'],
            // G02
            ['teks_pertanyaan' => 'Seberapa sering kamu mendapat komentar negatif yang menyakiti hati tentang bentuk tubuhmu (body shaming)?'],
            // G03
            ['teks_pertanyaan' => 'Pernahkah kamu dibentak, disoraki, atau ditertawakan dengan sengaja saat kamu sedang mencoba berbicara?'],
            // G04
            ['teks_pertanyaan' => 'Apakah kamu mulai mempercayai bahwa ucapan-ucapan buruk mereka tentang dirimu adalah sebuah kebenaran?'],
            // G05
            ['teks_pertanyaan' => 'Seberapa sering kamu merasa harus diam dan sangat takut salah bicara ketika berada di dekat orang tertentu?'],
            
            // ================= KATEGORI FISIK (Indeks 5 - 9) =================
            // G06
            ['teks_pertanyaan' => 'Apakah kamu pernah mendapatkan memar, luka, atau goresan di tubuh akibat perlakuan kasar orang lain?'],
            // G07
            ['teks_pertanyaan' => 'Pernahkah barang pribadimu (seperti seragam, tas, topi, buku) dirusak, dikotori, atau diambil secara paksa?'],
            // G08
            ['teks_pertanyaan' => 'Apakah kamu memiliki refleks kaget atau otomatis melindungi kepala/tubuh saat ada orang yang mendekat secara tiba-tiba?'],
            // G09
            ['teks_pertanyaan' => 'Seberapa sering kamu sengaja memakai jaket atau pakaian tertutup (meski cuaca panas) hanya untuk menutupi luka/memar di tubuh?'],
            // G10
            ['teks_pertanyaan' => 'Pernahkah kamu memalsukan alasan sakit (seperti mendadak pusing/sakit perut) agar kamu tidak perlu pergi ke sekolah atau kampus?'],
            
            // ================= KATEGORI SOSIAL (Indeks 10 - 14) =================
            // G11
            ['teks_pertanyaan' => 'Seberapa sering kamu secara sengaja diabaikan, tidak diajak bergaul, atau ditinggalkan oleh teman-teman sekelasmu?'],
            // G12
            ['teks_pertanyaan' => 'Apakah kamu pernah menjadi sasaran rumor, fitnah, atau gosip palsu yang bertujuan merusak reputasimu?'],
            // G13
            ['teks_pertanyaan' => 'Seberapa sering kamu dibiarkan sendirian (misalnya saat makan siang) atau sengaja diabaikan saat pembagian tugas kelompok?'],
            // G14
            ['teks_pertanyaan' => 'Pernahkah kamu sengaja bersembunyi di tempat sepi (seperti toilet, perpustakaan, UKS) saat jam istirahat untuk menghindari bertemu orang lain?'],
            // G15
            ['teks_pertanyaan' => 'Apakah kamu merasakan ketakutan atau kecemasan yang luar biasa saat harus tampil di depan umum karena takut disoraki atau dihakimi?'],
            
            // ================= KATEGORI SIBER (Indeks 15 - 19) =================
            // G16
            ['teks_pertanyaan' => 'Pernahkah kamu menerima pesan (DM), chat, atau komentar di internet yang berisi ancaman atau kebencian yang ditujukan padamu?'],
            // G17
            ['teks_pertanyaan' => 'Apakah kamu merasa panik, gemetar, atau cemas berlebihan setiap kali mendengar nada dering atau melihat notifikasi dari HP-mu?'],
            // G18
            ['teks_pertanyaan' => 'Apakah pernah ada orang yang menyebarkan foto atau video dirimu dengan tujuan untuk mempermalukanmu di grup obrolan atau media sosial?'],
            // G19
            ['teks_pertanyaan' => 'Pernahkah kamu tiba-tiba menghapus akun media sosialmu, mengganti nomor, atau mematikan HP untuk menghindari serangan komentar?'],
            // G20
            ['teks_pertanyaan' => 'Seberapa sering kamu merasa murung, sedih, atau bahkan langsung menangis tepat setelah mengecek layar HP atau media sosialmu?'],
            
            // ================= KATEGORI EMOSIONAL (Indeks 20 - 24) =================
            // G21
            ['teks_pertanyaan' => 'Apakah kamu belakangan ini kehilangan minat secara drastis pada hobi, ekstrakurikuler, atau aktivitas yang dulunya sangat kamu sukai?'],
            // G22
            ['teks_pertanyaan' => 'Seberapa sering kamu mengalami gangguan tidur yang parah (seperti sulit tidur karena terus memikirkan hal buruk atau justru tidur terus-menerus)?'],
            // G23
            ['teks_pertanyaan' => 'Apakah kamu mengalami perubahan pola makan yang ekstrem (seperti tidak mau makan sama sekali atau justru makan berlebihan saat sedang stres)?'],
            // G24
            ['teks_pertanyaan' => 'Pernahkah kamu merasa terus-menerus menyalahkan dirimu sendiri atas semua kejadian buruk dan merasa bahwa dirimu tidak berharga?'],
            // G25
            ['teks_pertanyaan' => 'Apakah akhir-akhir ini kamu merasa sangat sensitif, mudah menangis secara tiba-tiba, atau mudah meledak marah hanya karena hal-hal kecil (mood swing)?'],
        ];

        foreach ($questions as $q) {
            Question::create($q);
        }
    }
}