<!DOCTYPE html>
<html>
<body style="font-family: Arial, sans-serif; background-color: #f8fafc; padding: 20px;">
    <div style="max-width: 500px; margin: 0 auto; background: white; padding: 30px; border-radius: 15px; text-align: center; border-top: 5px solid #e63946;">
        <h2 style="color: #333;">Pemulihan Password 🔐</h2>
        <p style="color: #666; font-size: 16px;">Kami menerima permintaan untuk mereset password akun MindCare Anda. Gunakan kode OTP 6-digit ini untuk membuat password baru:</p>
        
        <div style="background: #fff0f3; color: #e63946; font-size: 32px; font-weight: bold; letter-spacing: 5px; padding: 15px; border-radius: 10px; margin: 30px 0;">
            {{ $otpCode }}
        </div>
        
        <p style="color: #999; font-size: 13px;">Jika Anda tidak merasa meminta kode ini, abaikan saja email ini. Akun Anda tetap aman.</p>
    </div>
</body>
</html>