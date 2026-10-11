<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: 'Arial', sans-serif; background-color: #f4f7f6; color: #333; }
        .container { max-width: 600px; margin: 20px auto; background: #fff; padding: 30px; border-radius: 12px; border-top: 8px solid #a3b18a; }
        h2 { color: #588157; }
        .result-box { background: #dad7cd; padding: 15px; border-radius: 8px; margin: 20px 0; }
        .footer { font-size: 12px; color: #888; margin-top: 30px; border-top: 1px solid #eee; padding-top: 10px; }
    </style>
</head>
<body>
    <div class="container">
        <h2>Halo, {{ $name }}</h2>
        <p>Terima kasih telah mempercayakan perasaanmu kepada kami. Berikut adalah rangkuman hasil evaluasi kesehatan mentalmu:</p>
        
        <div class="result-box">
            <strong>Skor Total:</strong> {{ $totalScore }} / 15<br>
            <strong>Kategori:</strong> {{ $category }}
        </div>

        <p><strong>Saran Kami:</strong></p>
        <p>{{ $recommendation }}</p>

        <p>Ingatlah bahwa hasil ini adalah deteksi dini. Jika kamu merasa sangat kesulitan, jangan ragu untuk bercerita kepada orang yang kamu percaya atau tenaga profesional.</p>

        <div class="footer">
            Email ini dikirim otomatis oleh Aplikasi Dukungan Mental.
        </div>
    </div>
</body>
</html>