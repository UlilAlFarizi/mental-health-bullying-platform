# Web Platform Deteksi Kesehatan Mental & Asesmen Perilaku Bullying

🏆 **Juara 2 Technovation UNJAYA 2026** (Kategori Inovasi Teknologi)

Platform web terintegrasi untuk deteksi dini parameter kesehatan mental dan evaluasi kecenderungan perilaku perundungan berbasis skala kuesioner terstandar, inferensi logika fuzzy, serta AI guardrails.

---

## 🛠️ Tech Stack & Arsitektur

- **Backend:** PHP (Laravel), Laravel Sanctum (Token Auth & Email OTP), MySQL
- **Frontend:** React, Vite, Tailwind CSS / Bootstrap
- **AI & Logika Sistem:** Inferensi Logika Fuzzy, Chatbot Guardrails
- **Metodologi Analisis:** Design Thinking & PIECES Framework

---

## ✨ Fitur Utama

- **Autentikasi & Keamanan:** Registrasi dengan verifikasi OTP via email, otentikasi token aman via Laravel Sanctum, dan kontrol hak akses (*role-based access*).
- **Asesmen Psikososial Terstandar:** Pengisian kuesioner deteksi kesehatan mental dengan kalkulasi inferensi logika fuzzy untuk pemetaan risiko secara objektif.
- **AI Chatbot Guardrails:** Pembatasan respons chatbot cerdas untuk memastikan saran dan informasi psikososial yang diberikan tetap aman serta terpercaya.
- **Riwayat & Dashboard:** Penyimpanan riwayat hasil evaluasi pengguna secara terstruktur dan real-time.

---

## 🚀 Cara Menjalankan Proyek Secara Lokal

### 1. Backend API (Laravel)
```bash
cd backend-api
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
php artisan serve

### 2. Frontend UI (React + Vite)
```bash
cd frontend-ui
npm install
npm run dev
