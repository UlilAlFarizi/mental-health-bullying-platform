import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Stack from '../components/Stack';
import GeminiChat from '../components/GeminiChat';

const Dashboard = () => {
    const navigate = useNavigate();

    const [userData, setUserData] = useState(null);
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    const [confessions, setConfessions] = useState([]);
    const [newStory, setNewStory] = useState('');
    const [submittingStory, setSubmittingStory] = useState(false);

    const [activeMenu, setActiveMenu] = useState('dashboard');
    const [greeting, setGreeting] = useState('Selamat Datang');
    const [selectedMood, setSelectedMood] = useState(null);
    
    // State Lengkapi Profil
    const [showProfileModal, setShowProfileModal] = useState(false);
    const [profileForm, setProfileForm] = useState({
        phone: '',
        gender: '',
        birth_date: '',
        address: ''
    });
    const [savingProfile, setSavingProfile] = useState(false);

    const [tasks, setTasks] = useState([
        { key: 'breathe', text: 'Berhenti sejenak & tarik napas dalam', time: '5 Menit', completed: false },
        { key: 'gratitude', text: 'Catat satu hal positif hari ini', time: 'Jurnal', completed: false },
        { key: 'affirmation', text: 'Ucapkan afirmasi positif', time: 'Pagi', completed: false }
    ]);

    const moodOptions = [
        { emoji: '😔', label: 'Sangat Buruk', value: 0 },
        { emoji: '😕', label: 'Kurang Baik', value: 1 },
        { emoji: '😐', label: 'Biasa Saja', value: 2 },
        { emoji: '🙂', label: 'Baik', value: 3 },
        { emoji: '🤩', label: 'Sangat Baik', value: 4 }
    ];

    useEffect(() => {
        const hour = new Date().getHours();
        if (hour < 12) setGreeting('Selamat Pagi');
        else if (hour < 15) setGreeting('Selamat Siang');
        else if (hour < 18) setGreeting('Selamat Sore');
        else setGreeting('Selamat Malam');

        const fetchDashboardData = async () => {
            const token = localStorage.getItem('auth_token');
            if (!token) { navigate('/login'); return; }

            const headers = { Authorization: `Bearer ${token}`, Accept: 'application/json' };

            try {
                const response = await axios.get('http://127.0.0.1:8000/api/history', { headers });
                setUserData(response.data.user);

                const sortedHistory = Array.isArray(response.data.history)
                    ? response.data.history.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
                    : [];
                setHistory(sortedHistory);

                try {
                    const resTasks = await axios.get('http://127.0.0.1:8000/api/tasks', { headers });
                    if (resTasks.data && resTasks.data.length > 0) {
                        setTasks(prevTasks => prevTasks.map(task => {
                            const dbTask = resTasks.data.find(dt => dt.task_key === task.key);
                            return dbTask ? { ...task, completed: !!dbTask.is_completed } : task;
                        }));
                    }
                } catch (e) { console.log('Task gagal dimuat.'); }

                try {
                    const resConfessions = await axios.get('http://127.0.0.1:8000/api/community/confessions', { headers });
                    setConfessions(Array.isArray(resConfessions.data) ? resConfessions.data : []);
                } catch (e) { console.log('Confession gagal dimuat.'); }

                setLoading(false);
            } catch (err) {
                if (err.response?.status === 401) {
                    localStorage.removeItem('auth_token');
                    navigate('/login');
                    return;
                }
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, [navigate]);
    
    const handleSaveProfile = async (e) => {
        e.preventDefault();
        setSavingProfile(true);
        try {
            const token = localStorage.getItem('auth_token');
            await axios.post('http://127.0.0.1:8000/api/user/update-profile', profileForm, { 
                headers: { Authorization: `Bearer ${token}` } 
            });
            alert('Profil berhasil diperbarui!');
            setShowProfileModal(false);
            setSavingProfile(false);
        } catch (err) {
            console.error('Gagal menyimpan profil', err);
            alert('Terjadi kesalahan saat menyimpan profil.');
            setSavingProfile(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('auth_token');
        navigate('/');
    };

    const toggleTask = async (taskKey) => {
        const updatedTasks = tasks.map(task => task.key === taskKey ? { ...task, completed: !task.completed } : task);
        setTasks(updatedTasks);
        try {
            const token = localStorage.getItem('auth_token');
            const selectedTask = updatedTasks.find(t => t.key === taskKey);
            await axios.post('http://127.0.0.1:8000/api/tasks/toggle', { task_key: taskKey, is_completed: selectedTask.completed }, { headers: { Authorization: `Bearer ${token}` } });
        } catch (err) { console.log('Gagal menyimpan task.'); }
    };

    const handleSubmitStory = async (e) => {
        e.preventDefault();
        if (!newStory.trim()) return;
        setSubmittingStory(true);
        try {
            const token = localStorage.getItem('auth_token');
            const response = await axios.post('http://127.0.0.1:8000/api/community/confessions', { story: newStory }, { headers: { Authorization: `Bearer ${token}` } });
            setConfessions([response.data.data, ...confessions]);
            setNewStory('');
            setSubmittingStory(false);
        } catch (err) {
            alert('Gagal mengirim cerita.');
            setSubmittingStory(false);
        }
    };

    const handleGiveHug = async (id) => {
        setConfessions(prev => prev.map(c => c.id === id ? { ...c, hugs_count: Number(c.hugs_count || 0) + 1, hasHugged: true } : c));
        try {
            const token = localStorage.getItem('auth_token');
            await axios.post(`http://127.0.0.1:8000/api/community/confessions/${id}/hug`, {}, { headers: { Authorization: `Bearer ${token}` } });
        } catch (err) { console.log('Gagal memberi pelukan.'); }
    };

    const scrollToCommunity = () => {
        setActiveMenu('community');
        setTimeout(() => {
            const section = document.getElementById('community-section');
            if (section) section.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
    };

    const completedTasks = tasks.filter(t => t.completed).length;
    const latestHistory = history[0];

    if (loading) return <div style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#f6f9f7', color: '#4a6347', fontFamily: "'Inter', sans-serif", fontWeight: 700 }}>Memuat Dashboard Anda...</div>;

    return (
        <div className="dashboard-layout">
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700;800&family=Inter:wght@400;500;600;700;800;900&display=swap');
                :root { --sage-main: #7a9b76; --sage-light: #e9f5db; --sage-dark: #4a6347; --text-main: #1e293b; --text-muted: #64748b; --border-color: #edf2f7; --soft-bg: #f6f9f7; --dark-main: #172033; }
                * { box-sizing: border-box; }
                body { margin: 0; background: var(--soft-bg); }
                ::-webkit-scrollbar { width: 7px; }
                ::-webkit-scrollbar-track { background: transparent; }
                ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
                ::-webkit-scrollbar-thumb:hover { background: #94a3b8; }

                .dashboard-layout { display: flex; min-height: 100vh; background: radial-gradient(circle at top right, rgba(122,155,118,0.12), transparent 28%), linear-gradient(135deg, #f8fafc 0%, #f6f9f7 100%); font-family: 'Inter', sans-serif; color: var(--text-main); overflow: hidden; }
                .sidebar { width: 282px; min-height: 100vh; background: rgba(255,255,255,0.86); backdrop-filter: blur(14px); padding: 28px 22px; display: flex; flex-direction: column; border-right: 1px solid rgba(226,232,240,0.85); flex-shrink: 0; box-shadow: 18px 0 45px rgba(15,23,42,0.035); position: sticky; top: 0; }
                .brand-row { display: flex; align-items: center; gap: 12px; margin-bottom: 32px; padding: 0 8px; }
                .brand-icon { width: 42px; height: 42px; background: linear-gradient(135deg, var(--sage-main), var(--sage-dark)); border-radius: 14px; display: flex; align-items: center; justify-content: center; color: white; font-weight: 900; font-size: 19px; box-shadow: 0 12px 26px rgba(122,155,118,0.28); }
                .brand-text { font-size: 24px; font-weight: 800; font-family: 'Playfair Display', serif; color: var(--text-main); }
                .primary-action { background: var(--dark-main); color: white; border: none; padding: 15px 16px; border-radius: 16px; font-weight: 800; font-size: 14px; cursor: pointer; margin-bottom: 30px; transition: 0.25s; box-shadow: 0 14px 30px rgba(23,32,51,0.18); display: flex; align-items: center; justify-content: center; gap: 10px; }
                .primary-action:hover { transform: translateY(-2px); box-shadow: 0 18px 36px rgba(23,32,51,0.24); }
                .menu-section-title { font-size: 11px; font-weight: 900; color: #94a3b8; letter-spacing: 1.2px; margin-bottom: 14px; padding-left: 12px; text-transform: uppercase; }
                .menu-item { display: flex; align-items: center; gap: 14px; padding: 13px 16px; color: var(--text-muted); font-weight: 700; border-radius: 15px; cursor: pointer; transition: 0.2s; margin-bottom: 8px; font-size: 14px; }
                .menu-item i { width: 20px; text-align: center; }
                .menu-item:hover { background: #f8fafc; color: var(--text-main); transform: translateX(2px); }
                .menu-item.active { background: var(--sage-light); color: var(--sage-dark); font-weight: 900; }
                .logout-item { color: #ef4444; }
                .main-content { flex: 1; height: 100vh; overflow-y: auto; padding: 34px 44px 70px; }
                .content-inner { max-width: 1180px; margin: 0 auto; }
                .topbar { display: flex; justify-content: space-between; align-items: center; gap: 24px; margin-bottom: 26px; }
                .page-title { font-size: 30px; font-weight: 900; color: var(--text-main); margin: 0 0 6px 0; letter-spacing: -0.7px; }
                .page-subtitle { color: var(--text-muted); font-size: 14px; margin: 0; line-height: 1.6; }
                .profile-badge { display: flex; align-items: center; gap: 12px; background: white; border: 1px solid var(--border-color); padding: 8px 12px 8px 8px; border-radius: 999px; box-shadow: 0 14px 35px rgba(15,23,42,0.055); cursor: pointer; transition: 0.2s; }
                .profile-badge:hover { border-color: var(--sage-main); }
                .profile-info { display: flex; flex-direction: column; line-height: 1.2; }
                .profile-name { font-size: 13px; font-weight: 900; color: var(--text-main); max-width: 160px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
                .profile-role { font-size: 11px; color: var(--text-muted); text-transform: capitalize; font-weight: 700; }
                .avatar-img { width: 46px; height: 46px; border-radius: 50%; object-fit: cover; border: 3px solid white; box-shadow: 0 8px 20px rgba(15,23,42,0.10); }
                .summary-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 18px; margin-bottom: 24px; }
                .summary-card { background: rgba(255,255,255,0.9); border: 1px solid var(--border-color); border-radius: 24px; padding: 22px; box-shadow: 0 14px 35px rgba(15,23,42,0.045); display: flex; align-items: center; gap: 16px; }
                .summary-icon { width: 54px; height: 54px; border-radius: 18px; display: flex; align-items: center; justify-content: center; font-size: 22px; flex-shrink: 0; }
                .summary-label { color: var(--text-muted); font-size: 12px; font-weight: 900; text-transform: uppercase; letter-spacing: 0.6px; margin-bottom: 5px; }
                .summary-value { font-size: 24px; font-weight: 900; color: var(--text-main); line-height: 1; }
                .dashboard-grid { display: grid; grid-template-columns: 1.65fr 1fr; gap: 24px; margin-top: 0; }
                .full-width { grid-column: 1 / -1; }
                .bento-card { background: rgba(255,255,255,0.92); border-radius: 28px; padding: 26px; border: 1px solid var(--border-color); box-shadow: 0 15px 40px rgba(15,23,42,0.04); }
                .card-header { display: flex; justify-content: space-between; align-items: center; gap: 16px; margin-bottom: 20px; }
                .card-title { margin: 0; font-size: 19px; color: var(--text-main); font-weight: 900; letter-spacing: -0.2px; }
                .card-desc { margin: 5px 0 0 0; font-size: 13px; color: var(--text-muted); line-height: 1.6; }
                .mini-badge { font-size: 12px; background: #f8fafc; padding: 7px 12px; border-radius: 999px; color: var(--text-muted); font-weight: 900; border: 1px solid var(--border-color); white-space: nowrap; }
                .task-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(215px, 1fr)); gap: 15px; }
                .task-card { border: 1px solid var(--border-color); border-radius: 20px; padding: 17px; cursor: pointer; transition: 0.22s; background: white; display: flex; flex-direction: column; gap: 15px; }
                .task-card:hover { transform: translateY(-2px); box-shadow: 0 12px 25px rgba(15,23,42,0.045); }
                .task-card.completed { border-color: rgba(122,155,118,0.45); background: #fbfdf9; }
                .task-top { display: flex; gap: 12px; align-items: flex-start; }
                .task-icon { width: 42px; height: 42px; border-radius: 14px; display: flex; align-items: center; justify-content: center; font-size: 16px; flex-shrink: 0; }
                .task-title { font-size: 14px; font-weight: 800; color: var(--text-main); margin-bottom: 5px; line-height: 1.35; }
                .task-time { font-size: 12px; color: var(--text-muted); display: flex; align-items: center; gap: 5px; }
                .task-button { width: 100%; padding: 9px; border-radius: 12px; border: none; font-weight: 800; font-size: 12px; transition: 0.2s; }
                .history-card { height: 370px; display: flex; flex-direction: column; overflow: hidden; }
                .history-area { flex: 1; position: relative; display: flex; justify-content: center; align-items: center; min-height: 275px; }
                .evaluation-card { background: white; padding: 30px; border-radius: 26px; border: 1px solid #f1f5f9; width: 260px; height: 260px; display: flex; flex-direction: column; justify-content: space-between; cursor: grab; overflow: hidden; position: relative; }
                .mood-box { background: #f8fafc; border-radius: 24px; padding: 22px; border: 1px solid var(--border-color); overflow-x: auto; }
                .mood-track { display: flex; justify-content: space-between; align-items: center; position: relative; z-index: 1; min-width: 620px; }
                .mood-line { position: absolute; top: 27px; left: 10%; right: 10%; height: 4px; background: #e2e8f0; z-index: -1; border-radius: 2px; }
                .mood-item { display: flex; flex-direction: column; align-items: center; gap: 10px; cursor: pointer; width: 20%; }
                .mood-emoji { width: 58px; height: 58px; background: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 29px; border: 3px solid #e2e8f0; transition: 0.2s; }
                .mood-emoji.active { background: var(--sage-main); border-color: white; box-shadow: 0 7px 18px rgba(122,155,118,0.38); transform: scale(1.12); }
                .mood-label { font-size: 12px; color: #94a3b8; font-weight: 700; text-align: center; }
                .mood-label.active { color: var(--text-main); font-weight: 900; }
                .community-grid { display: grid; grid-template-columns: 0.9fr 1.1fr; gap: 30px; }
                .story-textarea { width: 100%; padding: 20px; border: 1px solid var(--border-color); border-radius: 18px; min-height: 170px; font-family: inherit; resize: vertical; margin-bottom: 15px; background: #f8fafc; outline-color: var(--sage-main); font-size: 14px; lineHeight: 1.6; color: var(--text-main); transition: 0.2s; }
                .story-textarea:focus { background: white; box-shadow: 0 0 0 4px rgba(122,155,118,0.10); }
                .submit-story-btn { background: var(--dark-main); color: white; border: none; padding: 15px 25px; border-radius: 14px; font-weight: 800; cursor: pointer; width: 100%; transition: 0.2s; box-shadow: 0 12px 25px rgba(23,32,51,0.14); }
                .submit-story-btn:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 16px 30px rgba(23,32,51,0.18); }
                .submit-story-btn:disabled { opacity: 0.7; cursor: not-allowed; }
                .confession-list { display: flex; flex-direction: column; gap: 15px; max-height: 285px; overflow-y: auto; padding-right: 10px; }
                .confession-card { background: white; border: 1px solid var(--border-color); padding: 20px; border-radius: 18px; transition: 0.2s; }
                .confession-card:hover { box-shadow: 0 12px 25px rgba(15,23,42,0.045); transform: translateY(-1px); }
                .hug-button { padding: 7px 13px; border-radius: 999px; font-size: 12px; font-weight: 800; transition: 0.2s; }
                .empty-state { text-align: center; color: #94a3b8; padding: 44px 0; font-weight: 700; }
                
                @media (max-width: 1100px) { .dashboard-grid { grid-template-columns: 1fr; } .summary-grid { grid-template-columns: 1fr; } .history-card { height: auto; } .history-area { min-height: 330px; } .community-grid { grid-template-columns: 1fr; } }
                @media (max-width: 860px) { .sidebar { display: none; } .main-content { padding: 24px 18px 60px; } .topbar { align-items: flex-start; flex-direction: column; } .profile-badge { width: 100%; justify-content: space-between; } .page-title { font-size: 24px; } .bento-card { padding: 21px; } }
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
                    Mulai Sesi Evaluasi
                </button>

                <div style={{ flex: 1 }}>
                    <div className="menu-section-title">Main Menu</div>
                    <div className={`menu-item ${activeMenu === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveMenu('dashboard')}>
                        <i className="fa-solid fa-border-all"></i> Dashboard
                    </div>
                    <div className={`menu-item ${activeMenu === 'community' ? 'active' : ''}`} onClick={scrollToCommunity}>
                        <i className="fa-solid fa-comment-dots"></i> Ruang Curhat
                    </div>
                </div>

                {(userData?.role === 'admin' || userData?.role === 'admin') && (
                        <div className="menu-item" onClick={() => navigate('/admin')}>
                            <i className="fa-solid fa-shield-halved"></i> Panel Pengelola
                        </div>
                    )}
                
                 {(userData?.role === 'superadmin' || userData?.role === 'superadmin') && (
                        <div className="menu-item" onClick={() => navigate('/superadmin')}>
                            <i className="fa-solid fa-shield-halved"></i> Panel Pengelola
                        </div>
                    )}

                <div>
                    <div className="menu-section-title">Pengaturan</div>
                    <div className="menu-item logout-item" onClick={handleLogout}>
                        <i className="fa-solid fa-arrow-right-from-bracket"></i> Keluar
                    </div>
                </div>
            </aside>

            <main className="main-content">
                <div className="content-inner">
                    <div className="topbar">
                        <div>
                            <h1 className="page-title">
                                {greeting}, {userData?.name} {greeting === 'Selamat Pagi' ? '☀️' : greeting === 'Selamat Malam' ? '🌙' : '🌤️'}
                            </h1>
                            <p className="page-subtitle">Mari pantau perkembangan kesehatan mentalmu hari ini dengan langkah kecil yang konsisten.</p>
                        </div>

                        <div 
                            className="profile-badge" 
                            title="Klik untuk lengkapi data diri"
                            onClick={() => setShowProfileModal(true)}
                            style={{ cursor: 'pointer' }}
                        >
                            <img
                                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(userData?.name || 'User')}&background=e9f5db&color=4a6347&bold=true&font-size=0.4`}
                                alt="Profile"
                                className="avatar-img"
                            />
                            <div className="profile-info">
                                <span className="profile-name">{userData?.name}</span>
                                <span className="profile-role">{userData?.role || 'user'}</span>
                            </div>
                        </div>
                    </div>

                    <div className="summary-grid">
                        <div className="summary-card">
                            <div className="summary-icon" style={{ background: '#e9f5db', color: 'var(--sage-dark)' }}><i className="fa-solid fa-chart-line"></i></div>
                            <div><div className="summary-label">Total Evaluasi</div><div className="summary-value">{history.length}</div></div>
                        </div>
                        <div className="summary-card">
                            <div className="summary-icon" style={{ background: '#e0e7ff', color: '#4f46e5' }}><i className="fa-solid fa-list-check"></i></div>
                            <div><div className="summary-label">Self-Care Selesai</div><div className="summary-value">{completedTasks}/{tasks.length}</div></div>
                        </div>
                        <div className="summary-card">
                            <div className="summary-icon" style={{ background: '#fce7f3', color: '#e11d48' }}><i className="fa-solid fa-heart"></i></div>
                            <div><div className="summary-label">Cerita Komunitas</div><div className="summary-value">{confessions.length}</div></div>
                        </div>
                    </div>

                    <div className="dashboard-grid">
                        <div className="bento-card">
                            <div className="card-header">
                                <div>
                                    <h3 className="card-title">Tantangan Self-Care</h3>
                                    <p className="card-desc">Selesaikan langkah kecil hari ini untuk menjaga ritme pemulihanmu.</p>
                                </div>
                                <span className="mini-badge">{completedTasks} / {tasks.length} Selesai</span>
                            </div>
                            <div className="task-grid">
                                {tasks.map(task => (
                                    <div key={task.key} onClick={() => toggleTask(task.key)} className={`task-card ${task.completed ? 'completed' : ''}`}>
                                        <div className="task-top">
                                            <div className="task-icon" style={{ background: task.completed ? 'var(--sage-light)' : '#f8fafc', color: task.completed ? 'var(--sage-dark)' : '#94a3b8' }}>
                                                <i className={`fa-solid ${task.key === 'breathe' ? 'fa-wind' : task.key === 'gratitude' ? 'fa-book-open' : 'fa-sun'}`}></i>
                                            </div>
                                            <div>
                                                <div className="task-title" style={{ textDecoration: task.completed ? 'line-through' : 'none' }}>{task.text}</div>
                                                <div className="task-time"><i className="fa-regular fa-clock"></i>{task.time}</div>
                                            </div>
                                        </div>
                                        <button type="button" className="task-button" style={{ background: task.completed ? 'var(--sage-main)' : '#f1f5f9', color: task.completed ? 'white' : 'var(--text-muted)' }}>
                                            {task.completed ? 'Selesai' : 'Tandai Selesai'}
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bento-card history-card">
                            <div className="card-header">
                                <div>
                                    <h3 className="card-title">Riwayat Evaluasi</h3>
                                    <p className="card-desc">{latestHistory ? `Terakhir: ${latestHistory.severity_level}` : 'Belum ada hasil evaluasi.'}</p>
                                </div>
                                {history.length > 0 && <span className="mini-badge">Geser kartu 👆</span>}
                            </div>
                            <div className="history-area">
                                {history.length > 0 ? (
                                    <Stack randomRotation={true} sensitivity={200} sendToBackOnClick={true} cards={history.slice(0, 5).map((evalItem) => {
                                        const isSevere = evalItem.severity_level?.includes('Berat');
                                        const themeColor = isSevere ? '#ef4444' : 'var(--sage-main)';
                                        const themeLight = isSevere ? '#fee2e2' : '#e9f5db';
                                        return (
                                            <div key={evalItem.id} className="evaluation-card" style={{ backgroundImage: `linear-gradient(135deg, ${themeLight} 0%, white 100%)`, boxShadow: isSevere ? '0 15px 35px rgba(239, 68, 68, 0.15)' : '0 15px 35px rgba(122, 155, 118, 0.15)' }}>
                                                <div style={{ position: 'absolute', top: '-20px', right: '-20px', width: '100px', height: '100px', background: themeColor, borderRadius: '50%', opacity: 0.1, filter: 'blur(20px)' }}></div>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                    <div style={{ width: '50px', height: '50px', borderRadius: '14px', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', color: themeColor, fontSize: '20px', boxShadow: '0 4px 10px rgba(0,0,0,0.04)' }}>
                                                        <i className={isSevere ? 'fa-solid fa-triangle-exclamation' : 'fa-solid fa-check-circle'}></i>
                                                    </div>
                                                    <div style={{ background: themeColor, color: 'white', padding: '6px 15px', borderRadius: '20px', fontSize: '13px', fontWeight: '900' }}>{evalItem.total_score} Pts</div>
                                                </div>
                                                <div style={{ marginTop: 'auto' }}>
                                                    <div style={{ fontSize: '20px', fontWeight: '800', fontFamily: "'Playfair Display', serif", color: 'var(--text-main)', lineHeight: 1.2 }}>{evalItem.severity_level}</div>
                                                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '1px', margin: '8px 0' }}>{new Date(evalItem.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
                                                    <div style={{ fontSize: '12px', background: 'white', padding: '5px 11px', borderRadius: '20px', color: '#64748b', border: '1px solid #f1f5f9', display: 'inline-block' }}>
                                                        <i className="fa-solid fa-masks-theater" style={{ marginRight: '5px', opacity: 0.5 }}></i>{evalItem.bullying_type || 'Uji Coba'}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })} />
                                ) : (
                                    <div className="empty-state">
                                        <i className="fa-solid fa-folder-open" style={{ fontSize: '34px', marginBottom: '12px' }}></i>
                                        <div>Belum ada data evaluasi.</div>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="bento-card full-width">
                            <h3 className="card-title">Bagaimana Perasaanmu?</h3>
                            <p className="card-desc">Melacak perasaan membantu kami memahami perjalanan emosionalmu hari ini.</p>
                            <div className="mood-box" style={{ marginTop: '22px' }}>
                                <div className="mood-track">
                                    <div className="mood-line"></div>
                                    {moodOptions.map((mood) => (
                                        <div key={mood.value} onClick={() => setSelectedMood(mood.value)} className="mood-item">
                                            <div className={`mood-emoji ${selectedMood === mood.value ? 'active' : ''}`}>{mood.emoji}</div>
                                            <span className={`mood-label ${selectedMood === mood.value ? 'active' : ''}`}>{mood.label}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="bento-card full-width" id="community-section">
                            <div className="card-header">
                                <div><h3 className="card-title">Ruang Curhat Anonim</h3><p className="card-desc">Bagikan keluh kesahmu tanpa takut identitas terungkap.</p></div>
                                <span style={{ background: '#fce7f3', color: '#e11d48', padding: '7px 13px', borderRadius: '999px', fontSize: '12px', fontWeight: '900', whiteSpace: 'nowrap' }}><i className="fa-solid fa-heart"></i> Safe Space</span>
                            </div>
                            <div className="community-grid">
                                <div>
                                    <form onSubmit={handleSubmitStory}>
                                        <textarea value={newStory} onChange={(e) => setNewStory(e.target.value)} placeholder="Apa yang membebani pikiranmu hari ini? Ceritakan semuanya..." className="story-textarea" required />
                                        <button type="submit" disabled={submittingStory} className="submit-story-btn">{submittingStory ? 'Mengirim pesan...' : 'Bagikan Cerita Secara Anonim'}</button>
                                    </form>
                                </div>
                                <div className="confession-list">
                                    {confessions.length === 0 ? (<div className="empty-state">Belum ada cerita hari ini.</div>) : (
                                        confessions.map((c) => (
                                            <div key={c.id} className="confession-card">
                                                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', marginBottom: '10px' }}>
                                                    <div style={{ fontWeight: '900', fontSize: '14px', color: 'var(--text-main)' }}><i className="fa-solid fa-user-secret" style={{ color: '#cbd5e1', marginRight: '6px' }}></i>{c.author_alias}</div>
                                                    <div style={{ fontSize: '11px', color: '#94a3b8', whiteSpace: 'nowrap' }}>{new Date(c.created_at).toLocaleDateString('id-ID')}</div>
                                                </div>
                                                <p style={{ fontSize: '13px', color: '#475569', lineHeight: '1.7', margin: '0 0 15px 0' }}>{c.story}</p>
                                                <button onClick={() => handleGiveHug(c.id)} disabled={c.hasHugged} className="hug-button" style={{ background: c.hasHugged ? '#f8fafc' : 'white', color: c.hasHugged ? '#94a3b8' : '#e11d48', border: c.hasHugged ? '1px solid #f1f5f9' : '1px solid #fce7f3', cursor: c.hasHugged ? 'default' : 'pointer' }}>
                                                    {c.hasHugged ? 'Dipeluk' : 'Beri Pelukan'} <span style={{ marginLeft: '5px' }}>{Number(c.hugs_count || 0)} ❤️</span>
                                                </button>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ================================================== */}
                {/* POP-UP MODAL LENGKAPI DATA DIRI (DIUBAH)           */}
                {/* ================================================== */}
                {showProfileModal && (
                    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <div style={{ background: 'white', padding: '40px', borderRadius: '24px', width: '90%', maxWidth: '500px', boxShadow: '0 25px 50px rgba(0,0,0,0.15)', position: 'relative' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
                                <h2 style={{ margin: 0, fontFamily: "'Playfair Display', serif", fontSize: '24px', color: 'var(--text-main)' }}>Lengkapi Data Diri</h2>
                                <i className="fa-solid fa-xmark" style={{ cursor: 'pointer', fontSize: '22px', color: '#94a3b8' }} onClick={() => setShowProfileModal(false)}></i>
                            </div>
                            
                            <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                                <div>
                                    <label style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '8px', display: 'block' }}>Nomor Telepon</label>
                                    <input type="text" value={profileForm.phone} onChange={(e) => setProfileForm({...profileForm, phone: e.target.value})} placeholder="Contoh: 081234567890" style={{ width: '100%', padding: '12px 15px', borderRadius: '12px', border: '1px solid var(--border-color)', outlineColor: 'var(--sage-main)' }} required />
                                </div>

                                <div>
                                    <label style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '8px', display: 'block' }}>Jenis Kelamin</label>
                                    <select value={profileForm.gender} onChange={(e) => setProfileForm({...profileForm, gender: e.target.value})} style={{ width: '100%', padding: '12px 15px', borderRadius: '12px', border: '1px solid var(--border-color)', outlineColor: 'var(--sage-main)' }} required>
                                        <option value="">Pilih Jenis Kelamin</option>
                                        <option value="Laki-laki">Laki-laki</option>
                                        <option value="Perempuan">Perempuan</option>
                                    </select>
                                </div>

                                <div>
                                    <label style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '8px', display: 'block' }}>Tanggal Lahir</label>
                                    <input type="date" value={profileForm.birth_date} onChange={(e) => setProfileForm({...profileForm, birth_date: e.target.value})} style={{ width: '100%', padding: '12px 15px', borderRadius: '12px', border: '1px solid var(--border-color)', outlineColor: 'var(--sage-main)' }} required />
                                </div>

                                <div>
                                    <label style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '8px', display: 'block' }}>Alamat Domisili</label>
                                    <textarea value={profileForm.address} onChange={(e) => setProfileForm({...profileForm, address: e.target.value})} rows="3" placeholder="Masukkan alamat lengkap..." style={{ width: '100%', padding: '12px 15px', borderRadius: '12px', border: '1px solid var(--border-color)', outlineColor: 'var(--sage-main)', resize: 'none', fontFamily: 'inherit' }} required></textarea>
                                </div>

                                {/* --- PERUBAHAN PADA AREA TOMBOL --- */}
                                <div style={{ display: 'flex', gap: '15px', marginTop: '15px' }}>
                                    {/* Tombol Simpan Perubahan (Sekarang di kiri, flex: 1) */}
                                    <button type="submit" disabled={savingProfile} style={{ background: 'var(--sage-main)', color: 'white', border: 'none', padding: '15px', borderRadius: '14px', fontWeight: '800', flex: 1, cursor: 'pointer', transition: '0.2s', opacity: savingProfile ? 0.7 : 1 }}>
                                        {savingProfile ? 'Menyimpan...' : 'Simpan Perubahan'}
                                    </button>

                                    {/* --- TOMBOL KEMBALI NANTI SEBAGAI TOMBOL SEKUNDER ( flex: 1) --- */}
                                    <button type="button" style={{ background: 'white', color: '#64748b', border: '1px solid #cbd5e1', padding: '15px', borderRadius: '14px', fontWeight: '700', flex: 1, cursor: 'pointer', transition: '0.2s' }} onClick={() => setShowProfileModal(false)}>
                                        Kembali Nanti
                                    </button>
                                </div>
                                {/* --- AKHIR PERUBAHAN AREA TOMBOL --- */}
                            </form>
                        </div>
                    </div>
                )}
            <GeminiChat />
            </main>
        </div>
    );
};

export default Dashboard;