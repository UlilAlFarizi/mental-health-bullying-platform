import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const SuperAdminPanel = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('tambah');
    
    // Form untuk membuat Admin Baru
    const [newAdmin, setNewAdmin] = useState({ name: '', email: '', password: '' });

    // Dummy Data Permintaan Ganti Email (Nanti dari API Laravel Anda)
    const [emailRequests, setEmailRequests] = useState([
        { id: 1, name: 'Dr. Anastasia', old_email: 'ana_lama@gmail.com', new_email: 'anastasia.klinis@RuangPulih.com', status: 'pending' },
        { id: 2, name: 'Bapak Budi', old_email: 'budi123@yahoo.com', new_email: 'budi.konselor@RuangPulih.com', status: 'pending' }
    ]);

const handleCreateAdmin = async (e) => {
    e.preventDefault();

    try {
        const token = localStorage.getItem('auth_token');

        const response = await axios.post(
            'http://127.0.0.1:8000/api/superadmin/create-admin',
            {
                name: newAdmin.name,
                email: newAdmin.email,
                password: newAdmin.password,
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: 'application/json',
                },
            }
        );

        alert(response.data.message || `Akun Admin untuk ${newAdmin.name} berhasil dibuat!`);
        setNewAdmin({ name: '', email: '', password: '' });
    } catch (err) {
        alert(err.response?.data?.message || 'Gagal membuat akun admin.');
    }
};

    const handleApproveEmail = (id) => {
        // Nanti hubungkan ke: axios.post(`http://127.0.0.1:8000/api/superadmin/approve-email/${id}`)
        setEmailRequests(prev => prev.filter(req => req.id !== id));
        alert('Pergantian email berhasil disetujui!');
    };

    return (
        <div style={{ background: '#f8fafc', minHeight: '100vh', fontFamily: "'Inter', sans-serif", padding: '40px' }}>
            <div style={{ maxWidth: '900px', margin: '0 auto' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                    <div>
                        <h1 style={{ fontFamily: "'Playfair Display', serif", margin: '0 0 10px 0', color: '#1e293b' }}>Panel Superadmin 👑</h1>
                        <p style={{ color: '#64748b', margin: 0 }}>Kelola akses pengelola dan keamanan sistem RuangPulih.</p>
                    </div>
                    <button onClick={() => navigate('/dashboard')} style={{ background: 'white', border: '1px solid #cbd5e1', padding: '10px 20px', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer' }}>
                        Kembali ke Dashboard
                    </button>
                </div>

                <div style={{ display: 'flex', gap: '15px', marginBottom: '25px' }}>
                    <button onClick={() => setActiveTab('tambah')} style={{ background: activeTab === 'tambah' ? '#1e293b' : 'white', color: activeTab === 'tambah' ? 'white' : '#64748b', border: 'none', padding: '12px 25px', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer' }}>Tambah Admin Baru</button>
                    <button onClick={() => setActiveTab('verifikasi')} style={{ background: activeTab === 'verifikasi' ? '#1e293b' : 'white', color: activeTab === 'verifikasi' ? 'white' : '#64748b', border: 'none', padding: '12px 25px', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer' }}>Verifikasi Email Admin</button>
                </div>

                {activeTab === 'tambah' && (
                    <div style={{ background: 'white', padding: '40px', borderRadius: '24px', boxShadow: '0 10px 30px rgba(0,0,0,0.03)' }}>
                        <h3 style={{ marginTop: 0, marginBottom: '25px', color: '#1e293b' }}>Buat Akun Pengelola (Admin)</h3>
                        <form onSubmit={handleCreateAdmin} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', fontSize: '13px' }}>Nama Lengkap & Gelar</label>
                                <input type="text" value={newAdmin.name} onChange={e => setNewAdmin({...newAdmin, name: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #e2e8f0' }} required />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', fontSize: '13px' }}>Email Akses</label>
                                <input type="email" value={newAdmin.email} onChange={e => setNewAdmin({...newAdmin, email: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #e2e8f0' }} required />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', fontSize: '13px' }}>Password Sementara</label>
                                <input type="password" value={newAdmin.password} onChange={e => setNewAdmin({...newAdmin, password: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #e2e8f0' }} required />
                            </div>
                            <button type="submit" style={{ background: 'var(--sage-main)', color: 'white', border: 'none', padding: '15px', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px' }}>Buatkan Akun Admin</button>
                        </form>
                    </div>
                )}

                {activeTab === 'verifikasi' && (
                    <div style={{ background: 'white', padding: '40px', borderRadius: '24px', boxShadow: '0 10px 30px rgba(0,0,0,0.03)' }}>
                        <h3 style={{ marginTop: 0, marginBottom: '25px', color: '#1e293b' }}>Daftar Permintaan Ganti Email</h3>
                        {emailRequests.length === 0 ? (
                            <p style={{ color: '#94a3b8', textAlign: 'center', padding: '30px' }}>Tidak ada permintaan ganti email saat ini.</p>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                {emailRequests.map(req => (
                                    <div key={req.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8fafc', padding: '20px', borderRadius: '16px', border: '1px solid #f1f5f9' }}>
                                        <div>
                                            <div style={{ fontWeight: 'bold', color: '#1e293b', marginBottom: '5px' }}>{req.name}</div>
                                            <div style={{ fontSize: '13px', color: '#64748b' }}>Dari: <span style={{ textDecoration: 'line-through' }}>{req.old_email}</span></div>
                                            <div style={{ fontSize: '13px', color: '#10b981', fontWeight: 'bold' }}>Ke: {req.new_email}</div>
                                        </div>
                                        <button onClick={() => handleApproveEmail(req.id)} style={{ background: '#10b981', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer' }}>
                                            Setujui Perubahan
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default SuperAdminPanel;