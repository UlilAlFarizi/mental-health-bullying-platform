import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const GuestDashboard = () => {
    const navigate = useNavigate();

    const [guestName, setGuestName] = useState('');
    const [confessions, setConfessions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [greeting, setGreeting] = useState('Selamat Datang');

    const moodOptions = [
        { emoji: '😔', label: 'Sangat Buruk', value: 0 },
        { emoji: '😕', label: 'Kurang Baik', value: 1 },
        { emoji: '😐', label: 'Biasa Saja', value: 2 },
        { emoji: '🙂', label: 'Baik', value: 3 },
        { emoji: '🤩', label: 'Sangat Baik', value: 4 }
    ];

    const dummyTasks = [
        { key: 'breathe', text: 'Berhenti sejenak & tarik napas dalam', time: '5 Menit' },
        { key: 'gratitude', text: 'Catat satu hal positif hari ini', time: 'Jurnal' },
        { key: 'affirmation', text: 'Ucapkan afirmasi positif', time: 'Pagi' }
    ];

    useEffect(() => {
        // Tentukan Sapaan Waktu
        const hour = new Date().getHours();
        if (hour < 12) setGreeting('Selamat Pagi');
        else if (hour < 15) setGreeting('Selamat Siang');
        else if (hour < 18) setGreeting('Selamat Sore');
        else setGreeting('Selamat Malam');

        // Buat ID Tamu acak
        setGuestName(`Tamu-${Math.floor(1000 + Math.random() * 9000)}`);
        
        // Ambil data curhat publik (bisa dilihat oleh tamu)
        axios.get('http://127.0.0.1:8000/api/community/confessions')
            .then(res => {
                setConfessions(Array.isArray(res.data) ? res.data : []);
                setLoading(false);
            })
            .catch(err => {
                console.error("Gagal mengambil data komunitas", err);
                setLoading(false);
            });
    }, []);

    // Fungsi untuk memberitahu Tamu agar Login
    const requireLogin = () => {
        alert("Fitur ini khusus untuk pengguna terdaftar 🔒\nYuk, buat akun gratis untuk mulai menyimpan perkembanganmu!");
        navigate('/login');
    };

    const scrollToCommunity = () => {
        const section = document.getElementById('community-section');
        if (section) {
            section.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    if (loading) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#f6f9f7', color: '#4a6347', fontFamily: "'Inter', sans-serif", fontWeight: 700 }}>
                Menyiapkan Ruang Tamu Anda...
            </div>
        );
    }

    return (
        <div className="dashboard-layout">
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700;800&family=Inter:wght@400;500;600;700;800;900&display=swap');

                :root {
                    --sage-main: #7a9b76;
                    --sage-light: #e9f5db;
                    --sage-dark: #4a6347;
                    --text-main: #1e293b;
                    --text-muted: #64748b;
                    --border-color: #edf2f7;
                    --soft-bg: #f6f9f7;
                    --dark-main: #172033;
                }

                * { box-sizing: border-box; }
                body { margin: 0; background: var(--soft-bg); }

                ::-webkit-scrollbar { width: 7px; }
                ::-webkit-scrollbar-track { background: transparent; }
                ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
                ::-webkit-scrollbar-thumb:hover { background: #94a3b8; }

                .dashboard-layout {
                    display: flex;
                    min-height: 100vh;
                    background: radial-gradient(circle at top right, rgba(122,155,118,0.12), transparent 28%), linear-gradient(135deg, #f8fafc 0%, #f6f9f7 100%);
                    font-family: 'Inter', sans-serif;
                    color: var(--text-main);
                    overflow: hidden;
                }

                .sidebar {
                    width: 282px;
                    min-height: 100vh;
                    background: rgba(255,255,255,0.86);
                    backdrop-filter: blur(14px);
                    padding: 28px 22px;
                    display: flex;
                    flex-direction: column;
                    border-right: 1px solid rgba(226,232,240,0.85);
                    flex-shrink: 0;
                    box-shadow: 18px 0 45px rgba(15,23,42,0.035);
                    position: sticky;
                    top: 0;
                }

                .brand-row { display: flex; align-items: center; gap: 12px; margin-bottom: 32px; padding: 0 8px; }
                .brand-icon { width: 42px; height: 42px; background: linear-gradient(135deg, var(--sage-main), var(--sage-dark)); border-radius: 14px; display: flex; align-items: center; justify-content: center; color: white; font-weight: 900; font-size: 19px; box-shadow: 0 12px 26px rgba(122,155,118,0.28); }
                .brand-text { font-size: 24px; font-weight: 800; font-family: 'Playfair Display', serif; color: var(--text-main); }

                .primary-action {
                    background: var(--dark-main); color: white; border: none; padding: 15px 16px; border-radius: 16px; font-weight: 800; font-size: 14px; cursor: pointer; margin-bottom: 30px; transition: 0.25s; box-shadow: 0 14px 30px rgba(23,32,51,0.18); display: flex; align-items: center; justify-content: center; gap: 10px;
                }
                .primary-action:hover { transform: translateY(-2px); box-shadow: 0 18px 36px rgba(23,32,51,0.24); }

                .menu-section-title { font-size: 11px; font-weight: 900; color: #94a3b8; letter-spacing: 1.2px; margin-bottom: 14px; padding-left: 12px; text-transform: uppercase; }
                
                .menu-item { display: flex; align-items: center; gap: 14px; padding: 13px 16px; color: var(--text-muted); font-weight: 700; border-radius: 15px; cursor: pointer; transition: 0.2s; margin-bottom: 8px; font-size: 14px; }
                .menu-item i { width: 20px; text-align: center; }
                .menu-item:hover { background: #f8fafc; color: var(--text-main); transform: translateX(2px); }
                .menu-item.active { background: var(--sage-light); color: var(--sage-dark); font-weight: 900; }
                .login-item { color: var(--sage-main); background: #f1f5f9; }

                .main-content { flex: 1; height: 100vh; overflow-y: auto; padding: 34px 44px 70px; }
                .content-inner { max-width: 1180px; margin: 0 auto; }

                .topbar { display: flex; justify-content: space-between; align-items: center; gap: 24px; margin-bottom: 26px; }
                .page-title { font-size: 30px; font-weight: 900; color: var(--text-main); margin: 0 0 6px 0; letter-spacing: -0.7px; }
                .page-subtitle { color: var(--text-muted); font-size: 14px; margin: 0; line-height: 1.6; }

                .profile-badge { display: flex; align-items: center; gap: 12px; background: white; border: 1px solid var(--border-color); padding: 8px 12px 8px 8px; border-radius: 999px; box-shadow: 0 14px 35px rgba(15,23,42,0.055); cursor: pointer; transition: 0.2s;}
                .profile-badge:hover { border-color: var(--sage-main); }
                .profile-info { display: flex; flex-direction: column; line-height: 1.2; }
                .profile-name { font-size: 13px; font-weight: 900; color: var(--text-main); }
                .profile-role { font-size: 11px; color: var(--text-muted); text-transform: capitalize; font-weight: 700; }
                .avatar-img { width: 46px; height: 46px; border-radius: 50%; object-fit: cover; border: 3px solid white; box-shadow: 0 8px 20px rgba(15,23,42,0.10); }

                .summary-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 18px; margin-bottom: 24px; }
                .summary-card { background: rgba(255,255,255,0.9); border: 1px solid var(--border-color); border-radius: 24px; padding: 22px; box-shadow: 0 14px 35px rgba(15,23,42,0.045); display: flex; align-items: center; gap: 16px; opacity: 0.85; position: relative; }
                .summary-icon { width: 54px; height: 54px; border-radius: 18px; display: flex; align-items: center; justify-content: center; font-size: 22px; flex-shrink: 0; }
                .summary-label { color: var(--text-muted); font-size: 12px; font-weight: 900; text-transform: uppercase; letter-spacing: 0.6px; margin-bottom: 5px; }
                .summary-value { font-size: 24px; font-weight: 900; color: var(--text-main); line-height: 1; }

                .dashboard-grid { display: grid; grid-template-columns: 1.65fr 1fr; gap: 24px; margin-top: 0; }
                .full-width { grid-column: 1 / -1; }
                .bento-card { background: rgba(255,255,255,0.92); border-radius: 28px; padding: 26px; border: 1px solid var(--border-color); box-shadow: 0 15px 40px rgba(15,23,42,0.04); position: relative; }
                .card-header { display: flex; justify-content: space-between; align-items: center; gap: 16px; margin-bottom: 20px; }
                .card-title { margin: 0; font-size: 19px; color: var(--text-main); font-weight: 900; letter-spacing: -0.2px; }
                .card-desc { margin: 5px 0 0 0; font-size: 13px; color: var(--text-muted); line-height: 1.6; }

                .mini-badge { font-size: 12px; background: #f8fafc; padding: 7px 12px; border-radius: 999px; color: var(--text-muted); font-weight: 900; border: 1px solid var(--border-color); white-space: nowrap; }

                .task-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(215px, 1fr)); gap: 15px; }
                .task-card { border: 1px solid var(--border-color); border-radius: 20px; padding: 17px; cursor: pointer; transition: 0.22s; background: white; display: flex; flex-direction: column; gap: 15px; opacity: 0.7; }
                .task-card:hover { border-color: #cbd5e1; }
                .task-top { display: flex; gap: 12px; align-items: flex-start; }
                .task-icon { width: 42px; height: 42px; border-radius: 14px; display: flex; align-items: center; justify-content: center; font-size: 16px; flex-shrink: 0; background: #f8fafc; color: #94a3b8; }
                .task-title { font-size: 14px; font-weight: 800; color: var(--text-main); margin-bottom: 5px; line-height: 1.35; }
                .task-time { font-size: 12px; color: var(--text-muted); display: flex; align-items: center; gap: 5px; }
                .task-button { width: 100%; padding: 9px; border-radius: 12px; border: none; font-weight: 800; font-size: 12px; background: #f1f5f9; color: var(--text-muted); cursor: pointer; }

                .history-card { height: 370px; display: flex; flex-direction: column; overflow: hidden; }
                .history-area { flex: 1; position: relative; display: flex; justify-content: center; align-items: center; min-height: 275px; }
                .empty-state { text-align: center; color: #94a3b8; padding: 44px 0; font-weight: 700; }

                .mood-box { background: #f8fafc; border-radius: 24px; padding: 22px; border: 1px solid var(--border-color); overflow-x: auto; opacity: 0.6; cursor: pointer; }
                .mood-track { display: flex; justify-content: space-between; align-items: center; position: relative; z-index: 1; min-width: 620px; }
                .mood-line { position: absolute; top: 27px; left: 10%; right: 10%; height: 4px; background: #e2e8f0; z-index: -1; border-radius: 2px; }
                .mood-item { display: flex; flex-direction: column; align-items: center; gap: 10px; width: 20%; }
                .mood-emoji { width: 58px; height: 58px; background: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 29px; border: 3px solid #e2e8f0; }
                .mood-label { font-size: 12px; color: #94a3b8; font-weight: 700; text-align: center; }

                .community-grid { display: grid; grid-template-columns: 0.9fr 1.1fr; gap: 30px; }
                .submit-story-btn { background: var(--dark-main); color: white; border: none; padding: 15px 25px; border-radius: 14px; font-weight: 800; cursor: pointer; width: 100%; transition: 0.2s; box-shadow: 0 12px 25px rgba(23,32,51,0.14); }
                .submit-story-btn:hover { transform: translateY(-2px); box-shadow: 0 16px 30px rgba(23,32,51,0.18); }

                .confession-list { display: flex; flex-direction: column; gap: 15px; max-height: 285px; overflow-y: auto; padding-right: 10px; }
                .confession-card { background: white; border: 1px solid var(--border-color); padding: 20px; border-radius: 18px; transition: 0.2s; }
                .hug-button { padding: 7px 13px; border-radius: 999px; font-size: 12px; font-weight: 800; background: white; color: #e11d48; border: 1px solid #fce7f3; cursor: pointer; }

                @media (max-width: 1100px) {
                    .dashboard-grid, .summary-grid, .community-grid { grid-template-columns: 1fr; }
                    .history-card { height: auto; }
                    .history-area { min-height: 330px; }
                }

                @media (max-width: 860px) {
                    .sidebar { display: none; }
                    .main-content { padding: 24px 18px 60px; }
                    .topbar { align-items: flex-start; flex-direction: column; }
                    .profile-badge { width: 100%; justify-content: space-between; }
                    .page-title { font-size: 24px; }
                    .bento-card { padding: 21px; }
                }
            `}</style>

            <aside className="sidebar">
               <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', gap: '12px' }}>
                        <img 
                            src="/logo-ruangpulih.png" 
                            alt="Logo RuangPulih" 
                            onClick={() => handleTabChange('beranda')}
                            style={{
                                height: '75px',
                                width: 'auto',
                                objectFit: 'contain',
                                cursor: 'pointer'
                            }} 
                        />
                    <span className="brand-text">RuangPulih</span>
                </div>

                <button onClick={() => navigate('/tes')} className="primary-action">
                    <i className="fa-solid fa-clipboard-check"></i>
                    Mulai Evaluasi Gratis
                </button>

                <div style={{ flex: 1 }}>
                    <div className="menu-section-title">Menu Utama</div>

                    <div className="menu-item" onClick={() => navigate('/')}>
                        <i className="fa-solid fa-house"></i>
                        Halaman Depan
                    </div>

                    <div className="menu-item active">
                        <i className="fa-solid fa-border-all"></i>
                        Dashboard Tamu
                    </div>

                    <div className="menu-item" onClick={scrollToCommunity}>
                        <i className="fa-solid fa-comment-dots"></i>
                        Ruang Curhat
                    </div>
                </div>

                <div>
                    <div className="menu-section-title">Akses Fitur Penuh</div>

                    <div className="menu-item login-item" onClick={() => navigate('/login')}>
                        <i className="fa-solid fa-right-to-bracket"></i>
                        Daftar / Masuk
                    </div>
                </div>
            </aside>

            <main className="main-content">
                <div className="content-inner">
                    <div className="topbar">
                        <div>
                            <span style={{ background: '#f1f5f9', color: '#64748b', padding: '5px 12px', borderRadius: '20px', fontSize: '11px', fontWeight: 'bold', display: 'inline-block', marginBottom: '8px', border: '1px solid #e2e8f0' }}>
                                <i className="fa-solid fa-eye" style={{marginRight: '5px'}}></i> Mode Pratinjau
                            </span>
                            <h1 className="page-title">
                                {greeting}, {guestName}{' '}
                                {greeting === 'Selamat Pagi' ? '☀️' : greeting === 'Selamat Malam' ? '🌙' : '🌤️'}
                            </h1>
                            <p className="page-subtitle">
                                Kamu sedang melihat Dashboard versi tamu. Mari buat akun untuk menyimpan perkembanganmu!
                            </p>
                        </div>

                        <div className="profile-badge" onClick={() => navigate('/login')}>
                            <img
                                src={`https://ui-avatars.com/api/?name=Tamu&background=f1f5f9&color=64748b&bold=true&font-size=0.4`}
                                alt="Profile"
                                className="avatar-img"
                                style={{ border: '3px solid #f1f5f9' }}
                            />
                            <div className="profile-info">
                                <span className="profile-name">Pengguna Tamu</span>
                                <span className="profile-role" style={{ color: '#e11d48' }}>Belum Terdaftar</span>
                            </div>
                        </div>
                    </div>

                    {/* SUMMARY CARDS DENGAN LOCK ICON */}
                    <div className="summary-grid">
                        <div className="summary-card" onClick={requireLogin} style={{ cursor: 'pointer' }}>
                            <div className="summary-icon" style={{ background: '#f1f5f9', color: '#94a3b8' }}>
                                <i className="fa-solid fa-lock"></i>
                            </div>
                            <div>
                                <div className="summary-label">Total Evaluasi</div>
                                <div className="summary-value" style={{ color: '#cbd5e1' }}>--</div>
                            </div>
                        </div>

                        <div className="summary-card" onClick={requireLogin} style={{ cursor: 'pointer' }}>
                            <div className="summary-icon" style={{ background: '#f1f5f9', color: '#94a3b8' }}>
                                <i className="fa-solid fa-lock"></i>
                            </div>
                            <div>
                                <div className="summary-label">Self-Care Selesai</div>
                                <div className="summary-value" style={{ color: '#cbd5e1' }}>--/3</div>
                            </div>
                        </div>

                        <div className="summary-card">
                            <div className="summary-icon" style={{ background: '#fce7f3', color: '#e11d48' }}>
                                <i className="fa-solid fa-heart"></i>
                            </div>
                            <div>
                                <div className="summary-label">Cerita Komunitas</div>
                                <div className="summary-value">{confessions.length}</div>
                            </div>
                        </div>
                    </div>

                    <div className="dashboard-grid">
                        
                        {/* TUGAS SELF CARE (TERKUNCI) */}
                        <div className="bento-card">
                            <div className="card-header">
                                <div>
                                    <h3 className="card-title">Tantangan Self-Care <i className="fa-solid fa-lock" style={{color: '#cbd5e1', fontSize: '14px', marginLeft: '5px'}}></i></h3>
                                    <p className="card-desc">Selesaikan langkah kecil hari ini untuk menjaga ritme pemulihanmu.</p>
                                </div>
                                <span className="mini-badge" style={{ color: '#94a3b8' }}>Fitur Terkunci</span>
                            </div>

                            <div className="task-grid">
                                {dummyTasks.map(task => (
                                    <div key={task.key} onClick={requireLogin} className="task-card">
                                        <div className="task-top">
                                            <div className="task-icon">
                                                <i className={`fa-solid ${task.key === 'breathe' ? 'fa-wind' : task.key === 'gratitude' ? 'fa-book-open' : 'fa-sun'}`}></i>
                                            </div>
                                            <div>
                                                <div className="task-title" style={{ color: '#94a3b8' }}>{task.text}</div>
                                                <div className="task-time"><i className="fa-regular fa-clock"></i>{task.time}</div>
                                            </div>
                                        </div>
                                        <button type="button" className="task-button">
                                            <i className="fa-solid fa-lock" style={{marginRight: '5px'}}></i> Login untuk Membuka
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* RIWAYAT EVALUASI (TERKUNCI) */}
                        <div className="bento-card history-card">
                            <div className="card-header">
                                <div>
                                    <h3 className="card-title">Riwayat Evaluasi</h3>
                                    <p className="card-desc">Simpan dan pantau hasil tesmu.</p>
                                </div>
                            </div>

                            <div className="history-area">
                                <div className="empty-state">
                                    <i className="fa-solid fa-lock" style={{ fontSize: '38px', marginBottom: '15px', color: '#cbd5e1' }}></i>
                                    <div style={{ color: 'var(--text-main)', fontWeight: '800', marginBottom: '5px', fontSize: '16px' }}>Riwayat Terkunci</div>
                                    <div style={{ fontSize: '13px', lineHeight: '1.6' }}>Buat akun secara gratis untuk<br/>menyimpan dan melihat grafik perkembanganmu.</div>
                                    <button onClick={() => navigate('/login')} style={{ marginTop: '20px', padding: '10px 20px', background: 'white', border: '1px solid var(--sage-main)', borderRadius: '12px', cursor: 'pointer', fontWeight: 'bold', color: 'var(--sage-main)', transition: '0.2s' }}>Daftar / Masuk</button>
                                </div>
                            </div>
                        </div>

                        {/* MOOD TRACKER (TERKUNCI) */}
                        <div className="bento-card full-width">
                            <h3 className="card-title">Bagaimana Perasaanmu? <i className="fa-solid fa-lock" style={{color: '#cbd5e1', fontSize: '14px', marginLeft: '5px'}}></i></h3>
                            <p className="card-desc">Melacak perasaan membantu kami memahami perjalanan emosionalmu hari ini.</p>

                            <div className="mood-box" onClick={requireLogin} style={{ marginTop: '22px' }}>
                                <div className="mood-track">
                                    <div className="mood-line"></div>
                                    {moodOptions.map((mood) => (
                                        <div key={mood.value} className="mood-item">
                                            <div className="mood-emoji">{mood.emoji}</div>
                                            <span className="mood-label">{mood.label}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* RUANG CURHAT ANONIM */}
                        <div className="bento-card full-width" id="community-section">
                            <div className="card-header">
                                <div>
                                    <h3 className="card-title">Ruang Curhat Anonim</h3>
                                    <p className="card-desc">Baca cerita orang lain. Login untuk membagikan ceritamu tanpa takut identitas terungkap.</p>
                                </div>
                                <span style={{ background: '#fce7f3', color: '#e11d48', padding: '7px 13px', borderRadius: '999px', fontSize: '12px', fontWeight: '900', whiteSpace: 'nowrap' }}>
                                    <i className="fa-solid fa-heart"></i> Safe Space
                                </span>
                            </div>

                            <div className="community-grid">
                                
                                {/* FORM TERKUNCI */}
                                <div style={{ background: '#f8fafc', padding: '30px', borderRadius: '24px', textAlign: 'center', border: '2px dashed #cbd5e1', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                                    <i className="fa-solid fa-user-lock" style={{ fontSize: '35px', color: '#94a3b8', marginBottom: '15px' }}></i>
                                    <h4 style={{ margin: '0 0 10px 0', color: 'var(--text-main)', fontSize: '18px' }}>Ingin Berbagi Cerita?</h4>
                                    <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '25px', lineHeight: '1.6' }}>Masuk atau daftar secara gratis untuk mulai berbagi ceritamu secara anonim dan saling menguatkan dengan orang lain.</p>
                                    <button onClick={() => navigate('/login')} className="submit-story-btn" style={{ width: 'auto' }}>Masuk untuk Bergabung</button>
                                </div>

                                {/* DAFTAR CERITA (READ-ONLY) */}
                                <div className="confession-list">
                                    {confessions.length === 0 ? (
                                        <div className="empty-state">Belum ada cerita hari ini.</div>
                                    ) : (
                                        confessions.map((c) => (
                                            <div key={c.id} className="confession-card">
                                                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', marginBottom: '10px' }}>
                                                    <div style={{ fontWeight: '900', fontSize: '14px', color: 'var(--text-main)' }}>
                                                        <i className="fa-solid fa-user-secret" style={{ color: '#cbd5e1', marginRight: '6px' }}></i>
                                                        {c.author_alias}
                                                    </div>
                                                    <div style={{ fontSize: '11px', color: '#94a3b8', whiteSpace: 'nowrap' }}>
                                                        {new Date(c.created_at).toLocaleDateString('id-ID')}
                                                    </div>
                                                </div>

                                                <p style={{ fontSize: '13px', color: '#475569', lineHeight: '1.7', margin: '0 0 15px 0' }}>{c.story}</p>

                                                <button onClick={requireLogin} className="hug-button" title="Login untuk memberi pelukan">
                                                    <i className="fa-solid fa-lock" style={{color: '#fca5a5', marginRight: '5px'}}></i> Beri Pelukan
                                                    <span style={{ marginLeft: '5px' }}>{Number(c.hugs_count || 0)} ❤️</span>
                                                </button>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default GuestDashboard;