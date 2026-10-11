import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import AnimatedContent from '../components/AnimatedContent';

const Register = () => {
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [loading, setLoading] = useState(false);
    const [showOtpModal, setShowOtpModal] = useState(false);
    const [otpCode, setOtpCode] = useState('');

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await axios.post('http://127.0.0.1:8000/api/register', { name, email, password });
            setLoading(false);
            setShowOtpModal(true);
        } catch (err) {
            alert(err.response?.data?.message || 'Registrasi gagal, email mungkin sudah dipakai.');
            setLoading(false);
        }
    };

    const handleVerifyOtp = async () => {
        if (otpCode.length !== 6) return alert('Kode OTP harus 6 digit!');

        setLoading(true);

        try {
            const response = await axios.post('http://127.0.0.1:8000/api/verify-otp', { email, otp: otpCode });
            localStorage.setItem('auth_token', response.data.access_token);
            navigate('/dashboard');
        } catch (err) {
            alert(err.response?.data?.message || 'OTP Salah!');
            setLoading(false);
        }
    };

    return (
        <div className="register-page">
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=Inter:wght@300;400;500;600;700&display=swap');

                * {
                    box-sizing: border-box;
                }

                .register-page {
                    min-height: 100vh;
                    width: 100%;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    padding: 40px 20px;
                    font-family: 'Inter', sans-serif;
                    background:
                        radial-gradient(circle at top right, rgba(122, 155, 118, 0.17), transparent 34%),
                        radial-gradient(circle at bottom left, rgba(30, 41, 59, 0.08), transparent 34%),
                        linear-gradient(135deg, #f8faf8 0%, #ffffff 48%, #eef4ef 100%);
                    position: relative;
                    overflow: hidden;
                }

                .register-page::before {
                    content: '';
                    position: absolute;
                    width: 430px;
                    height: 430px;
                    border-radius: 50%;
                    background: rgba(122, 155, 118, 0.12);
                    top: -160px;
                    left: -120px;
                    filter: blur(2px);
                }

                .register-page::after {
                    content: '';
                    position: absolute;
                    width: 360px;
                    height: 360px;
                    border-radius: 50%;
                    background: rgba(148, 163, 184, 0.12);
                    bottom: -140px;
                    right: -100px;
                    filter: blur(2px);
                }

                .register-shell {
                    width: 100%;
                    max-width: 980px;
                    min-height: 650px;
                    display: grid;
                    grid-template-columns: 1.05fr 0.95fr;
                    background: rgba(255, 255, 255, 0.76);
                    border: 1px solid rgba(226, 232, 240, 0.95);
                    border-radius: 34px;
                    box-shadow: 0 30px 80px rgba(15, 23, 42, 0.10);
                    overflow: hidden;
                    position: relative;
                    z-index: 1;
                    backdrop-filter: blur(18px);
                }

                .register-panel {
                    padding: 44px 48px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: rgba(255,255,255,0.9);
                }

                .register-card {
                    width: 100%;
                    max-width: 430px;
                }

                .register-visual {
                    position: relative;
                    padding: 42px;
                    background:
                        linear-gradient(145deg, rgba(122,155,118,0.92), rgba(74, 103, 72, 0.96)),
                        url('https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=900&q=80');
                    background-size: cover;
                    background-position: center;
                    color: white;
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                    overflow: hidden;
                }

                .register-visual::before {
                    content: '';
                    position: absolute;
                    inset: 0;
                    background: linear-gradient(180deg, rgba(15,23,42,0.10), rgba(15,23,42,0.45));
                }

                .visual-content {
                    position: relative;
                    z-index: 1;
                }

                .brand {
                    font-family: 'Playfair Display', serif;
                    font-size: 30px;
                    font-weight: 800;
                    letter-spacing: 0.3px;
                    margin: 0;
                    color: white;
                }

                .brand span {
                    color: #d8ead5;
                }

                .visual-badge {
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                    padding: 9px 13px;
                    border-radius: 999px;
                    background: rgba(255,255,255,0.18);
                    border: 1px solid rgba(255,255,255,0.22);
                    font-size: 12px;
                    font-weight: 700;
                    letter-spacing: 1.4px;
                    text-transform: uppercase;
                    margin-bottom: 18px;
                }

                .visual-title {
                    font-family: 'Playfair Display', serif;
                    font-size: 46px;
                    line-height: 1.1;
                    margin: 0 0 18px 0;
                    color: white;
                }

                .visual-text {
                    font-size: 15px;
                    line-height: 1.8;
                    color: rgba(255,255,255,0.88);
                    margin: 0;
                    max-width: 370px;
                }

                .visual-card {
                    position: relative;
                    z-index: 1;
                    background: rgba(255,255,255,0.16);
                    border: 1px solid rgba(255,255,255,0.20);
                    border-radius: 24px;
                    padding: 20px;
                    box-shadow: 0 20px 50px rgba(15,23,42,0.18);
                }

                .visual-card-title {
                    font-size: 14px;
                    font-weight: 700;
                    margin: 0 0 8px 0;
                    color: white;
                }

                .visual-card-text {
                    font-size: 13px;
                    line-height: 1.7;
                    margin: 0;
                    color: rgba(255,255,255,0.82);
                }

                .serif-title {
                    font-family: 'Playfair Display', serif;
                }

                .back-button {
                    background: none;
                    border: none;
                    color: #78907b;
                    cursor: pointer;
                    margin-bottom: 26px;
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                    font-size: 14px;
                    font-weight: 700;
                    padding: 0;
                    transition: 0.25s;
                }

                .back-button:hover {
                    color: var(--sage-main);
                    transform: translateX(-3px);
                }

                .register-heading {
                    color: #1e293b;
                    margin: 0 0 10px 0;
                    font-size: 2.45rem;
                    text-align: left;
                    letter-spacing: -0.8px;
                    line-height: 1.1;
                }

                .register-subtitle {
                    color: #64748b;
                    margin: 0 0 32px 0;
                    font-size: 15px;
                    line-height: 1.7;
                }

                .form-modern {
                    display: flex;
                    flex-direction: column;
                    gap: 19px;
                }

                .field-group {
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                }

                .label-modern {
                    font-size: 13px;
                    font-weight: 700;
                    color: #334155;
                }

                .input-wrap {
                    position: relative;
                }

                .input-icon {
                    position: absolute;
                    left: 17px;
                    top: 50%;
                    transform: translateY(-50%);
                    color: #94a3b8;
                    font-size: 14px;
                    pointer-events: none;
                }

                .input-modern {
                    width: 100%;
                    padding: 16px 18px 16px 46px;
                    border: 1px solid #e2e8f0;
                    background: #f8fafc;
                    border-radius: 18px;
                    box-sizing: border-box;
                    outline: none;
                    transition: 0.25s;
                    font-family: 'Inter', sans-serif;
                    font-size: 14px;
                    color: #1e293b;
                }

                .input-modern::placeholder {
                    color: #94a3b8;
                }

                .input-modern:focus {
                    border-color: var(--sage-main);
                    background: white;
                    box-shadow: 0 0 0 4px rgba(122,155,118,0.12);
                }

                .btn-modern {
                    background: var(--sage-main);
                    color: white;
                    border: none;
                    padding: 16px;
                    border-radius: 999px;
                    font-weight: 800;
                    cursor: pointer;
                    transition: 0.25s;
                    width: 100%;
                    font-size: 15px;
                    box-shadow: 0 12px 24px rgba(122,155,118,0.20);
                }

                .btn-modern:hover:not(:disabled) {
                    transform: translateY(-2px);
                    background: var(--sage-dark);
                    box-shadow: 0 16px 30px rgba(122,155,118,0.28);
                }

                .btn-modern:disabled {
                    opacity: 0.7;
                    cursor: not-allowed;
                    transform: none;
                }

                .login-note {
                    text-align: center;
                    margin-top: 28px;
                    font-size: 14px;
                    color: #64748b;
                }

                .login-note a {
                    color: var(--sage-main);
                    font-weight: 800;
                    text-decoration: none;
                }

                .login-note a:hover {
                    text-decoration: underline;
                }

                .otp-overlay {
                    position: fixed;
                    inset: 0;
                    background: rgba(15, 23, 42, 0.62);
                    backdrop-filter: blur(8px);
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    z-index: 1000;
                    padding: 20px;
                }

                .otp-modal {
                    background: white;
                    padding: 44px 38px;
                    border-radius: 32px;
                    width: 100%;
                    max-width: 430px;
                    text-align: center;
                    box-shadow: 0 30px 80px rgba(0,0,0,0.22);
                    animation: fadeIn 0.3s ease-out;
                    border: 1px solid rgba(226,232,240,0.9);
                }

                .otp-icon {
                    width: 82px;
                    height: 82px;
                    background: #eef6ee;
                    border: 1px solid #dcebdc;
                    border-radius: 26px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 36px;
                    margin: 0 auto 22px auto;
                }

                .otp-title {
                    margin: 0 0 10px 0;
                    color: #1e293b;
                    font-size: 2rem;
                    line-height: 1.1;
                }

                .otp-text {
                    color: #64748b;
                    font-size: 14px;
                    margin: 0 0 28px 0;
                    line-height: 1.7;
                }

                .otp-input {
                    width: 100%;
                    border: 1px solid #e2e8f0;
                    background: #f8fafc;
                    border-radius: 18px;
                    outline: none;
                    transition: 0.25s;
                    font-family: 'Inter', sans-serif;
                    font-size: 28px;
                    text-align: center;
                    letter-spacing: 12px;
                    font-weight: 800;
                    margin-bottom: 24px;
                    padding: 18px 14px 18px 26px;
                    color: #1e293b;
                }

                .otp-input:focus {
                    border-color: var(--sage-main);
                    background: white;
                    box-shadow: 0 0 0 4px rgba(122,155,118,0.12);
                }

                @keyframes fadeIn {
                    from {
                        opacity: 0;
                        transform: translateY(10px);
                    }

                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                @media (max-width: 860px) {
                    .register-shell {
                        grid-template-columns: 1fr;
                        max-width: 470px;
                        min-height: auto;
                    }

                    .register-visual {
                        display: none;
                    }

                    .register-panel {
                        padding: 42px 28px;
                    }

                    .register-heading {
                        text-align: center;
                        font-size: 2.2rem;
                    }

                    .register-subtitle {
                        text-align: center;
                    }
                }

                @media (max-width: 480px) {
                    .register-page {
                        padding: 22px 14px;
                    }

                    .register-panel {
                        padding: 34px 22px;
                    }

                    .register-shell {
                        border-radius: 28px;
                    }

                    .register-heading {
                        font-size: 2rem;
                    }

                    .otp-modal {
                        padding: 38px 24px;
                    }

                    .otp-input {
                        font-size: 24px;
                        letter-spacing: 8px;
                    }
                }
            `}</style>

            {showOtpModal && (
                <div className="otp-overlay">
                    <div className="otp-modal">
                        <div className="otp-icon">✉️</div>

                        <h3 className="serif-title otp-title">
                            Verifikasi Email
                        </h3>

                        <p className="otp-text">
                            Kode rahasia 6 digit telah dikirim ke <strong>{email}</strong>. Cek kotak masuk Anda lalu masukkan kode di bawah ini.
                        </p>

                        <input
                            type="text"
                            maxLength="6"
                            placeholder="000000"
                            value={otpCode}
                            onChange={(e) => setOtpCode(e.target.value.replace(/[^0-9]/g, ''))}
                            className="otp-input"
                        />

                        <button onClick={handleVerifyOtp} disabled={loading} className="btn-modern">
                            {loading ? 'Mengesahkan...' : 'Verifikasi Sekarang'}
                        </button>
                    </div>
                </div>
            )}

            <AnimatedContent distance={30} direction="vertical">
                <div className="register-shell">
                    <div className="register-panel">
                        <div className="register-card">
                            <button onClick={() => navigate('/')} className="back-button">
                                <i className="fa-solid fa-arrow-left"></i>
                                Kembali ke Beranda
                            </button>

                            <h2 className="serif-title register-heading">
                                Bergabung Bersama
                            </h2>

                            <p className="register-subtitle">
                                Buat akun untuk memulai perjalanan pemulihan yang lebih aman dan terarah di RuangPulih.
                            </p>

                            <form onSubmit={handleRegister} className="form-modern">
                                <div className="field-group">
                                    <label className="label-modern">Nama Panggilan</label>
                                    <div className="input-wrap">
                                        <i className="fa-regular fa-user input-icon"></i>
                                        <input
                                            type="text"
                                            required
                                            value={name}
                                            onChange={e => setName(e.target.value)}
                                            placeholder="Bebas, misal: Agus"
                                            className="input-modern"
                                        />
                                    </div>
                                </div>

                                <div className="field-group">
                                    <label className="label-modern">Alamat Email</label>
                                    <div className="input-wrap">
                                        <i className="fa-regular fa-envelope input-icon"></i>
                                        <input
                                            type="email"
                                            required
                                            value={email}
                                            onChange={e => setEmail(e.target.value)}
                                            placeholder="nama@gmail.com"
                                            className="input-modern"
                                        />
                                    </div>
                                </div>

                                <div className="field-group">
                                    <label className="label-modern">Kata Sandi</label>
                                    <div className="input-wrap">
                                        <i className="fa-solid fa-lock input-icon"></i>
                                        <input
                                            type="password"
                                            required
                                            minLength="6"
                                            value={password}
                                            onChange={e => setPassword(e.target.value)}
                                            placeholder="Minimal 6 karakter"
                                            className="input-modern"
                                        />
                                    </div>
                                </div>

                                <button type="submit" disabled={loading} className="btn-modern" style={{ marginTop: '8px' }}>
                                    {loading ? 'Menyiapkan...' : 'Buat Akun Gratis'}
                                </button>
                            </form>

                            <div className="login-note">
                                Sudah menjadi anggota?{' '}
                                <Link to="/login">
                                    Masuk di sini
                                </Link>
                            </div>
                        </div>
                    </div>

                    <div className="register-visual">
                        <div className="visual-content">
                            <h1 className="brand">
                                Ruang<span>Pulih.</span>
                            </h1>
                        </div>

                        <div className="visual-content">
                            <div className="visual-badge">
                                <i className="fa-solid fa-seedling"></i>
                                Mulai Pulih
                            </div>

                            <h2 className="visual-title">
                                Langkah kecil hari ini berarti.
                            </h2>

                            <p className="visual-text">
                                Buat akun untuk menyimpan hasil evaluasi, mendapatkan rekomendasi, dan mengakses dukungan yang lebih personal.
                            </p>
                        </div>

                        <div className="visual-card">
                            <p className="visual-card-title">
                                Identitas tetap aman.
                            </p>
                            <p className="visual-card-text">
                                Gunakan nama panggilan dan mulai dengan nyaman. Ruang ini dibuat agar Anda bisa merasa aman sejak langkah pertama.
                            </p>
                        </div>
                    </div>
                </div>
            </AnimatedContent>
        </div>
    );
};

export default Register;