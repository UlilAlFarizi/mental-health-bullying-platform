import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import AnimatedContent from '../components/AnimatedContent';

// --- IMPORT & REGISTRASI CHART.JS (Aman untuk Vite) ---
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

// Registrasikan komponen ke Chart.js internal
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const AdminDashboard = () => {
    const navigate = useNavigate();

    // State Autentikasi & Navigasi
    const [loading, setLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);
    const [activeMenu, setActiveMenu] = useState('ringkasan');

    // State Fitur Lama & Statistik Baru
    const [confessions, setConfessions] = useState([]);
    const [stats, setStats] = useState({
        total_users: 0,
        total_confessions: 0,
        total_tests: 0
    });

    // State Data Grafik untuk Chart.js
    const [chartData, setChartData] = useState({
        labels: [],
        datasets: []
    });

    const [chartSymptomData, setChartSymptomData] = useState({
        labels: [],
        datasets: []
    });

    // TAMBAHAN: menyimpan detail teks gejala populer
    const [frequentSymptoms, setFrequentSymptoms] = useState([]);

    const [consultationHistory, setConsultationHistory] = useState([]);

    // State Fitur Baru (CRUD Gejala)
    const [symptoms, setSymptoms] = useState([]);
    const [bullyingTypes, setBullyingTypes] = useState([]);

    // State Modal Form Gejala
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        id: null,
        bullying_type_id: '',
        code: '',
        question_text: ''
    });

    const token = localStorage.getItem('auth_token');
    const headers = {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json'
    };

    useEffect(() => {
        if (!token) {
            navigate('/login');
            return;
        }

        fetchAdminData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const fetchAdminData = async () => {
        try {
            // 1. Cek Role & Ambil Data Login
            const userRes = await axios.get('http://127.0.0.1:8000/api/history', { headers });

            if (userRes.data.user.role !== 'admin' && userRes.data.user.role !== 'superadmin') {
                alert('Akses Ditolak: Anda bukan Admin!');
                navigate('/dashboard');
                return;
            }

            setIsAdmin(true);

            // 2. Ambil data statistik dan grafik dari AdminController
            const statsRes = await axios.get('http://127.0.0.1:8000/api/admin/stats', { headers });

            setStats({
                total_users: statsRes.data.total_users || 0,
                total_confessions: statsRes.data.total_confessions || 0,
                total_tests: statsRes.data.total_tests || 0
            });

            setConfessions(statsRes.data.recent_confessions || []);
            setConsultationHistory(statsRes.data.consultation_history || []);

            // 3. Format data severity_data dari Laravel untuk Chart.js
            if (statsRes.data.severity_data && statsRes.data.severity_data.length > 0) {
                const labels = statsRes.data.severity_data.map(item => item.severity_level || 'Tidak Diketahui');
                const counts = statsRes.data.severity_data.map(item => item.count);

                setChartData({
                    labels: labels,
                    datasets: [
                        {
                            label: 'Jumlah Kasus',
                            data: counts,
                            backgroundColor: '#7a9b76',
                            borderRadius: 6
                        }
                    ]
                });
            } else {
                setChartData({
                    labels: [],
                    datasets: []
                });
            }

            // =====================================================
            // TAMBAHAN / PERBAIKAN:
            // Format data gejala populer dari backend
            // Backend harus mengirim key: frequent_symptoms
            // =====================================================
            const symptomsData = statsRes.data.frequent_symptoms || [];

            setFrequentSymptoms(symptomsData);

            if (symptomsData.length > 0) {
                const symptomLabels = symptomsData.map(item => item.code || item.label || 'G?');
                const symptomTotals = symptomsData.map(item => item.total || 0);

                setChartSymptomData({
                    labels: symptomLabels,
                    datasets: [
                        {
                            label: 'Jumlah Pengguna',
                            data: symptomTotals,
                            backgroundColor: '#7a9b76',
                            borderRadius: 6
                        }
                    ]
                });
            } else {
                setChartSymptomData({
                    labels: [],
                    datasets: []
                });
            }

            // 4. Ambil Data Gejala
            fetchSymptoms();

            setLoading(false);
        } catch (error) {
            console.error('Gagal mengambil data admin', error);
            setLoading(false);
        }
    };

    const fetchSymptoms = async () => {
        try {
            const res = await axios.get('http://127.0.0.1:8000/api/admin/symptoms', { headers });

            setSymptoms(res.data.symptoms || []);
            setBullyingTypes(res.data.bullying_types || []);
        } catch (error) {
            console.error('Gagal mengambil data gejala', error);
        }
    };

    const handleOpenModal = (symptom = null) => {
        if (symptom) {
            setIsEditing(true);
            setFormData({
                id: symptom.id,
                bullying_type_id: symptom.bullying_type_id,
                code: symptom.code,
                question_text: symptom.question_text
            });
        } else {
            setIsEditing(false);
            setFormData({
                id: null,
                bullying_type_id: '',
                code: '',
                question_text: ''
            });
        }

        setShowModal(true);
    };

    const handleSaveSymptom = async (e) => {
        e.preventDefault();

        try {
            if (isEditing) {
                await axios.put(
                    `http://127.0.0.1:8000/api/admin/symptoms/${formData.id}`,
                    formData,
                    { headers }
                );

                alert('Gejala berhasil diperbarui!');
            } else {
                await axios.post(
                    'http://127.0.0.1:8000/api/admin/symptoms',
                    formData,
                    { headers }
                );

                alert('Gejala baru berhasil ditambahkan!');
            }

            setShowModal(false);
            fetchSymptoms();
        } catch (error) {
            alert('Gagal menyimpan gejala. Pastikan kode tidak duplikat.');
            console.error(error);
        }
    };

    const handleDeleteSymptom = async (id) => {
        if (window.confirm('Yakin ingin menghapus gejala ini secara permanen?')) {
            try {
                await axios.delete(`http://127.0.0.1:8000/api/admin/symptoms/${id}`, { headers });
                fetchSymptoms();
            } catch (error) {
                alert('Gagal menghapus gejala');
            }
        }
    };

    const handleDeleteConfession = async (id) => {
        if (window.confirm('Hapus cerita ini?')) {
            try {
                await axios.delete(`http://127.0.0.1:8000/api/admin/confessions/${id}`, { headers });
                setConfessions(confessions.filter(c => c.id !== id));
            } catch (error) {
                alert('Gagal menghapus cerita');
            }
        }
    };

    // Opsi konfigurasi tampilan Chart.js
    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: true,
                position: 'top'
            },
            tooltip: {
                callbacks: {
                    label: function (context) {
                        return `${context.dataset.label}: ${context.raw}`;
                    }
                }
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    precision: 0
                },
                grid: {
                    display: true,
                    color: '#f1f5f9'
                }
            },
            x: {
                grid: {
                    display: false
                }
            }
        }
    };

    if (loading) {
        return (
            <div style={{ padding: '50px', textAlign: 'center' }}>
                Memuat Panel Admin...
            </div>
        );
    }

    if (!isAdmin) return null;

    return (
        <div style={styles.dashboardContainer}>

            {/* --- SIDEBAR MENU --- */}
            <aside style={styles.sidebar}>
                <div style={styles.sidebarBrand} onClick={() => navigate('/')}>
                    <img
                        src="/logo-ruangpulih.png"
                        alt="Logo RuangPulih"
                        style={{
                            height: '40px',
                            maxWidth: '50px',
                            objectFit: 'contain'
                        }}
                    />

                    <div style={{ fontSize: '20px', fontWeight: '800', color: '#1e293b' }}>
                        Ruang<span style={{ color: '#7a9b76' }}>Pulih.</span>
                    </div>
                </div>

                <nav style={styles.sidebarMenu}>
                    <div
                        onClick={() => setActiveMenu('ringkasan')}
                        style={{
                            ...styles.menuItem,
                            ...(activeMenu === 'ringkasan' ? styles.menuItemActive : {})
                        }}
                    >
                        📊 Ringkasan & Grafik
                    </div>

                    <div
                        onClick={() => setActiveMenu('moderasi')}
                        style={{
                            ...styles.menuItem,
                            ...(activeMenu === 'moderasi' ? styles.menuItemActive : {})
                        }}
                    >
                        📝 Moderasi Cerita
                    </div>

                    <div
                        onClick={() => setActiveMenu('gejala')}
                        style={{
                            ...styles.menuItem,
                            ...(activeMenu === 'gejala' ? styles.menuItemActive : {})
                        }}
                    >
                        ⚙️ Manajemen Gejala
                    </div>
                </nav>

                <div style={{ marginTop: 'auto', borderTop: '1px solid #e2e8f0', paddingTop: '20px' }}>
                    <button onClick={() => navigate('/dashboard')} style={styles.btnSecondary}>
                        Kembali ke Dashboard
                    </button>
                </div>
            </aside>

            {/* --- MAIN CONTENT --- */}
            <main style={styles.mainContent}>
                <header style={styles.topHeader}>
                    <h2 style={{ margin: 0, color: '#1e293b', fontSize: '20px' }}>
                        {activeMenu === 'ringkasan'
                            ? 'Ringkasan Aktivitas Sistem'
                            : activeMenu === 'moderasi'
                                ? 'Moderasi Cerita Pengguna'
                                : 'Manajemen Data Gejala (Sistem Pakar)'}
                    </h2>
                </header>

                <div style={styles.contentBody}>
                    <AnimatedContent distance={20}>

                        {/* ======================================= */}
                        {/* TAB RINGKASAN & GRAFIK */}
                        {/* ======================================= */}
                        {activeMenu === 'ringkasan' && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>

                                {/* STAT CARDS */}
                                <div style={styles.statsGrid}>
                                    <div style={styles.statCard}>
                                        <span style={styles.statTitle}>Total Pengguna</span>
                                        <span style={styles.statValue}>{stats.total_users}</span>
                                    </div>

                                    <div style={styles.statCard}>
                                        <span style={styles.statTitle}>Cerita Dibagikan</span>
                                        <span style={styles.statValue}>{stats.total_confessions}</span>
                                    </div>

                                    <div style={styles.statCard}>
                                        <span style={styles.statTitle}>Sesi Konsultasi Pakar</span>
                                        <span style={{ ...styles.statValue, color: '#7a9b76' }}>
                                            {stats.total_tests}
                                        </span>
                                    </div>
                                </div>

                                {/* DUA GRAFIK BERDAMPINGAN */}
                                <div style={{
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
                                    gap: '24px'
                                }}>
                                    {/* Grafik Keparahan */}
                                    <div style={styles.card}>
                                        <h3 style={{ marginBottom: '20px', fontSize: '15px', color: '#1e293b' }}>
                                            📊 Tingkat Keparahan Kasus Teridentifikasi
                                        </h3>

                                        <div style={{ width: '100%', height: 280 }}>
                                            {chartData.labels.length > 0 ? (
                                                <Bar data={chartData} options={chartOptions} />
                                            ) : (
                                                <div style={{ textAlign: 'center', color: '#94a3b8', paddingTop: '50px' }}>
                                                    Belum ada data
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Grafik Gejala Populer */}
                                    <div style={styles.card}>
                                        <h3 style={{ marginBottom: '20px', fontSize: '15px', color: '#1e293b' }}>
                                            📈 Gejala/Indikator yang Paling Sering Dialami
                                        </h3>

                                        <div style={{ width: '100%', minHeight: 360 }}>
                                            {chartSymptomData.labels.length > 0 ? (
                                                <>
                                                    {/* TAMBAHAN: grafik gejala populer */}
                                                    <div style={{ width: '100%', height: 240 }}>
                                                        <Bar data={chartSymptomData} options={chartOptions} />
                                                    </div>

                                                    {/* TAMBAHAN: keterangan detail teks gejala */}
                                                    <div style={{
                                                        marginTop: '18px',
                                                        fontSize: '12px',
                                                        color: '#64748b',
                                                        lineHeight: '1.6'
                                                    }}>
                                                        {frequentSymptoms.map((item, index) => (
                                                            <div key={index} style={{ marginBottom: '8px' }}>
                                                                <strong style={{ color: '#1e293b' }}>
                                                                    {item.code || item.label}
                                                                </strong>
                                                                {' '} - {item.teks_pertanyaan || item.question_text || item.text || 'Teks gejala tidak tersedia'}
                                                                <span style={{ color: '#7a9b76', fontWeight: 'bold' }}>
                                                                    {' '} ({item.total} pengguna)
                                                                </span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </>
                                            ) : (
                                                <div style={{ textAlign: 'center', color: '#94a3b8', paddingTop: '50px' }}>
                                                    Belum ada data
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* TABEL DETEKSI USER UNTUK PSIKOLOG */}
                                <div style={styles.card}>
                                    <h3 style={{ marginBottom: '20px', fontSize: '16px', color: '#1e293b' }}>
                                        🩺 Pemetaan Gejala Pengguna (Referensi Tindakan Psikolog)
                                    </h3>

                                    <div style={{ overflowX: 'auto' }}>
                                        <table style={styles.tableFixed}>
                                            <thead>
                                                <tr style={{ background: '#f8fafc', textAlign: 'left' }}>
                                                    <th style={{ ...styles.th, width: '150px' }}>Nama Pengguna</th>
                                                    <th style={{ ...styles.th, width: '140px' }}>Tingkat Keparahan</th>
                                                    <th style={styles.th}>Gejala Spesifik yang Terdeteksi</th>
                                                </tr>
                                            </thead>

                                            <tbody>
                                                {consultationHistory.map((item, idx) => (
                                                    <tr key={idx} style={{ borderBottom: '1px solid #e2e8f0' }}>
                                                        <td style={{ ...styles.td, fontWeight: '600', color: '#1e293b' }}>
                                                            {item.user_name} (ID: #{item.user_id})
                                                        </td>

                                                        <td style={styles.td}>
                                                            <span style={{
                                                                padding: '4px 8px',
                                                                borderRadius: '6px',
                                                                fontSize: '12px',
                                                                fontWeight: 'bold',
                                                                background:
                                                                    item.severity_level === 'Berat'
                                                                        ? '#fee2e2'
                                                                        : item.severity_level === 'Sedang'
                                                                            ? '#ffedd5'
                                                                            : '#f0fdf4',
                                                                color:
                                                                    item.severity_level === 'Berat'
                                                                        ? '#ef4444'
                                                                        : item.severity_level === 'Sedang'
                                                                            ? '#f97316'
                                                                            : '#22c55e'
                                                            }}>
                                                                {item.severity_level}
                                                            </span>
                                                        </td>

                                                        <td style={styles.tdTextWrap}>
                                                            {Array.isArray(item.detected_symptoms) && item.detected_symptoms.length > 0 ? (
                                                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                                                    {item.detected_symptoms.map((symptom, index) => {
                                                                        let bg = '#fef3c7';
                                                                        let color = '#b45309';
                                                                        let border = '#f59e0b';

                                                                        if (symptom.score === 2) {
                                                                            bg = '#fee2e2';
                                                                            color = '#dc2626';
                                                                            border = '#ef4444';
                                                                        }

                                                                        if (symptom.score === 3) {
                                                                            bg = '#7f1d1d';
                                                                            color = '#ffffff';
                                                                            border = '#991b1b';
                                                                        }

                                                                        return (
                                                                            <div
                                                                                key={index}
                                                                                title={symptom.text}
                                                                                style={{
                                                                                    background: bg,
                                                                                    color: color,
                                                                                    border: `1px solid ${border}`,
                                                                                    padding: '6px 10px',
                                                                                    borderRadius: '999px',
                                                                                    fontSize: '12px',
                                                                                    fontWeight: '700',
                                                                                    cursor: 'help'
                                                                                }}
                                                                            >
                                                                                {symptom.code} - {symptom.level}
                                                                            </div>
                                                                        );
                                                                    })}
                                                                </div>
                                                            ) : (
                                                                <span style={{ color: '#94a3b8' }}>
                                                                    Indikator belum terikat
                                                                </span>
                                                            )}
                                                        </td>
                                                    </tr>
                                                ))}

                                                {consultationHistory.length === 0 && (
                                                    <tr>
                                                        <td
                                                            colSpan="3"
                                                            style={{
                                                                ...styles.td,
                                                                textAlign: 'center',
                                                                color: '#94a3b8',
                                                                padding: '30px'
                                                            }}
                                                        >
                                                            Belum ada riwayat pemeriksaan konsultasi pengguna.
                                                        </td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* ======================================= */}
                        {/* TAB MODERASI CERITA */}
                        {/* ======================================= */}
                        {activeMenu === 'moderasi' && (
                            <div className="card-container" style={styles.card}>
                                <h3 style={{ marginBottom: '20px' }}>Cerita Terbaru</h3>

                                <table style={styles.tableFixed}>
                                    <thead>
                                        <tr style={{ background: '#f8fafc', textAlign: 'left' }}>
                                            <th style={{ ...styles.th, width: '150px' }}>Pengguna</th>
                                            <th style={styles.th}>Cerita</th>
                                            <th style={{ ...styles.th, width: '100px', textAlign: 'center' }}>Aksi</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {confessions.map(c => (
                                            <tr key={c.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                                                <td style={{ ...styles.td, fontWeight: '600', color: '#64748b' }}>
                                                    {/* 💡 FIX: Sesuaikan dengan properti author_alias atau gunakan ID sebagai cadangan */}
                                                    {c.author_alias ? c.author_alias : `Anonim #${c.user_id || c.id}`}
                                                </td>

                                                <td style={styles.tdTextWrap}>
                                                    {/* 💡 FIX: Gunakan c.story sesuai dengan data yang dikirim backend */}
                                                    {c.story || c.content || <span style={{color: '#94a3b8', fontStyle: 'italic'}}>Teks tidak tersedia</span>}
                                                </td>

                                                <td style={{ ...styles.td, textAlign: 'center' }}>
                                                    <button
                                                        onClick={() => handleDeleteConfession(c.id)}
                                                        style={styles.btnDanger}
                                                    >
                                                        Hapus
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}

                                        {confessions.length === 0 && (
                                            <tr>
                                                <td
                                                    colSpan="3"
                                                    style={{
                                                        ...styles.td,
                                                        textAlign: 'center',
                                                        color: '#94a3b8',
                                                        padding: '30px'
                                                    }}
                                                >
                                                    Belum ada cerita.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {/* ======================================= */}
                        {/* TAB MANAJEMEN GEJALA */}
                        {/* ======================================= */}
                        {activeMenu === 'gejala' && (
                            <div className="card-container" style={styles.card}>
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    marginBottom: '20px'
                                }}>
                                    <h3>Daftar Gejala & Pertanyaan</h3>

                                    <button onClick={() => handleOpenModal()} style={styles.btnPrimary}>
                                        + Tambah Gejala Baru
                                    </button>
                                </div>

                                <div style={{ overflowX: 'auto' }}>
                                    <table style={styles.table}>
                                        <thead>
                                            <tr style={{ background: '#f8fafc', textAlign: 'left' }}>
                                                <th style={styles.th}>Kode</th>
                                                <th style={styles.th}>Kategori Bullying</th>
                                                <th style={styles.th}>Pertanyaan / Gejala</th>
                                                <th style={styles.th}>Aksi</th>
                                            </tr>
                                        </thead>

                                        <tbody>
                                            {symptoms.map(s => (
                                                <tr key={s.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                                                    <td style={{ ...styles.td, fontWeight: 'bold', color: '#7a9b76' }}>
                                                        {s.code}
                                                    </td>

                                                    <td style={styles.td}>
                                                        <span style={{
                                                            background: '#f1f5f9',
                                                            padding: '4px 8px',
                                                            borderRadius: '4px',
                                                            fontSize: '13px'
                                                        }}>
                                                            {s.bullying_type ? s.bullying_type.name : 'Unknown'}
                                                        </span>
                                                    </td>

                                                    <td style={styles.tdTextWrap}>
                                                        {s.question_text}
                                                    </td>

                                                    <td style={{ ...styles.td, display: 'flex', gap: '8px' }}>
                                                        <button onClick={() => handleOpenModal(s)} style={styles.btnEdit}>
                                                            Edit
                                                        </button>

                                                        <button onClick={() => handleDeleteSymptom(s.id)} style={styles.btnDanger}>
                                                            Hapus
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}

                                            {symptoms.length === 0 && (
                                                <tr>
                                                    <td
                                                        colSpan="4"
                                                        style={{
                                                            ...styles.td,
                                                            textAlign: 'center',
                                                            color: '#94a3b8',
                                                            padding: '30px'
                                                        }}
                                                    >
                                                        Belum ada data gejala.
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                    </AnimatedContent>
                </div>
            </main>

            {/* --- MODAL FORM GEJALA --- */}
            {showModal && (
                <div style={styles.modalOverlay}>
                    <div style={styles.modalContent}>
                        <h3 style={{ marginBottom: '20px' }}>
                            {isEditing ? 'Edit Gejala' : 'Tambah Gejala Baru'}
                        </h3>

                        <form onSubmit={handleSaveSymptom} style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '15px'
                        }}>
                            <div>
                                <label style={styles.label}>Kategori / Jenis Bullying</label>

                                <select
                                    required
                                    style={styles.input}
                                    value={formData.bullying_type_id}
                                    onChange={e => setFormData({ ...formData, bullying_type_id: e.target.value })}
                                >
                                    <option value="">-- Pilih Jenis --</option>

                                    {bullyingTypes.map(type => (
                                        <option key={type.id} value={type.id}>
                                            {type.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label style={styles.label}>Kode Gejala (Misal: G26)</label>

                                <input
                                    type="text"
                                    required
                                    style={styles.input}
                                    value={formData.code}
                                    onChange={e => setFormData({ ...formData, code: e.target.value })}
                                />
                            </div>

                            <div>
                                <label style={styles.label}>Teks Pertanyaan / Gejala</label>

                                <textarea
                                    required
                                    rows="3"
                                    style={styles.input}
                                    value={formData.question_text}
                                    onChange={e => setFormData({ ...formData, question_text: e.target.value })}
                                />
                            </div>

                            <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                                <button type="submit" style={{ ...styles.btnPrimary, flex: 1 }}>
                                    Simpan
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    style={{ ...styles.btnSecondary, flex: 1 }}
                                >
                                    Batal
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

const styles = {
    dashboardContainer: {
        display: 'flex',
        height: '100vh',
        backgroundColor: '#f8fafc',
        fontFamily: "'Inter', sans-serif"
    },

    sidebar: {
        width: '260px',
        backgroundColor: '#ffffff',
        borderRight: '1px solid #e2e8f0',
        display: 'flex',
        flexDirection: 'column',
        padding: '24px'
    },

    sidebarBrand: {
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        cursor: 'pointer',
        marginBottom: '40px'
    },

    sidebarMenu: {
        display: 'flex',
        flexDirection: 'column',
        gap: '8px'
    },

    menuItem: {
        padding: '12px 16px',
        borderRadius: '10px',
        color: '#64748b',
        fontWeight: '600',
        fontSize: '14px',
        cursor: 'pointer',
        transition: 'all 0.2s ease'
    },

    menuItemActive: {
        backgroundColor: '#f0f7f0',
        color: '#7a9b76'
    },

    mainContent: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        overflowY: 'auto'
    },

    topHeader: {
        height: '70px',
        backgroundColor: '#ffffff',
        borderBottom: '1px solid #e2e8f0',
        display: 'flex',
        alignItems: 'center',
        padding: '0 32px'
    },

    contentBody: {
        padding: '32px'
    },

    card: {
        backgroundColor: '#ffffff',
        padding: '24px',
        borderRadius: '16px',
        border: '1px solid #e2e8f0',
        boxShadow: '0 4px 6px rgba(0,0,0,0.02)'
    },

    statsGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '20px'
    },

    statCard: {
        backgroundColor: '#ffffff',
        padding: '24px',
        borderRadius: '16px',
        border: '1px solid #e2e8f0',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px'
    },

    statTitle: {
        fontSize: '14px',
        color: '#64748b',
        fontWeight: '500'
    },

    statValue: {
        fontSize: '28px',
        color: '#1e293b',
        fontWeight: '800'
    },

    table: {
        width: '100%',
        borderCollapse: 'collapse'
    },

    tableFixed: {
        width: '100%',
        borderCollapse: 'collapse',
        tableLayout: 'fixed'
    },

    th: {
        padding: '12px 16px',
        borderBottom: '2px solid #e2e8f0',
        color: '#475569',
        fontSize: '14px'
    },

    td: {
        padding: '12px 16px',
        color: '#1e293b',
        fontSize: '14px',
        verticalAlign: 'top'
    },

    tdTextWrap: {
        padding: '12px 16px',
        color: '#1e293b',
        fontSize: '14px',
        verticalAlign: 'top',
        whiteSpace: 'normal',
        wordWrap: 'break-word',
        wordBreak: 'break-word',
        lineHeight: '1.6'
    },

    btnPrimary: {
        background: '#7a9b76',
        color: 'white',
        border: 'none',
        padding: '10px 16px',
        borderRadius: '8px',
        cursor: 'pointer',
        fontWeight: 'bold'
    },

    btnSecondary: {
        background: '#f1f5f9',
        color: '#475569',
        border: 'none',
        padding: '10px 16px',
        borderRadius: '8px',
        cursor: 'pointer',
        fontWeight: 'bold'
    },

    btnDanger: {
        background: '#fee2e2',
        color: '#ef4444',
        border: 'none',
        padding: '6px 12px',
        borderRadius: '6px',
        cursor: 'pointer',
        fontWeight: 'bold',
        fontSize: '12px'
    },

    btnEdit: {
        background: '#e0f2fe',
        color: '#0284c7',
        border: 'none',
        padding: '6px 12px',
        borderRadius: '6px',
        cursor: 'pointer',
        fontWeight: 'bold',
        fontSize: '12px'
    },

    modalOverlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999
    },

    modalContent: {
        backgroundColor: 'white',
        padding: '30px',
        borderRadius: '16px',
        width: '100%',
        maxWidth: '500px',
        boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)'
    },

    label: {
        fontSize: '14px',
        fontWeight: '600',
        color: '#475569',
        marginBottom: '5px',
        display: 'block'
    },

    input: {
        padding: '10px 12px',
        borderRadius: '8px',
        border: '1px solid #cbd5e1',
        fontSize: '14px',
        width: '100%',
        outline: 'none'
    }
};

export default AdminDashboard;