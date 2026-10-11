import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Import semua halaman Anda
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import GuestDashboard from './pages/GuestDashboard'; // <-- Pastikan ini di-import
import Test from './pages/Test';
import AdminDashboard from './pages/AdminDashboard'; // (Sesuaikan nama file Anda)
import SuperAdminPanel from './pages/SuperAdminPanel';
import GeminiChat from './components/GeminiChat';

// Komponen Proteksi (Satpam Rute)
const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem('auth_token');
    if (!token) return <Navigate to="/login" />;
    return children;
};

function App() {
    return (
        <Router>
            <Routes>
                {/* RUTE PUBLIK */}
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                
                {/* RUTE KHUSUS TAMU */}
                <Route path="/tamu" element={<GuestDashboard />} />

                {/* RUTE TES (Bisa diakses Login maupun Tamu, logikanya ada di dalam Test.jsx) */}
                <Route path="/tes" element={<Test />} />

                {/* RUTE TERKUNCI (Wajib Login) */}
                <Route 
                    path="/dashboard" 
                    element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    } 
                />
                
                {/* Rute Admin (Opsional, pastikan Anda punya proteksinya) */}
                <Route path="/superadmin" element={<SuperAdminPanel />} />
                <Route path="/admin" element={<AdminDashboard />} />
            </Routes>
            <GeminiChat />
        </Router>
    );
}

export default App;