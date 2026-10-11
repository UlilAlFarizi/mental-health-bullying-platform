import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import AnimatedContent from '../components/AnimatedContent';

const Login = () => {
    const navigate = useNavigate();
    const [view, setView] = useState('login');
    const [loading, setLoading] = useState(false);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [resetEmail, setResetEmail] = useState('');
    const [otpCode, setOtpCode] = useState('');
    const [newPassword, setNewPassword] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await axios.post('http://127.0.0.1:8000/api/login', { email, password });
            
            // 1. Simpan token akses ke penyimpanan lokal
            localStorage.setItem('auth_token', response.data.access_token);
            
            // 2. Tangkap role (hak akses) dari balasan API Laravel
            const userRole = response.data.role;
            
            if (userRole === 'superadmin') {
                navigate('/superadmin'); 
            } else if (userRole === 'admin') {
                navigate('/admin');     
            } else {
                navigate('/dashboard');  
            }

        } catch (err) {
            alert(err.response?.data?.message || 'Login gagal, periksa email dan password Anda.');
            setLoading(false);
        }
    };

    const handleSendResetOTP = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await axios.post('http://127.0.0.1:8000/api/forgot-password', { email: resetEmail });
            setView('forgot-otp');
            setLoading(false);
        } catch (err) {
            alert(err.response?.data?.message || 'Gagal mengirim email pemulihan.');
            setLoading(false);
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();

        if (otpCode.length !== 6) return alert('Kode OTP harus 6 digit!');
        if (newPassword.length < 6) return alert('Password minimal 6 karakter!');

        setLoading(true);

        try {
            const res = await axios.post('http://127.0.0.1:8000/api/reset-password', {
                email: resetEmail,
                otp: otpCode,
                password: newPassword
            });

            alert(res.data.message);
            setView('login');
            setPassword('');
            setLoading(false);
        } catch (err) {
            alert(err.response?.data?.message || 'Kode OTP salah!');
            setLoading(false);
        }
    };

    return (
        <div className="login-page">
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=Inter:wght@300;400;500;600;700&display=swap');

                * {
                    box-sizing: border-box;
                }

                .login-page {
                    min-height: 100vh;
                    width: 100%;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    padding: 40px 20px;
                    font-family: 'Inter', sans-serif;
                    background:
                        radial-gradient(circle at top left, rgba(122, 155, 118, 0.16), transparent 34%),
                        radial-gradient(circle at bottom right, rgba(30, 41, 59, 0.08), transparent 32%),
                        linear-gradient(135deg, #f8faf8 0%, #ffffff 48%, #eef4ef 100%);
                    position: relative;
                    overflow: hidden;
                }

                .login-page::before {
                    content: '';
                    position: absolute;
                    width: 420px;
                    height: 420px;
                    border-radius: 50%;
                    background: rgba(122, 155, 118, 0.12);
                    top: -160px;
                    right: -120px;
                    filter: blur(2px);
                }

                .login-page::after {
                    content: '';
                    position: absolute;
                    width: 360px;
                    height: 360px;
                    border-radius: 50%;
                    background: rgba(148, 163, 184, 0.12);
                    bottom: -140px;
                    left: -100px;
                    filter: blur(2px);
                }

                .login-shell {
                    width: 100%;
                    max-width: 980px;
                    min-height: 620px;
                    display: grid;
                    grid-template-columns: 0.95fr 1.05fr;
                    background: rgba(255, 255, 255, 0.76);
                    border: 1px solid rgba(226, 232, 240, 0.95);
                    border-radius: 34px;
                    box-shadow: 0 30px 80px rgba(15, 23, 42, 0.10);
                    overflow: hidden;
                    position: relative;
                    z-index: 1;
                    backdrop-filter: blur(18px);
                }

                .login-visual {
                    position: relative;
                    padding: 42px;
                    background:
                        linear-gradient(145deg, rgba(122,155,118,0.92), rgba(74, 103, 72, 0.96)),
                        url('https://images.unsplash.com/photo-1493836512294-502baa1986e2?auto=format&fit=crop&w=900&q=80');
                    background-size: cover;
                    background-position: center;
                    color: white;
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                    overflow: hidden;
                }

                .login-visual::before {
                    content: '';
                    position: absolute;
                    inset: 0;
                    background: linear-gradient(180deg, rgba(15,23,42,0.12), rgba(15,23,42,0.42));
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
                    max-width: 360px;
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

                .login-panel {
                    padding: 44px 48px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: rgba(255,255,255,0.88);
                }

                .login-card {
                    width: 100%;
                    max-width: 410px;
                }

                .serif-title {
                    font-family: 'Playfair Display', serif;
                }

                .back-button {
                    background: none;
                    border: none;
                    color: #78907b;
                    cursor: pointer;
                    margin-bottom: 28px;
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

                .login-heading {
                    color: #1e293b;
                    margin: 0 0 10px 0;
                    font-size: 2.55rem;
                    text-align: left;
                    letter-spacing: -0.8px;
                    line-height: 1.1;
                }

                .login-subtitle {
                    color: #64748b;
                    margin: 0 0 34px 0;
                    font-size: 15px;
                    line-height: 1.7;
                }

                .form-modern {
                    display: flex;
                    flex-direction: column;
                    gap: 20px;
                }

                .field-group {
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                }

                .field-top {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    gap: 12px;
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

                .forgot-link {
                    font-size: 12.5px;
                    color: var(--sage-main);
                    font-weight: 800;
                    cursor: pointer;
                    white-space: nowrap;
                }

                .forgot-link:hover {
                    text-decoration: underline;
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

                .register-note {
                    text-align: center;
                    margin-top: 28px;
                    font-size: 14px;
                    color: #64748b;
                }

                .register-note a {
                    color: var(--sage-main);
                    font-weight: 800;
                    text-decoration: none;
                }

                .register-note a:hover {
                    text-decoration: underline;
                }

                .mode-icon {
                    width: 64px;
                    height: 64px;
                    border-radius: 22px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin-bottom: 20px;
                    font-size: 28px;
                    background: #eef6ee;
                    border: 1px solid #dcebdc;
                }

                .otp-input {
                    padding-left: 18px !important;
                    font-size: 24px !important;
                    letter-spacing: 8px;
                    text-align: center;
                    font-weight: 800;
                }

                .fade-view {
                    animation: fadeIn 0.35s ease;
                }

                @keyframes fadeIn {
                    from {
                        opacity: 0;
                        transform: translateY(8px);
                    }

                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                @media (max-width: 860px) {
                    .login-shell {
                        grid-template-columns: 1fr;
                        max-width: 470px;
                        min-height: auto;
                    }

                    .login-visual {
                        display: none;
                    }

                    .login-panel {
                        padding: 42px 28px;
                    }

                    .login-heading {
                        text-align: center;
                        font-size: 2.25rem;
                    }

                    .login-subtitle {
                        text-align: center;
                    }

                    .back-button {
                        margin-bottom: 26px;
                    }
                }

                @media (max-width: 480px) {
                    .login-page {
                        padding: 22px 14px;
                    }

                    .login-panel {
                        padding: 34px 22px;
                    }

                    .login-shell {
                        border-radius: 28px;
                    }

                    .login-heading {
                        font-size: 2rem;
                    }
                }
            `}</style>

            <AnimatedContent distance={30} direction="vertical">
                <div className="login-shell">
                    <div className="login-visual">
                        <div className="visual-content">
                            <h1 className="brand">
                                Ruang<span>Pulih.</span>
                            </h1>
                        </div>

                        <div className="visual-content">
                            <div className="visual-badge">
                                <i className="fa-solid fa-shield-heart"></i>
                                Ruang Aman
                            </div>

                            <h2 className="visual-title">
                                Pulihkan diri dengan tenang.
                            </h2>

                            <p className="visual-text">
                                Masuk untuk melanjutkan evaluasi, melihat rekomendasi pemulihan, dan mengakses ruang dukungan Anda.
                            </p>
                        </div>

                        <div className="visual-card">
                            <p className="visual-card-title">
                                Privasi Anda kami jaga.
                            </p>
                            <p className="visual-card-text">
                                Setiap proses dirancang agar pengguna merasa aman, nyaman, dan dapat memulai langkah pemulihan dengan percaya diri.
                            </p>
                        </div>
                    </div>

                    <div className="login-panel">
                        <div className="login-card">
                            <button
                                onClick={() => view === 'login' ? navigate('/') : setView('login')}
                                className="back-button"
                            >
                                <i className="fa-solid fa-arrow-left"></i>
                                {view === 'login' ? 'Kembali ke Beranda' : 'Kembali ke Login'}
                            </button>

                            {view === 'login' && (
                                <div className="fade-view">
                                    <h2 className="serif-title login-heading">
                                        Masuk Portal
                                    </h2>

                                    <p className="login-subtitle">
                                        Selamat datang kembali. Masuk untuk mengakses ruang aman Anda.
                                    </p>

                                    <form onSubmit={handleLogin} className="form-modern">
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
                                            <div className="field-top">
                                                <label className="label-modern">Kata Sandi</label>
                                                <span onClick={() => setView('forgot-email')} className="forgot-link">
                                                    Lupa Sandi?
                                                </span>
                                            </div>

                                            <div className="input-wrap">
                                                <i className="fa-solid fa-lock input-icon"></i>
                                                <input
                                                    type="password"
                                                    required
                                                    value={password}
                                                    onChange={e => setPassword(e.target.value)}
                                                    placeholder="••••••••"
                                                    className="input-modern"
                                                />
                                            </div>
                                        </div>

                                        <button type="submit" disabled={loading} className="btn-modern" style={{ marginTop: '8px' }}>
                                            {loading ? 'Memproses...' : 'Masuk Sekarang'}
                                        </button>
                                    </form>

                                    <div className="register-note">
                                        Belum tergabung?{' '}
                                        <Link to="/register">
                                            Buat Akun Gratis
                                        </Link>
                                    </div>
                                </div>
                            )}

                            {view === 'forgot-email' && (
                                <div className="fade-view">
                                    <div className="mode-icon">🔐</div>

                                    <h2 className="serif-title login-heading">
                                        Lupa Sandi
                                    </h2>

                                    <p className="login-subtitle">
                                        Masukkan email terdaftar Anda. Kami akan mengirim kode OTP untuk membuat kata sandi baru.
                                    </p>

                                    <form onSubmit={handleSendResetOTP} className="form-modern">
                                        <div className="field-group">
                                            <label className="label-modern">Email Terdaftar</label>
                                            <div className="input-wrap">
                                                <i className="fa-regular fa-envelope input-icon"></i>
                                                <input
                                                    type="email"
                                                    required
                                                    value={resetEmail}
                                                    onChange={e => setResetEmail(e.target.value)}
                                                    placeholder="nama@gmail.com"
                                                    className="input-modern"
                                                />
                                            </div>
                                        </div>

                                        <button type="submit" disabled={loading} className="btn-modern">
                                            {loading ? 'Mengirim Kode...' : 'Kirim Kode OTP'}
                                        </button>
                                    </form>
                                </div>
                            )}

                            {view === 'forgot-otp' && (
                                <div className="fade-view">
                                    <div className="mode-icon">✉️</div>

                                    <h2 className="serif-title login-heading">
                                        Cek Kotak Masuk
                                    </h2>

                                    <p className="login-subtitle">
                                        Kami telah mengirim 6 digit kode ke <strong>{resetEmail}</strong>.
                                    </p>

                                    <form onSubmit={handleResetPassword} className="form-modern">
                                        <div className="field-group">
                                            <label className="label-modern" style={{ textAlign: 'center' }}>
                                                Kode Verifikasi OTP
                                            </label>

                                            <input
                                                type="text"
                                                maxLength="6"
                                                required
                                                value={otpCode}
                                                onChange={e => setOtpCode(e.target.value.replace(/[^0-9]/g, ''))}
                                                placeholder="000000"
                                                className="input-modern otp-input"
                                            />
                                        </div>

                                        <div className="field-group">
                                            <label className="label-modern">Kata Sandi Baru</label>
                                            <div className="input-wrap">
                                                <i className="fa-solid fa-key input-icon"></i>
                                                <input
                                                    type="password"
                                                    required
                                                    minLength="6"
                                                    value={newPassword}
                                                    onChange={e => setNewPassword(e.target.value)}
                                                    placeholder="Minimal 6 karakter"
                                                    className="input-modern"
                                                />
                                            </div>
                                        </div>

                                        <button type="submit" disabled={loading} className="btn-modern">
                                            {loading ? 'Menyimpan...' : 'Ubah & Selesai'}
                                        </button>
                                    </form>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </AnimatedContent>
        </div>
    );
};

export default Login;