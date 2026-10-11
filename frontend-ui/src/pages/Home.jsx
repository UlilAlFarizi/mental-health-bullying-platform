import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import AnimatedContent from '../components/AnimatedContent';
import { motion } from 'framer-motion';
import Carousel from '../components/Carousel';
import GeminiChat from '../components/GeminiChat';


const Home = () => {
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('beranda');

    const [statistics, setStatistics] = useState([]);
    const [totalTests, setTotalTests] = useState(0);
    const [confessions, setConfessions] = useState([]);
    const [liveSymptoms, setLiveSymptoms] = useState([]);
    const motivationalQuotes = [
    { text: "Luka batinmu saat ini bukanlah akhir dari ceritamu, melainkan awal dari ketangguhan luar biasa yang sedang kamu bangun.", author: "RuangPulih" },
    { text: "Tidak ada seorang pun yang bisa membuatmu merasa rendah diri tanpa persetujuan dari dirimu sendiri.", author: "Eleanor Roosevelt" },
    { text: "Rasa sakit yang kamu rasakan hari ini adalah kekuatan yang akan kamu miliki di masa depan.", author: "Anonim" }
];

    const [currentQuoteIdx, setCurrentQuoteIdx] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentQuoteIdx((prev) => (prev + 1) % motivationalQuotes.length);
        }, 7000); // Ganti quotes setiap 7 detik
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/statistics')
        .then(response => {
            setStatistics(response.data.data);
            setTotalTests(response.data.total_tests);
        }).catch(error => console.error(error));

    axios.get('http://127.0.0.1:8000/api/community/confessions')
        .then(response => setConfessions(response.data.slice(0, 3)))
        .catch(error => console.error(error));

    // --- AMBIL DATA GEJALA REALTIME UNTUK TABEL ---
    axios.get('http://127.0.0.1:8000/api/education/symptoms')
        .then(response => setLiveSymptoms(response.data))
        .catch(error => console.error("Gagal memuat list gejala edukasi", error));
    }, []);

    const handleTabChange = (tab) => {
        setActiveTab(tab);
        setIsMenuOpen(false);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // DATABASE ARTIKEL EKSTERNAL
    const articles = [
        {
            id: 1,
            title: "Mengapa Kesehatan Mental Sama Pentingnya dengan Fisik?",
            desc: "Seringkali diabaikan, padahal luka batin memiliki dampak yang sama nyatanya dengan luka fisik.",
            category: "Edukasi Dasar",
            color: "var(--sage-main)",
            bg: "var(--sage-light)",
            img: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=600&q=80",
            link: "https://www.halodoc.com/artikel/kesehatan-mental-menurut-who-bukan-sekadar-tak-sakit"
        },
        {
            id: 2,
            title: "Memahami Serangan Panik dan Cara Penanganannya",
            desc: "Pelajari gejala serangan panik dan bagaimana cara mengembalikan kesadaran Anda dengan tepat.",
            category: "Penanganan",
            color: "#dc2626",
            bg: "#fee2e2",
            img: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=600&q=80",
            link: "https://www.alodokter.com/serangan-panik"
        },
        {
            id: 3,
            title: "Membangun Kembali Kepercayaan Diri Pasca Perundungan",
            desc: "Temukan cara bertahap untuk memaafkan, menerima diri sendiri, dan bangkit menjadi lebih tangguh.",
            category: "Pemulihan",
            color: "#4f46e5",
            bg: "#e0e7ff",
            img: "https://images.unsplash.com/photo-1471922694854-ff1b63b20054?auto=format&fit=crop&w=600&q=80",
            link: "https://www.unicef.org/indonesia/id/kampung-pengasuhan/perlindungan-anak/artikel/cara-membicarakan-bullying-dengan-anak-anda"
        },
        {
            id: 4,
            title: "Memahami Cyberbullying: Luka Tak Berdarah di Era Digital",
            desc: "Kenali ciri-ciri perundungan siber dan bagaimana cara melindungi diri Anda di media sosial.",
            category: "Wawasan Baru",
            color: "#d97706",
            bg: "#fef3c7",
            img: "https://images.unsplash.com/photo-1512428559087-560fa5ceab42?auto=format&fit=crop&w=600&q=80",
            link: "https://www.unicef.org/indonesia/id/child-protection/apa-itu-cyberbullying"
        },
        {
            id: 5,
            title: "Panduan Menghadapi Teman yang Mengalami Depresi",
            desc: "Terkadang, mendengarkan tanpa menghakimi adalah obat terbaik yang bisa Anda berikan.",
            category: "Sosial",
            color: "#059669",
            bg: "#d1fae5",
            img: "https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=600&q=80",
            link: "https://www.halodoc.com/kesehatan-mental"
        },
    ];

    const services = [
        {
            img: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=600&q=80',
            icon: 'fa-brain',
            title: 'Evaluasi Fuzzy Logic',
            desc: 'Sistem cerdas kami membantu membaca tingkat risiko trauma psikologis melalui metode komputasi logika pakar.',
            tag: 'Gratis Akses'
        },
        {
            img: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=600&q=80',
            icon: 'fa-spa',
            title: 'Panduan Self-Care',
            desc: 'Dapatkan langkah kecil harian, jurnal refleksi, dan rekomendasi pemulihan berdasarkan hasil evaluasi Anda.',
            tag: 'Mode Pengguna'
        },
        {
            img: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=600&q=80',
            icon: 'fa-user-group',
            title: 'Komunitas Anonim',
            desc: 'Berbagi cerita dan dukungan emosional dalam ruang aman tanpa perlu membuka identitas asli Anda.',
            tag: 'Safe Space'
        }
    ];

    return (
        <div style={{ fontFamily: "'Inter', sans-serif", color: '#334155', backgroundColor: '#fcfdfc', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=Inter:wght@300;400;500;600;700;800;900&display=swap');

                html, body {
                    max-width: 100vw;
                    overflow-x: hidden !important;
                    margin: 0;
                    padding: 0;
                }

                * {
                    box-sizing: border-box;
                }

                .nav-container {
                    height: 76px;
                    padding: 0 40px;
                    border-bottom: 1px solid #e2e8f0;
                    box-shadow: 0 6px 20px rgba(15, 23, 42, 0.04);
                }

                .nav-inner {
                    max-width: 1200px;
                    height: 100%;
                    margin: 0 auto;
                    display: grid;
                    grid-template-columns: 220px 1fr 300px;
                    align-items: center;
                    gap: 24px;
                }

                .desktop-menu {
                    display: flex;
                }

                .mobile-toggle {
                    display: none;
                }

                .mobile-dropdown {
                    display: none;
                }

                .serif-title {
                    font-family: 'Playfair Display', serif;
                    color: #1e293b;
                    line-height: 1.2;
                }

                .sub-heading {
                    font-size: 11px;
                    font-weight: 800;
                    letter-spacing: 2.4px;
                    text-transform: uppercase;
                    color: var(--sage-main);
                    margin-bottom: 15px;
                    display: block;
                }

                .btn-primary {
                    background-color: var(--sage-main);
                    color: white;
                    border-radius: 30px;
                    font-weight: 700;
                    border: none;
                    cursor: pointer;
                    transition: 0.3s;
                    padding: 14px 32px;
                    font-size: 15px;
                    white-space: nowrap;
                }

                .btn-primary:hover {
                    background-color: var(--sage-dark);
                    transform: translateY(-2px);
                    box-shadow: 0 10px 20px rgba(122,155,118,0.2);
                }

                .btn-secondary {
                    background-color: transparent;
                    color: #1e293b;
                    border: 1px solid #cbd5e1;
                    border-radius: 30px;
                    font-weight: 700;
                    cursor: pointer;
                    transition: 0.3s;
                    padding: 14px 32px;
                    font-size: 15px;
                    white-space: nowrap;
                }

                .btn-secondary:hover {
                    border-color: var(--sage-main);
                    color: var(--sage-main);
                    background: #fbfdf9;
                }

                .nav-link {
                    cursor: pointer;
                    transition: 0.3s;
                    position: relative;
                    padding: 5px 0;
                    font-weight: 500;
                    color: #64748b;
                    font-size: 15px;
                    white-space: nowrap;
                }

                .nav-link:hover {
                    color: #1e293b;
                }

                .nav-link.active {
                    color: #1e293b;
                    font-weight: 600;
                }

                .nav-link.active::after {
                    content: '';
                    position: absolute;
                    bottom: -5px;
                    left: 0;
                    width: 100%;
                    height: 2px;
                    background-color: var(--sage-main);
                }

                .arch-image {
                    border-radius: 220px 220px 28px 28px;
                    object-fit: cover;
                    width: 100%;
                    height: 100%;
                }

                .hide-scroll::-webkit-scrollbar {
                    display: none;
                }

                .hide-scroll {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }

                .home-section {
                    position: relative;
                    overflow: hidden;
                    background:
                        radial-gradient(circle at top left, rgba(122,155,118,0.09), transparent 28%),
                        linear-gradient(180deg, #fcfdfc 0%, #ffffff 52%, #f8fafc 100%);
                }

                .hero-section {
                    max-width: 1200px;
                    margin: 0 auto;
                    padding: 94px 20px 72px;
                    display: grid;
                    grid-template-columns: 1.08fr 0.92fr;
                    gap: 70px;
                    align-items: center;
                }

                .hero-copy {
                    position: relative;
                    z-index: 2;
                }

                .hero-title {
                    font-size: clamp(3.2rem, 6vw, 5.35rem);
                    margin: 0 0 28px 0;
                    letter-spacing: -2px;
                    line-height: 0.98;
                }

                .hero-text {
                    font-size: 1.08rem;
                    color: #475569;
                    margin: 0 0 38px 0;
                    line-height: 1.9;
                    font-weight: 400;
                    max-width: 570px;
                }

                .hero-actions {
                    display: flex;
                    gap: 16px;
                    flex-wrap: wrap;
                }

                .hero-image-wrap {
                    position: relative;
                    height: 560px;
                }

                .hero-image-card {
                    position: relative;
                    height: 100%;
                    border-radius: 220px 220px 28px 28px;
                    overflow: hidden;
                    background: #eef4ef;
                    box-shadow: 0 30px 80px rgba(15, 23, 42, 0.10);
                }

                .hero-image-card::before {
                    content: '';
                    position: absolute;
                    inset: 18px;
                    border: 1px solid rgba(255,255,255,0.45);
                    border-radius: 205px 205px 22px 22px;
                    z-index: 2;
                    pointer-events: none;
                }

                .hero-floating-card {
                    position: absolute;
                    left: -36px;
                    bottom: 45px;
                    background: rgba(255,255,255,0.92);
                    backdrop-filter: blur(12px);
                    border: 1px solid #eef2f7;
                    border-radius: 22px;
                    padding: 18px 20px;
                    box-shadow: 0 22px 55px rgba(15,23,42,0.10);
                    max-width: 250px;
                    z-index: 3;
                }

                .hero-floating-card strong {
                    display: block;
                    color: #1e293b;
                    font-size: 15px;
                    margin-bottom: 6px;
                }

                .hero-floating-card span {
                    display: block;
                    color: #64748b;
                    font-size: 13px;
                    line-height: 1.55;
                }

                .hero-stat-row {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 18px;
                    max-width: 1200px;
                    margin: 0 auto;
                    padding: 0 20px 84px;
                }

                .hero-stat-card {
                    background: white;
                    border: 1px solid #eef2f7;
                    border-radius: 24px;
                    padding: 24px;
                    box-shadow: 0 18px 45px rgba(15,23,42,0.045);
                    transition: 0.3s;
                }

                .hero-stat-card:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 26px 60px rgba(15,23,42,0.08);
                }

                .hero-stat-card h3 {
                    margin: 0 0 6px 0;
                    color: #1e293b;
                    font-size: 2rem;
                    font-weight: 900;
                }

                .hero-stat-card p {
                    margin: 0;
                    color: #64748b;
                    font-size: 14px;
                    line-height: 1.6;
                }

                .services-section {
                    background:
                        radial-gradient(circle at top left, rgba(122,155,118,0.11), transparent 28%),
                        linear-gradient(180deg, #ffffff 0%, #f8fafc 100%);
                    padding: 95px 20px;
                }

                .section-shell {
                    max-width: 1200px;
                    margin: 0 auto;
                }

                .section-heading {
                    text-align: center;
                    max-width: 720px;
                    margin: 0 auto 60px;
                }

                .section-heading h2 {
                    font-size: clamp(2.2rem, 4vw, 3.2rem);
                    margin: 0 0 14px 0;
                }

                .section-heading p {
                    color: #64748b;
                    font-size: 15px;
                    line-height: 1.75;
                    margin: 0;
                }

                .service-grid {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 28px;
                }

                .service-card {
                    background: white;
                    border: 1px solid #eef2f7;
                    border-radius: 30px;
                    overflow: hidden;
                    box-shadow: 0 18px 45px rgba(15,23,42,0.045);
                    transition: 0.3s ease;
                }

                .service-card:hover {
                    transform: translateY(-8px);
                    box-shadow: 0 26px 70px rgba(15,23,42,0.09);
                }

                .service-img-wrap {
                    height: 230px;
                    overflow: hidden;
                }

                .service-img-wrap img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    transition: 0.5s ease;
                }

                .service-card:hover .service-img-wrap img {
                    transform: scale(1.06);
                }

                .service-body {
                    padding: 30px;
                }

                .service-pill {
                    display: inline-flex;
                    align-items: center;
                    gap: 7px;
                    padding: 7px 12px;
                    border-radius: 999px;
                    background: #f1f8ef;
                    color: var(--sage-dark);
                    font-size: 12px;
                    font-weight: 900;
                    margin-bottom: 18px;
                }

                .service-body h3 {
                    font-size: 1.45rem;
                    margin: 0 0 14px 0;
                }

                .service-body p {
                    color: #64748b;
                    line-height: 1.75;
                    font-size: 14px;
                    margin: 0 0 22px 0;
                }

                .service-link {
                    color: var(--sage-main);
                    font-weight: 900;
                    font-size: 14px;
                }

                .trust-section {
                    max-width: 1200px;
                    margin: 0 auto;
                    padding: 105px 20px;
                    display: grid;
                    grid-template-columns: 0.9fr 1.1fr;
                    gap: 70px;
                    align-items: center;
                }

                .trust-title {
                    font-size: clamp(2.4rem, 4.5vw, 3.6rem);
                    margin: 0 0 22px 0;
                    line-height: 1.08;
                }

                .trust-text {
                    color: #64748b;
                    line-height: 1.85;
                    font-size: 15px;
                    margin: 0 0 18px 0;
                }

                .trust-list {
                    display: grid;
                    gap: 14px;
                    margin-top: 28px;
                }

                .trust-list-item {
                    display: flex;
                    gap: 12px;
                    align-items: flex-start;
                    color: #475569;
                    font-size: 14px;
                    line-height: 1.65;
                }

                .trust-list-item i {
                    color: var(--sage-main);
                    margin-top: 4px;
                }

                .expert-card {
                    background: white;
                    border: 1px solid #eef2f7;
                    border-radius: 34px;
                    padding: 38px;
                    box-shadow: 0 28px 80px rgba(15,23,42,0.075);
                }

                .expert-card h3 {
                    font-size: 2.2rem;
                    margin: 0 0 30px 0;
                }

                .expert-item {
                    display: flex;
                    gap: 20px;
                    align-items: flex-start;
                    padding: 22px;
                    border-radius: 24px;
                    background: #fbfdf9;
                    border: 1px solid #eef2f7;
                }

                .expert-item + .expert-item {
                    margin-top: 18px;
                }

                .expert-item img {
                    width: 82px;
                    height: 82px;
                    border-radius: 50%;
                    object-fit: cover;
                    border: 4px solid white;
                    box-shadow: 0 12px 30px rgba(15,23,42,0.08);
                    flex-shrink: 0;
                }

                .expert-item h4 {
                    font-size: 1.18rem;
                    margin: 0 0 7px 0;
                }

                .expert-item p {
                    margin: 0;
                    color: #64748b;
                    font-size: 13.5px;
                    line-height: 1.7;
                }

                .article-section {
                    background:
                        radial-gradient(circle at top right, rgba(122,155,118,0.10), transparent 30%),
                        #f8fafc;
                    padding: 100px 0 80px;
                    margin-top: 40px;
                    border-radius: 46px 46px 0 0;
                    overflow: hidden;
                }

                .article-top {
                    max-width: 1200px;
                    margin: 0 auto 45px;
                    padding: 0 20px;
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-end;
                    gap: 24px;
                    flex-wrap: wrap;
                }

                .article-top h2 {
                    font-size: clamp(2.3rem, 4vw, 3.2rem);
                    margin: 0;
                }

                .article-top p {
                    color: #64748b;
                    margin: 12px 0 0 0;
                    font-size: 15px;
                }

                .article-hint {
                    background: white;
                    border: 1px solid #eef2f7;
                    border-radius: 999px;
                    padding: 12px 16px;
                    color: #64748b;
                    font-size: 13px;
                    font-weight: 800;
                    box-shadow: 0 12px 30px rgba(15,23,42,0.045);
                }

                .article-carousel {
                    cursor: grab;
                    padding-left: max(20px, calc((100vw - 1200px) / 2));
                }

                .article-track {
                    display: flex;
                    gap: 26px;
                    padding: 0 20px 42px 20px;
                }

                .article-card {
                    min-width: 580px; 
                    height: 280px; /* <-- TINGGI DITAMBAH MENJADI 280px */
                    display: flex;
                    flex-direction: row;
                    background: white;
                    border-radius: 24px;
                    overflow: hidden;
                    border: 1px solid #e2e8f0; 
                    box-shadow: 0 4px 20px rgba(0,0,0,0.03);
                    cursor: pointer;
                    scroll-snap-align: center;
                    transition: all 0.3s ease;
                }

                .article-card:hover {
                    transform: translateY(-7px);
                    box-shadow: 0 28px 70px rgba(15,23,42,0.10);
                }

                .article-img {
                    height: 220px;
                    overflow: hidden;
                    pointer-events: none;
                }

                .article-img img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }

                .article-body {
                    padding: 28px;
                    display: flex;
                    flex-direction: column;
                    flex-grow: 1;
                }

                .article-category {
                    display: inline-flex;
                    width: fit-content;
                    padding: 6px 12px;
                    border-radius: 999px;
                    font-size: 12px;
                    font-weight: 900;
                    margin-bottom: 16px;
                }

                .article-body h3 {
                    font-size: 1.28rem;
                    margin: 0 0 13px 0;
                    line-height: 1.35;
                }

                .article-body p {
                    color: #64748b;
                    font-size: 14px;
                    line-height: 1.75;
                    margin: 0 0 22px 0;
                    flex-grow: 1;
                }

                .article-read {
                    color: var(--sage-main);
                    font-weight: 900;
                    font-size: 14px;
                    display: flex;
                    align-items: center;
                    gap: 7px;
                }
.data-page {
    max-width: 1200px;
    margin: 0 auto;
    padding: 78px 20px 100px;
}

.data-hero {
    text-align: center;
    max-width: 760px;
    margin: 0 auto 64px;
}

.data-hero h1 {
    font-size: clamp(2.6rem, 5vw, 4rem);
    margin: 0 0 16px 0;
    letter-spacing: -1px;
}

.data-hero p {
    color: #64748b;
    font-size: 16px;
    line-height: 1.8;
    margin: 0;
}

.data-summary-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 24px;
    margin-bottom: 34px;
}

.data-summary-card {
    background: white;
    border: 1px solid #eef2f7;
    border-radius: 28px;
    padding: 28px;
    box-shadow: 0 18px 45px rgba(15,23,42,0.045);
    display: flex;
    align-items: center;
    gap: 18px;
    transition: 0.3s ease;
}

.data-summary-card:hover {
    transform: translateY(-6px);
    box-shadow: 0 28px 70px rgba(15,23,42,0.08);
}

.data-summary-icon {
    width: 62px;
    height: 62px;
    border-radius: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
    flex-shrink: 0;
}

.data-summary-label {
    color: #64748b;
    font-size: 12px;
    font-weight: 900;
    text-transform: uppercase;
    letter-spacing: 0.8px;
    margin-bottom: 7px;
}

.data-summary-value {
    color: #1e293b;
    font-size: 2rem;
    font-weight: 900;
    line-height: 1;
}

.story-panel {
    background: white;
    border: 1px solid #eef2f7;
    border-radius: 34px;
    padding: 38px;
    box-shadow: 0 22px 70px rgba(15,23,42,0.055);
    margin-bottom: 34px;
}

.story-panel-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    gap: 24px;
    margin-bottom: 28px;
}

.story-panel-header h2 {
    font-size: clamp(2rem, 4vw, 3rem);
    margin: 0 0 10px 0;
}

.story-panel-header p {
    margin: 0;
    color: #64748b;
    line-height: 1.7;
    font-size: 15px;
}

.story-badge {
    background: #f1f8ef;
    color: var(--sage-dark);
    padding: 10px 16px;
    border-radius: 999px;
    font-size: 13px;
    font-weight: 900;
    white-space: nowrap;
}

.story-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 22px;
}

.story-card {
    background: #fbfdf9;
    border: 1px solid #eef2f7;
    border-radius: 26px;
    padding: 26px;
    min-height: 245px;
    display: flex;
    flex-direction: column;
    transition: 0.3s ease;
}

.story-card:hover {
    background: white;
    transform: translateY(-5px);
    box-shadow: 0 20px 48px rgba(15,23,42,0.07);
}

.story-avatar {
    width: 58px;
    height: 58px;
    border-radius: 20px;
    background: var(--sage-light);
    color: var(--sage-dark);
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 900;
    font-size: 20px;
    margin-bottom: 18px;
}

.story-card h3 {
    margin: 0 0 12px 0;
    font-size: 1.15rem;
}

.story-card p {
    margin: 0;
    color: #64748b;
    line-height: 1.75;
    font-size: 14px;
    font-style: italic;
    flex: 1;
}

.empty-story-box {
    min-height: 260px;
    border: 2px dashed #dbe5ef;
    background: #f8fafc;
    border-radius: 28px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #94a3b8;
    text-align: center;
    padding: 34px;
    grid-column: 1 / -1;
}

.empty-story-box i {
    font-size: 42px;
    color: var(--sage-main);
    margin-bottom: 14px;
}

.tableau-panel {
    background:
        radial-gradient(circle at top right, rgba(122,155,118,0.10), transparent 28%),
        white;
    border: 1px solid #eef2f7;
    border-radius: 34px;
    padding: 42px;
    box-shadow: 0 22px 70px rgba(15,23,42,0.055);
}

.tableau-header {
    text-align: center;
    max-width: 760px;
    margin: 0 auto 34px;
}

.tableau-header h2 {
    font-size: clamp(2rem, 4vw, 3rem);
    margin: 0 0 12px 0;
}

.tableau-header p {
    color: #64748b;
    font-size: 15px;
    line-height: 1.75;
    margin: 0;
}

.tableau-box {
    width: 100%;
    min-height: 520px;
    background:
        linear-gradient(135deg, #f8fafc 0%, #ffffff 100%);
    border: 2px dashed #cbd5e1;
    border-radius: 28px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #94a3b8;
    text-align: center;
    padding: 30px;
}

.tableau-box i {
    font-size: 46px;
    color: var(--sage-main);
    margin-bottom: 14px;
}

.tableau-box h3 {
    margin: 0 0 8px 0;
    color: #1e293b;
    font-size: 1.25rem;
}

.tableau-box p {
    margin: 0;
    font-size: 14px;
    line-height: 1.7;
}

@media (max-width: 900px) {
    .data-page {
        padding: 58px 20px 80px;
    }

    .data-summary-grid,
    .story-grid {
        grid-template-columns: 1fr;
    }

    .story-panel,
    .tableau-panel {
        padding: 26px;
    }

    .story-panel-header {
        flex-direction: column;
        align-items: flex-start;
    }

    .tableau-box {
        min-height: 360px;
    }
}

.education-page {
    max-width: 1200px;
    margin: 0 auto;
    padding: 76px 20px 110px;
}

.education-hero {
    text-align: center;
    max-width: 760px;
    margin: 0 auto 62px;
}

.education-hero h1 {
    font-size: clamp(2.7rem, 5vw, 4rem);
    margin: 0 0 16px 0;
    letter-spacing: -1px;
}

.education-hero p {
    color: #64748b;
    font-size: 16px;
    line-height: 1.8;
    margin: 0;
}

.education-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 24px;
    margin-bottom: 90px;
}

.education-card {
    background: white;
    border: 1px solid #eef2f7;
    border-radius: 28px;
    padding: 30px;
    min-height: 260px;
    box-shadow: 0 18px 45px rgba(15,23,42,0.045);
    transition: 0.3s ease;
    position: relative;
    overflow: hidden;
}

.education-card::before {
    content: '';
    position: absolute;
    width: 120px;
    height: 120px;
    border-radius: 999px;
    background: rgba(122,155,118,0.10);
    right: -44px;
    top: -44px;
}

.education-card:hover {
    transform: translateY(-6px);
    box-shadow: 0 28px 70px rgba(15,23,42,0.08);
}

.education-icon {
    width: 58px;
    height: 58px;
    border-radius: 20px;
    background: #f1f8ef;
    color: var(--sage-dark);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 22px;
    margin-bottom: 22px;
    position: relative;
    z-index: 1;
}

.education-card h3 {
    font-size: 1.23rem;
    margin: 0 0 14px 0;
    color: #1e293b;
    position: relative;
    z-index: 1;
}

.education-card p {
    margin: 0;
    color: #64748b;
    line-height: 1.75;
    font-size: 14px;
    position: relative;
    z-index: 1;
}

.help-section {
    border-top: 1px solid #e2e8f0;
    padding-top: 82px;
}

.help-header {
    text-align: center;
    max-width: 780px;
    margin: 0 auto 52px;
}

.help-header h2 {
    font-size: clamp(2.2rem, 4vw, 3.2rem);
    margin: 0 0 14px 0;
}

.help-header p {
    color: #64748b;
    line-height: 1.75;
    font-size: 15px;
    margin: 0;
}

.help-list {
    display: grid;
    gap: 18px;
}

.help-card {
    background: white;
    border: 1px solid #eef2f7;
    border-radius: 28px;
    padding: 26px;
    display: grid;
    grid-template-columns: 92px 1fr auto;
    align-items: center;
    gap: 24px;
    box-shadow: 0 16px 42px rgba(15,23,42,0.04);
    transition: 0.3s ease;
}

.help-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 26px 64px rgba(15,23,42,0.075);
}

.help-number {
    width: 72px;
    height: 72px;
    border-radius: 24px;
    background: #f1f8ef;
    color: var(--sage-dark);
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'Playfair Display', serif;
    font-size: 1.6rem;
    font-weight: 800;
}

.help-card h3 {
    margin: 0 0 7px 0;
    color: #1e293b;
    font-size: 1.2rem;
}

.help-card p {
    color: #64748b;
    margin: 0;
    font-size: 14px;
    line-height: 1.65;
}

.help-button {
    background: var(--sage-main);
    color: white;
    text-decoration: none;
    padding: 13px 25px;
    border-radius: 999px;
    font-weight: 800;
    font-size: 14px;
    white-space: nowrap;
    transition: 0.3s ease;
    display: inline-flex;
    align-items: center;
    gap: 8px;
}

.help-button:hover {
    background: var(--sage-dark);
    transform: translateY(-2px);
}

@media (max-width: 900px) {
    .education-page {
        padding: 58px 20px 88px;
    }

    .education-grid {
        grid-template-columns: 1fr;
        margin-bottom: 70px;
    }

    .help-card {
        grid-template-columns: 1fr;
        text-align: center;
    }

    .help-number {
        margin: 0 auto;
    }

    .help-button {
        justify-content: center;
    }
}

                @media (max-width: 900px) {
                    .nav-container {
                        height: 70px;
                        padding: 0 20px;
                    }

                    .nav-inner {
                        display: flex;
                        justify-content: space-between;
                        max-width: 100%;
                    }

                    .desktop-menu {
                        display: none !important;
                    }

                    .mobile-toggle {
                        display: flex;
                        align-items: center;
                        cursor: pointer;
                        color: #1e293b;
                    }

                    .mobile-dropdown.open {
                        display: flex !important;
                        flex-direction: column;
                        position: absolute;
                        top: 70px;
                        left: 0;
                        width: 100%;
                        background: white;
                        box-shadow: 0 10px 20px rgba(0,0,0,0.05);
                        padding: 20px;
                        gap: 15px;
                        z-index: 1001;
                        align-items: center;
                        border-top: 1px solid #f1f5f9;
                    }

                    .hero-grid {
                        grid-template-columns: 1fr !important;
                        text-align: center;
                    }

                    .hero-grid > div {
                        order: 2;
                    }

                    .hero-grid > div:first-child {
                        order: 1;
                    }

                    .btn-group {
                        justify-content: center;
                    }

                    .hero-section,
                    .trust-section {
                        grid-template-columns: 1fr !important;
                        text-align: center;
                        gap: 42px;
                        padding-left: 20px;
                        padding-right: 20px;
                    }

                    .hero-copy {
                        order: 1;
                    }

                    .hero-image-wrap {
                        order: 2;
                        height: 430px;
                    }

                    .hero-floating-card {
                        left: 50%;
                        transform: translateX(-50%);
                        bottom: 24px;
                    }

                    .hero-actions {
                        justify-content: center;
                    }

                    .hero-stat-row,
                    .service-grid {
                        grid-template-columns: 1fr;
                    }

                    .trust-list-item {
                        justify-content: center;
                        text-align: left;
                    }

                    .expert-card {
                        padding: 26px;
                    }

                    .expert-item {
                        flex-direction: column;
                        align-items: center;
                        text-align: center;
                    }

                    .article-card {
                        min-width: 310px;
                        max-width: 310px;
                    }
                }
                .edu-container { max-width: 900px; margin: 0 auto; padding: 40px 20px; }
    
    /* Card Teori Olweus */
    .theory-card { 
        background: white; 
        border-radius: 24px; 
        padding: 40px; 
        border: 1px solid #f1f5f9; 
        box-shadow: 0 10px 25px rgba(0,0,0,0.03);
    }
    
    .olweus-highlight { 
        line-height: 1.8; 
        color: #475569; 
        background: #f8fafc; 
        padding: 25px; 
        border-radius: 16px; 
        border-left: 5px solid var(--sage-main); 
        margin: 20px 0;
    }

    /* Penjelasan Mendasar */
    .edu-section { 
        margin-top: 50px; 
        padding: 40px; 
        background: #ffffff; 
        border-radius: 24px; 
        border: 1px solid #f1f5f9; 
    }

    .grid-info { 
        display: grid; 
        grid-template-columns: 1fr 1fr; 
        gap: 30px; 
        margin-top: 30px; 
    }

    .info-box { 
        padding: 25px; 
        background: #fdfdfd; 
        border: 1px solid #e2e8f0; 
        border-radius: 20px; 
        transition: 0.3s;
    }

    .info-box:hover { border-color: var(--sage-main); transform: translateY(-5px); }
    
    @media (max-width: 768px) {
        .grid-info { grid-template-columns: 1fr; }
    }
            `}</style>

            {/* ========================================= */}
            {/* NAVBAR TETAP */}
            {/* ========================================= */}
            <nav
                className="nav-container"
                style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.96)',
                    backdropFilter: 'blur(12px)',
                    position: 'sticky',
                    top: 0,
                    zIndex: 1000,
                    width: '100%'
                }}
            >
                <div className="nav-inner">
                <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', gap: '12px' }}>
                        <img 
                            src="/logo-ruangpulih.png" 
                            alt="Logo RuangPulih" 
                            onClick={() => handleTabChange('beranda')}
                            style={{
                                height: '75px', // Ukuran disesuaikan agar sejajar dengan tinggi teks
                                width: 'auto',
                                objectFit: 'contain',
                                cursor: 'pointer'
                            }} 
                        />

                        {/* --- TEKS BAWAAN ASLI --- */}
                        <div
                            className="serif-title"
                            onClick={() => handleTabChange('beranda')}
                            style={{
                                fontSize: '26px',
                                fontWeight: '800',
                                letterSpacing: '0.5px',
                                color: '#1e293b',
                                cursor: 'pointer',
                                whiteSpace: 'nowrap'
                            }}
                        >
                            Ruang<span style={{ color: 'var(--sage-main)' }}>Pulih.</span>
                        </div>
                    </div>

                    <div
                        className="desktop-menu"
                        style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            gap: '38px'
                        }}
                    >
                        <span
                            onClick={() => handleTabChange('beranda')}
                            className={`nav-link ${activeTab === 'beranda' ? 'active' : ''}`}
                        >
                            Tentang Kami
                        </span>

                        <span
                            onClick={() => handleTabChange('data')}
                            className={`nav-link ${activeTab === 'data' ? 'active' : ''}`}
                        >
                            Data & Cerita
                        </span>

                        <span
                            onClick={() => handleTabChange('edukasi')}
                            className={`nav-link ${activeTab === 'edukasi' ? 'active' : ''}`}
                        >
                            Edukasi & Bantuan
                        </span>
                    </div>

                    <div
                        className="desktop-menu"
                        style={{
                            display: 'flex',
                            justifyContent: 'flex-end',
                            alignItems: 'center',
                            gap: '14px'
                        }}
                    >
                        <button
                            onClick={() => navigate('/tamu')}
                            style={{
                                background: 'transparent',
                                border: 'none',
                                fontWeight: '600',
                                cursor: 'pointer',
                                color: '#64748b',
                                fontSize: '14px',
                                whiteSpace: 'nowrap',
                                padding: '10px 8px'
                            }}
                            onMouseOver={e => e.target.style.color = 'var(--sage-main)'}
                            onMouseOut={e => e.target.style.color = '#64748b'}
                        >
                            Akses Tamu
                        </button>

                        <button
                            onClick={() => navigate('/login')}
                            className="btn-primary"
                            style={{
                                padding: '11px 30px',
                                fontSize: '14px',
                                minWidth: '160px'
                            }}
                        >
                            Masuk Portal
                        </button>
                    </div>

                    <div className="mobile-toggle" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                        <i
                            className={`fa-solid ${isMenuOpen ? 'fa-xmark' : 'fa-bars'}`}
                            style={{ fontSize: '26px', color: '#1e293b' }}
                        ></i>
                    </div>

                    <div className={`mobile-dropdown ${isMenuOpen ? 'open' : ''}`}>
                        <span
                            onClick={() => handleTabChange('beranda')}
                            className={`nav-link ${activeTab === 'beranda' ? 'active' : ''}`}
                        >
                            Tentang Kami
                        </span>

                        <span
                            onClick={() => handleTabChange('data')}
                            className={`nav-link ${activeTab === 'data' ? 'active' : ''}`}
                        >
                            Data & Cerita
                        </span>

                        <span
                            onClick={() => handleTabChange('edukasi')}
                            className={`nav-link ${activeTab === 'edukasi' ? 'active' : ''}`}
                        >
                            Edukasi & Bantuan
                        </span>

                        <hr
                            style={{
                                width: '100%',
                                border: 'none',
                                borderTop: '1px solid #f1f5f9',
                                margin: '10px 0'
                            }}
                        />

                        <button
                            onClick={() => navigate('/tamu')}
                            style={{
                                background: 'none',
                                border: 'none',
                                fontWeight: '600',
                                cursor: 'pointer',
                                color: '#64748b',
                                padding: '10px'
                            }}
                        >
                            Akses Tamu
                        </button>

                        <button
                            onClick={() => navigate('/login')}
                            className="btn-primary"
                            style={{ width: '100%' }}
                        >
                            Masuk Portal
                        </button>
                    </div>
                </div>
            </nav>

            <div style={{ flex: 1 }}>
                {activeTab === 'beranda' && (
                    <div className="fade-in-section home-section">
                        <section className="hero-section hero-grid">
                            <AnimatedContent distance={-30} direction="horizontal" duration={0.8}>
                                <div className="hero-copy">
                                    <span className="sub-heading">- Sistem Pakar Kesehatan Mental -</span>

                                    <h1 className="serif-title hero-title">
                                        Pulihkan. <br />
                                        Bangkit. <br />
                                        <span style={{ color: 'var(--sage-main)', fontStyle: 'italic' }}>
                                            Kendalikan.
                                        </span>
                                    </h1>

                                    <p className="hero-text">
                                        Kami membantu individu memulihkan ketenangan emosional dan mendapatkan kembali
                                        keseimbangan hidup akibat trauma perundungan melalui metode evaluasi pakar yang akurat.
                                    </p>

                                    <div className="hero-actions btn-group">
                                        <button onClick={() => navigate('/register')} className="btn-primary">
                                            Jadwalkan Sesi Anda
                                        </button>

                                        <button onClick={() => handleTabChange('edukasi')} className="btn-secondary">
                                            Pelajari Lebih Lanjut
                                        </button>
                                    </div>
                                </div>
                            </AnimatedContent>

                            <AnimatedContent distance={30} direction="horizontal" duration={0.8} delay={0.2}>
                                <div className="hero-image-wrap">
                                    <div className="hero-image-card">
                                        <img
                                            src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=800&q=80"
                                            alt="Sesi Konsultasi"
                                            className="arch-image"
                                        />
                                    </div>

                                    <div className="hero-floating-card">
                                        <strong>Ruang aman untuk mulai pulih.</strong>
                                        <span>Evaluasi, panduan, dan komunitas anonim dalam satu tempat.</span>
                                    </div>
                                </div>
                            </AnimatedContent>
                        </section>

                        <div className="hero-stat-row">
                            <AnimatedContent distance={25} delay={0.05}>
                                <div className="hero-stat-card">
                                    <h3>{totalTests || '24+'}</h3>
                                    <p>Evaluasi membantu pengguna memahami kondisi awal mereka.</p>
                                </div>
                            </AnimatedContent>

                            <AnimatedContent distance={25} delay={0.15}>
                                <div className="hero-stat-card">
                                    <h3>3</h3>
                                    <p>Fitur utama: evaluasi, self-care, dan ruang curhat anonim.</p>
                                </div>
                            </AnimatedContent>

                            <AnimatedContent distance={25} delay={0.25}>
                                <div className="hero-stat-card">
                                    <h3>Anonim</h3>
                                    <p>Bagikan cerita tanpa takut identitas pribadi terungkap.</p>
                                </div>
                            </AnimatedContent>
                        </div>

                        <section className="services-section">
                            <div className="section-shell">
                                <AnimatedContent distance={30} duration={0.6}>
                                    <div className="section-heading">
                                        <span className="sub-heading">- Layanan Kami -</span>
                                        <h2 className="serif-title">Apa Yang Kami Tawarkan.</h2>
                                        <p>
                                            Temukan layanan yang dirancang untuk membantu Anda memahami kondisi emosional,
                                            memulai pemulihan, dan merasa tidak sendirian.
                                        </p>
                                    </div>
                                </AnimatedContent>

                                <div className="service-grid">
                                    {services.map((service, idx) => (
                                        <AnimatedContent key={idx} distance={40} delay={idx * 0.16}>
                                            <div className="service-card">
                                                <div className="service-img-wrap">
                                                    <img src={service.img} alt={service.title} />
                                                </div>

                                                <div className="service-body">
                                                    <div className="service-pill">
                                                        <i className={`fa-solid ${service.icon}`}></i>
                                                        {service.tag}
                                                    </div>

                                                    <h3 className="serif-title">{service.title}</h3>
                                                    <p>{service.desc}</p>

                                                    <div className="service-link">
                                                        Pelajari layanan <i className="fa-solid fa-arrow-right" style={{ marginLeft: '6px' }}></i>
                                                    </div>
                                                </div>
                                            </div>
                                        </AnimatedContent>
                                    ))}
                                </div>
                            </div>
                        </section>

                        <section className="trust-section hero-grid">
                            <AnimatedContent distance={30} direction="horizontal" duration={0.8}>
                                <div>
                                    <span className="sub-heading">- Validasi Klinis -</span>

                                    <h2 className="serif-title trust-title">
                                        Anda Bisa Mempercayai Kami.
                                    </h2>

                                    <p className="trust-text">
                                        Terkadang seseorang berada dalam situasi yang terasa tanpa jalan keluar.
                                        RuangPulih hadir untuk memberi langkah awal yang lebih terarah melalui bantuan teknologi pakar.
                                    </p>

                                    <p className="trust-text">
                                        Keakuratan sistem tidak lepas dari peran ahli dalam merancang basis aturan,
                                        parameter, dan rekomendasi awal yang aman untuk pengguna.
                                    </p>

                                    <div className="trust-list">
                                        <div className="trust-list-item">
                                            <i className="fa-solid fa-circle-check"></i>
                                            <span>Evaluasi awal membantu mengenali tingkat risiko dan kondisi emosional pengguna.</span>
                                        </div>

                                        <div className="trust-list-item">
                                            <i className="fa-solid fa-circle-check"></i>
                                            <span>Rekomendasi self-care disesuaikan dengan hasil evaluasi yang diberikan.</span>
                                        </div>

                                        <div className="trust-list-item">
                                            <i className="fa-solid fa-circle-check"></i>
                                            <span>Ruang komunitas dibangun dengan konsep anonim dan aman.</span>
                                        </div>
                                    </div>
                                </div>
                            </AnimatedContent>

                            <AnimatedContent distance={-30} direction="horizontal" duration={0.8} delay={0.2}>
                                <div className="expert-card">
                                    <h3 className="serif-title">Tim Ahli Kami</h3>

                                   <div className="expert-item" style={{ alignItems: 'center' }}>
                                    {/* BUNGKUS DENGAN WADAH DIV SUPAYA EFEK ZOOM NYA RAPI DAN TIDAK KELUAR LINGKARAN */}
                                    <div style={{
                                        width: '110px',           // Ukuran lingkaran diperbesar
                                        height: '110px',          // Ukuran lingkaran diperbesar
                                        borderRadius: '50%',
                                        overflow: 'hidden',       // Memotong sisa gambar yang keluar saat di-zoom
                                        border: '4px solid white',
                                        boxShadow: '0 12px 30px rgba(15,23,42,0.08)',
                                        flexShrink: 0,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}>
                                        <img
                                            src="/psikolog-hesty.jpeg" 
                                            alt="Hesty Yuliasari, S.Psi., M.Psi., Psikolog"
                                            style={{
                                                width: '100%',
                                                height: '100%',
                                                objectFit: 'cover',
                                                objectPosition: 'center 20%', // Menyesuaikan fokus ke arah atas (wajah)
                                                transform: 'scale(1.4)',      // PAKSA ZOOM 1.4 KALI AGAR WAJAH TERLIHAT JELAS
                                                transition: 'transform 0.3s ease'
                                            }}
                                        />
                                    </div>

                                        <div>
                                            <h4 className="serif-title">Hesty Yuliasari S.Psi., M.Psi., Psikolog</h4>
                                            <p>
                                                Psikolog Klinis Utama. Beliau memvalidasi parameter yang di gunakan untuk menentukan
                                                gejala serta tingkat keparahan dampak dari bullying
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </AnimatedContent>
                        </section>
                        {/* ======================================================= */}
{/* SECTION BARU: KATA PENYEMANGAT & KISAH BANGKIT TOKOH */}
{/* ======================================================= */}
<section className="inspiration-section" style={{ padding: '80px 20px', background: '#fcfdfc' }}>
    <div className="section-shell" style={{ maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* KARTU KATA PENYEMANGAT (DINAAMIS DENGAN ANIMASI LEMBUT) */}
        <AnimatedContent distance={30}>
            <div style={{
                background: 'linear-gradient(135deg, #f0f7f0 0%, #e4efe4 100%)',
                padding: '40px',
                borderRadius: '24px',
                textAlign: 'center',
                maxWidth: '850px',
                margin: '0 auto 70px auto',
                boxShadow: '0 10px 30px rgba(122, 155, 118, 0.08)',
                border: '1px solid rgba(122, 155, 118, 0.15)'
            }}>
                <div style={{ fontSize: '36px', marginBottom: '15px', color: '#7a9b76' }}>“</div>
                <p style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: '20px',
                    fontStyle: 'italic',
                    color: '#2c3e2b',
                    lineHeight: '1.8',
                    margin: '0 0 15px 0',
                    transition: 'all 0.5s ease-in-out'
                }}>
                    {motivationalQuotes[currentQuoteIdx].text}
                </p>
                <span style={{ fontSize: '13px', fontWeight: '700', letterSpacing: '1px', textTransform: 'uppercase', color: '#7a9b76' }}>
                    — {motivationalQuotes[currentQuoteIdx].author}
                </span>
            </div>
        </AnimatedContent>

                            {/* HEADER KISAH TOKOH */}
                            <AnimatedContent distance={30} delay={0.1}>
                                <div className="section-heading" style={{ textAlign: 'center', marginBottom: '50px' }}>
                                    <span className="sub-heading" style={{ color: '#7a9b76', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '2px', display: 'block', marginBottom: '10px' }}>
                                        - Bukti Nyata Bangkit -
                                    </span>
                                    <h2 className="serif-title" style={{ fontSize: '32px', color: '#1e293b' }}>Mereka yang Berhasil Menembus Batas.</h2>
                                    <p style={{ color: '#64748b', fontSize: '15px', maxWidth: '600px', margin: '10px auto 0 auto' }}>
                                        Perundungan yang mereka alami di masa lalu tidak menghentikan mereka untuk bersinar. Simak kisah tokoh dunia yang berhasil memulihkan diri dan mengendalikan hidupnya kembali.
                                    </p>
                                </div>
                            </AnimatedContent>

                            {/* GRID KISAH TOKOH */}
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '30px' }}>
                                
                                {/* Tokoh 1: Lady Gaga */}
                                <AnimatedContent distance={40} delay={0.2}>
                                    <div style={{ background: '#ffffff', padding: '30px', borderRadius: '24px', border: '1px solid #e2e8f0', boxShadow: '0 4px 20px rgba(0,0,0,0.02)', height: '100%', display: 'flex', flexDirection: 'column' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px' }}>
                                            <img 
                                                src="https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80" 
                                                alt="Lady Gaga Profile" 
                                                style={{ width: '60px', height: '60px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #7a9b76' }}
                                            />
                                            <div>
                                                <h4 className="serif-title" style={{ margin: 0, fontSize: '18px', color: '#1e293b' }}>Lady Gaga</h4>
                                                <span style={{ fontSize: '12px', color: '#64748b' }}>Musisi & Aktivis Mental Health</span>
                                            </div>
                                        </div>
                                        <p style={{ fontSize: '14px', color: '#475569', lineHeight: '1.7', margin: 0, fontStyle: 'italic' }}>
                                            "Semasa sekolah, saya sering di-bully, bahkan pernah dilempar ke tempat sampah oleh teman-teman. Rasa sakit itu membuat saya depresi, tetapi musik menjadi pelarian terbaik saya. Kini saya mendedikasikan hidup saya melalui Born This Way Foundation untuk membantu pemulihan kesehatan mental anak-anak muda di seluruh dunia."
                                        </p>
                                    </div>
                                </AnimatedContent>

                                {/* Tokoh 2: Elon Musk */}
                                <AnimatedContent distance={40} delay={0.3}>
                                    <div style={{ background: '#ffffff', padding: '30px', borderRadius: '24px', border: '1px solid #e2e8f0', boxShadow: '0 4px 20px rgba(0,0,0,0.02)', height: '100%', display: 'flex', flexDirection: 'column' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px' }}>
                                            <img 
                                                src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=150&q=80" 
                                                alt="Elon Musk Profile" 
                                                style={{ width: '60px', height: '60px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #3b82f6' }}
                                            />
                                            <div>
                                                <h4 className="serif-title" style={{ margin: 0, fontSize: '18px', color: '#1e293b' }}>Elon Musk</h4>
                                                <span style={{ fontSize: '12px', color: '#64748b' }}>Inovator & Pemimpin Teknologi</span>
                                            </div>
                                        </div>
                                        <p style={{ fontSize: '14px', color: '#475569', lineHeight: '1.7', margin: 0, fontStyle: 'italic' }}>
                                            "Saya tumbuh sebagai anak yang kutubuku dan sangat penyendiri. Kelompok geng di sekolah terus mengejar dan merundung saya bertahun-tahun, bahkan saya pernah dipukul hingga pingsan dan harus dirawat di rumah sakit. Saya belajar bangkit dengan memfokuskan energi saya sepenuhnya pada komputer dan sains untuk merubah peradaban masa depan."
                                        </p>
                                    </div>
                                </AnimatedContent>

                                {/* Tokoh 3: Taylor Swift */}
                                <AnimatedContent distance={40} delay={0.4}>
                                    <div style={{ background: '#ffffff', padding: '30px', borderRadius: '24px', border: '1px solid #e2e8f0', boxShadow: '0 4px 20px rgba(0,0,0,0.02)', height: '100%', display: 'flex', flexDirection: 'column' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px' }}>
                                            <img 
                                                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80" 
                                                alt="Taylor Swift Profile" 
                                                style={{ width: '60px', height: '60px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #ec4899' }}
                                            />
                                            <div>
                                                <h4 className="serif-title" style={{ margin: 0, fontSize: '18px', color: '#1e293b' }}>Taylor Swift</h4>
                                                <span style={{ fontSize: '12px', color: '#64748b' }}>Ikon Musik Global</span>
                                            </div>
                                        </div>
                                        <p style={{ fontSize: '14px', color: '#475569', lineHeight: '1.7', margin: 0, fontStyle: 'italic' }}>
                                            "Saat remaja, saya dianggap aneh karena menyukai musik country. Teman-teman sekelas sering sengaja mengisolasi saya dan pindah meja saat saya ingin ikut makan siang bersama mereka. Alih-alih terpuruk, rasa sepi itu saya tuangkan ke dalam lembaran lirik lagu di kamar. Perundungan mengajari saya cara bercerita yang menyentuh hati jutaan orang."
                                        </p>
                                    </div>
                                </AnimatedContent>

                            </div>
                        </div>
                    </section>

                        <section className="article-section" style={{ padding: '60px 0', backgroundColor: '#fcfdfc' }}>
                            
                            {/* --- BAGIAN HEADER (SEPADAN DENGAN LEBAR KARTU) --- */}
                            <div className="article-top" style={{ 
                                display: 'flex', 
                                justifyContent: 'space-between', 
                                alignItems: 'flex-end',
                                marginBottom: '35px',
                                padding: '0 10px',
                                maxWidth: '750px', // Disamakan dengan lebar maksimal kartu agar sejajar rapi
                                margin: '0 auto' 
                            }}>
                                <AnimatedContent distance={30}>
                                    <div style={{ maxWidth: '550px' }}>
                                        <span className="sub-heading" style={{ 
                                            color: '#7a9b76', 
                                            fontWeight: '700',
                                            fontSize: '13px',
                                            letterSpacing: '1.5px',
                                            textTransform: 'uppercase',
                                            display: 'block',
                                            marginBottom: '8px'
                                        }}>
                                            - Wawasan & Panduan -
                                        </span>

                                        <h2 className="serif-title" style={{ 
                                            fontSize: '32px', 
                                            color: '#1e293b',
                                            marginBottom: '10px'
                                        }}>
                                            Artikel Kesehatan Mental.
                                        </h2>

                                        <p style={{ color: '#64748b', fontSize: '15px', lineHeight: '1.6' }}>
                                            Bacaan pilihan untuk memahami kesehatan mental, trauma, dan pemulihan diri.
                                        </p>
                                    </div>
                                </AnimatedContent>

                                <div className="article-hint" style={{ 
                                    padding: '10px 20px', 
                                    backgroundColor: '#ffffff', 
                                    borderRadius: '30px',
                                    color: '#7a9b76',
                                    fontSize: '13px',
                                    fontWeight: '600',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    boxShadow: '0 4px 12px rgba(122, 155, 118, 0.12)', 
                                    border: '1px solid #e2e8f0'
                                }}>
                                    <i className="fa-solid fa-arrows-left-right"></i> Geser
                                </div>
                            </div>

                            {/* --- BAGIAN KARTU KAROSEL (UKURAN PAS & ANTI-KOTAK HITAM) --- */}
                            <AnimatedContent distance={40} delay={0.2}>
                                <div style={{ 
                                    width: '100%', 
                                    maxWidth: '750px', // Mengunci lebar agar pas dengan ukuran 1 kartu besar Anda
                                    margin: '0 auto',
                                    padding: '0 10px'
                                }}>
                                    
                                    {/* WADAH UTAMA DENGAN SHADOW LEMBUT PREMIUM */}
                                    <div className="beautiful-carousel-container" style={{
                                        backgroundColor: '#ffffff',
                                        borderRadius: '20px',
                                        padding: '0px',
                                        boxShadow: '0 15px 35px rgba(0, 0, 0, 0.05)', // Efek shadow melayang yang halus
                                        border: '1px solid rgba(226, 232, 240, 0.8)',
                                        overflow: 'hidden'
                                    }}>
                                        
                                        {/* CSS PENGHANCUR WARNA HITAM BAWAAN UTK SEMUA ELEMEN DI DALAM KAROSEL */}
                                        <style>
                                            {`
                                                .beautiful-carousel-container,
                                                .beautiful-carousel-container div,
                                                .beautiful-carousel-container ul,
                                                .beautiful-carousel-container li {
                                                    border-color: transparent !important; 
                                                    background: transparent !important; /* Menghapus background hitam internal */
                                                    background-color: transparent !important;
                                                    outline: none !important;
                                                    box-shadow: none !important;
                                                }
                                            `}
                                        </style>

                                        <Carousel 
                                            items={articles}  
                                            baseWidth={730}    // Ukuran disesuaikan agar memenuhi kontainer 750px dengan presisi
                                            autoplay={true} 
                                            pauseOnHover={true} 
                                            loop={true} 
                                        />
                                    </div>

                                </div>
                            </AnimatedContent>
                        </section>
                    </div>
                )}

{activeTab === 'data' && (
    <div className="fade-in-section data-page">
        <AnimatedContent distance={30}>
            <div className="data-hero">
                <span className="sub-heading">- Data & Cerita -</span>

                <h1 className="serif-title">
                    Cerita Pemulihan dan Data Transparan.
                </h1>

                <p>
                    Lihat bagaimana ruang aman RuangPulih membantu pengguna memahami kondisi emosional,
                    berbagi cerita, dan memulai langkah kecil menuju pemulihan.
                </p>
            </div>
        </AnimatedContent>

        <div className="data-summary-grid">
            <AnimatedContent distance={25} delay={0.05}>
                <div className="data-summary-card">
                    <div className="data-summary-icon" style={{ background: '#e9f5db', color: 'var(--sage-dark)' }}>
                        <i className="fa-solid fa-clipboard-check"></i>
                    </div>

                    <div>
                        <div className="data-summary-label">Total Evaluasi</div>
                        <div className="data-summary-value">{totalTests || 0}</div>
                    </div>
                </div>
            </AnimatedContent>

            <AnimatedContent distance={25} delay={0.15}>
                <div className="data-summary-card">
                    <div className="data-summary-icon" style={{ background: '#e0e7ff', color: '#4f46e5' }}>
                        <i className="fa-solid fa-comments"></i>
                    </div>

                    <div>
                        <div className="data-summary-label">Cerita Komunitas</div>
                        <div className="data-summary-value">{confessions.length}</div>
                    </div>
                </div>
            </AnimatedContent>

            <AnimatedContent distance={25} delay={0.25}>
                <div className="data-summary-card">
                    <div className="data-summary-icon" style={{ background: '#fce7f3', color: '#e11d48' }}>
                        <i className="fa-solid fa-heart"></i>
                    </div>

                    <div>
                        <div className="data-summary-label">Ruang Aman</div>
                        <div className="data-summary-value">Aktif</div>
                    </div>
                </div>
            </AnimatedContent>
        </div>

        <AnimatedContent distance={35} delay={0.2}>
            <section className="story-panel">
                <div className="story-panel-header">
                    <div>
                        <span className="sub-heading">- Suara Komunitas -</span>

                        <h2 className="serif-title">
                            Apa Kata Mereka
                        </h2>

                        <p>
                            Setiap cerita adalah bagian dari perjalanan. Ruang ini dibuat agar pengguna
                            dapat merasa didengar tanpa takut identitasnya terbuka.
                        </p>
                    </div>

                    <div className="story-badge">
                        <i className="fa-solid fa-user-secret"></i> Anonim & Aman
                    </div>
                </div>

                <div className="story-grid">
                    {confessions.length > 0 ? (
                        confessions.map((c, i) => (
                            <AnimatedContent key={c.id} distance={35} delay={i * 0.12}>
                                <div className="story-card">
                                    <div className="story-avatar">
                                        {c.author_alias ? c.author_alias.charAt(0).toUpperCase() : 'A'}
                                    </div>

                                    <h3 className="serif-title">
                                        {c.author_alias || 'Anonim'}
                                    </h3>

                                    <p>
                                        “{c.story.length > 170 ? c.story.substring(0, 170) + '...' : c.story}”
                                    </p>
                                </div>
                            </AnimatedContent>
                        ))
                    ) : (
                        <div className="empty-story-box">
                            <div>
                                <i className="fa-solid fa-seedling"></i>
                                <h3 className="serif-title" style={{ margin: '0 0 8px 0', color: '#1e293b' }}>
                                    Belum Ada Cerita
                                </h3>
                                <p style={{ margin: 0 }}>
                                    Cerita komunitas akan muncul di sini setelah pengguna membagikannya.
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </section>
        </AnimatedContent>

        <AnimatedContent distance={35} delay={0.35}>
            <section className="tableau-panel">
                <div className="tableau-header">
                    <span className="sub-heading">- Data Transparan -</span>

                    <h2 className="serif-title">
                        Dashboard Statistik Tableau
                    </h2>

                    <p>
                        Area ini dapat digunakan untuk menampilkan visualisasi statistik kesehatan mental,
                        hasil evaluasi, atau ringkasan data pengguna secara global.
                    </p>
                </div>

                <div className="tableau-box" style={{ padding: 0, overflow: 'hidden', border: '1px solid #e2e8f0' }}>
                    <iframe 
                        /* Tambahkan &:toolbar=no agar lebih bersih */
                        src="https://public.tableau.com/views/tabelbullying/Dashboard1?:language=en-US&:sid=&:redirect=auth&:display_count=n&:origin=viz_share_link:embed=yes&:showVizHome=no&:toolbar=no" 
                        title="Tableau Mental Health Dashboard"
                        style={{ 
                            width: '100%', 
                            height: '800px', /* <-- UBAH ANGKA INI MENJADI LEBIH BESAR */
                            border: 'none',
                            display: 'block'
                        }}
                        frameBorder="0"
                        allowFullScreen
                    />
                </div>
            </section>
        </AnimatedContent>
    </div>
)}

{activeTab === 'edukasi' && (
    <div className="fade-in-section education-page">
        {/* --- HERO SECTION EDUKASI --- */}
        <AnimatedContent distance={30}>
            <div className="education-hero">
                <span className="sub-heading">- Edukasi & Bantuan -</span>
                <h1 className="serif-title">
                    Pahami Dampak dan Mulai Langkah Aman.
                </h1>
                <p>
                    Edukasi ini membantu Anda mengenali dampak perundungan, memahami reaksi emosional,
                    dan mengetahui langkah awal yang dapat dilakukan dengan aman.
                </p>
            </div>
        </AnimatedContent>

        {/* --- MAIN CONTENT WRAPPER --- */}
        <section 
            className="education-theory-section" 
            style={{ padding: '40px 20px', maxWidth: '900px', margin: '0 auto' }}
        >
            <div 
                style={{ 
                    padding: '60px 20px', 
                    maxWidth: '1000px', 
                    margin: '0 auto', 
                    fontFamily: "'Inter', sans-serif" 
                }}
            >


            {/* TEORI OLWEUS SECTION */}
            <section style={{ marginBottom: '80px' }}>
                    
                    {/* Bagian: Dasar Teori */}
                    <AnimatedContent distance={20}>
                        <h2 style={{ fontSize: '2rem', color: '#1e293b', marginBottom: '25px' }}>
                            Dasar Teori: Pendekatan Dan Olweus
                        </h2>
                        <p 
                            style={{ 
                                lineHeight: '1.8', 
                                color: '#475569', 
                                backgroundColor: '#f8fafc', 
                                padding: '25px', 
                                borderRadius: '20px', 
                                borderLeft: '5px solid var(--sage-main)' 
                            }}
                        >
                            Menurut <b>Dan Olweus</b>, Bapak penelitian bullying dunia, bullying adalah 
                            tindakan agresif yang dilakukan secara sengaja dan berulang-ulang, di mana 
                            terdapat ketidakseimbangan kekuatan (power imbalance) antara pelaku dan korban. 
                            Ini bukan sekadar perilaku "iseng", melainkan bentuk penindasan yang sistematis.
                        </p>
                    </AnimatedContent>

                <AnimatedContent distance={30}>
                        <h2 style={{ fontSize: '1.8rem', color: '#1e293b', marginBottom: '20px', marginTop: '40px' }}>
                            Apa Itu Bullying Sebenarnya?
                        </h2>
                        <p style={{ lineHeight: '1.8', color: '#475569', marginBottom: '25px' }}>
                            Banyak yang menganggap bullying hanyalah "bercanda" atau "bagian dari masa remaja". 
                            Padahal, bullying adalah sebuah <b>ketidakadilan relasi</b>. Ketika seseorang 
                            merasa terus-menerus terintimidasi, takut untuk berbicara, atau kehilangan rasa 
                            aman di lingkungannya sendiri, itulah saat bullying terjadi.
                        </p>

                        {/* Sub-bagian: Mengapa & Dampaknya (Flexbox) */}
                        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                            <div style={{ flex: '1', minWidth: '300px' }}>
                                <h4 style={{ color: 'var(--sage-dark)', marginBottom: '10px' }}>
                                    Mengapa Bullying Terjadi?
                                </h4>
                                <p style={{ fontSize: '14px', color: '#64748b', lineHeight: '1.6' }}>
                                    Seringkali, perilaku ini berakar dari keinginan untuk merasa "di atas" 
                                    orang lain. Pelaku mungkin menutupi ketidakamanan diri mereka sendiri 
                                    dengan cara menjatuhkan orang lain. Lingkungan yang mengabaikan perilaku 
                                    ini juga secara tidak langsung memberi "izin" bagi bullying untuk terus 
                                    berlangsung.
                                </p>
                            </div>
                            
                            <div style={{ flex: '1', minWidth: '300px' }}>
                                <h4 style={{ color: 'var(--sage-dark)', marginBottom: '10px' }}>
                                    Bagaimana Dampaknya Bagi Korban?
                                </h4>
                                <p style={{ fontSize: '14px', color: '#64748b', lineHeight: '1.6' }}>
                                    Dampaknya tidak hanya fisik. Secara mental, korban sering mengalami 
                                    "luka tak terlihat" seperti hilangnya kepercayaan diri secara permanen, 
                                    sulit memercayai orang baru, hingga trauma yang menghambat potensi masa 
                                    depan mereka.
                                </p>
                            </div>
                        </div>
                    </AnimatedContent>

                    {/* --- TABEL JENIS & GEJALA BULLYING DINAMIS --- */}
                    <AnimatedContent distance={30}>
                        <h2 style={{ fontSize: '1.8rem', color: '#1e293b', marginBottom: '20px', marginTop: '60px' }}>
                            Mengenali Jenis dan Gejala Bullying (Live Data)
                        </h2>
                        <p style={{ lineHeight: '1.8', color: '#475569', marginBottom: '25px' }}>
                            Berikut adalah klasifikasi jenis perundungan beserta indikator klinis yang ditarik langsung dari database manajemen sistem pakar kami:
                        </p>

                        <div 
                            style={{ 
                                overflowX: 'auto', 
                                borderRadius: '16px', 
                                border: '1px solid #e2e8f0', 
                                boxShadow: '0 4px 6px rgba(0,0,0,0.02)',
                                backgroundColor: 'white'
                            }}
                        >
                            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                                <thead>
                                    <tr style={{ backgroundColor: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                                        <th style={{ padding: '16px 20px', color: '#1e293b', fontWeight: 'bold', width: '25%' }}>Kategori Bullying</th>
                                        <th style={{ padding: '16px 20px', color: '#1e293b', fontWeight: 'bold', width: '15%', textAlign: 'center' }}>Kode Gejala</th>
                                        <th style={{ padding: '16px 20px', color: '#1e293b', fontWeight: 'bold', width: '60%' }}>Teks Indikator Deskripsi Gejala</th>
                                    </tr>
                                </thead>
                                <tbody style={{ fontSize: '14px', color: '#475569', lineHeight: '1.6' }}>
                                    {liveSymptoms && liveSymptoms.length > 0 ? (
                                        liveSymptoms.map((symptom, idx) => (
                                            <tr key={symptom.id} style={{ borderBottom: '1px solid #f1f5f9', backgroundColor: idx % 2 === 0 ? '#ffffff' : '#fdfdfd' }}>
                                                <td style={{ padding: '14px 20px', fontWeight: 'bold', color: '#1e293b' }}>
                                                    {symptom.bullying_type ? symptom.bullying_type.name : 'Kategori Umum'}
                                                </td>
                                                <td style={{ padding: '14px 20px', textAlign: 'center', fontWeight: 'bold', color: '#7a9b76' }}>
                                                    {symptom.code}
                                                </td>
                                                <td style={{ padding: '14px 20px' }}>
                                                    {symptom.question_text}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="3" style={{ padding: '30px', textAlign: 'center', color: '#94a3b8' }}>
                                                Menghubungkan ke Pusat Data Sistem Pakar...
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </AnimatedContent>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', marginTop: '40px' }}>
                    <AnimatedContent distance={20} delay={0.2}>
                        <div style={{ padding: '30px', border: '1px solid #e2e8f0', borderRadius: '24px', background: 'white' }}>
                            <div style={{ fontSize: '30px', marginBottom: '15px' }}>😈</div>
                            <h3 style={{ color: '#e11d48', marginBottom: '15px' }}>Analisis Sudut Pandang Pelaku</h3>
                            <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '15px' }}>Olweus mencatat bahwa pelaku bullying seringkali memiliki karakteristik berikut:</p>
                            <ul style={{ color: '#475569', lineHeight: '1.8', paddingLeft: '20px' }}>
                                <li><b>Kebutuhan Dominasi:</b> Memiliki dorongan kuat untuk mengontrol orang lain agar merasa berkuasa.</li>
                                <li><b>Defisit Empati:</b> Kesulitan merasakan penderitaan yang dirasakan oleh korbannya.</li>
                                <li><b>Impulsif:</b> Mudah tersulut emosi dan cenderung menggunakan kekerasan untuk menyelesaikan konflik.</li>
                                <li><b>Pola Perilaku:</b> Seringkali merasa mendapatkan kepuasan psikologis setelah menindas orang lain.</li>
                            </ul>
                        </div>
                    </AnimatedContent>

                    <AnimatedContent distance={20} delay={0.4}>
                        <div style={{ padding: '30px', border: '1px solid #e2e8f0', borderRadius: '24px', background: 'white' }}>
                            <div style={{ fontSize: '30px', marginBottom: '15px' }}>🛡️</div>
                            <h3 style={{ color: '#1e293b', marginBottom: '15px' }}>Analisis Sudut Pandang Korban</h3>
                            <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '15px' }}>Korban seringkali terjebak dalam kondisi yang sangat membatasi mereka:</p>
                            <ul style={{ color: '#475569', lineHeight: '1.8', paddingLeft: '20px' }}>
                                <li><b>Power Imbalance:</b> Merasa tidak memiliki pertahanan diri yang setara dengan pelaku.</li>
                                <li><b>Dampak Psikologis:</b> Munculnya depresi, kecemasan akut, hingga keinginan untuk menarik diri dari lingkungan sekolah.</li>
                                <li><b>Psikosomatis:</b> Stres yang terus menerus seringkali berubah menjadi penyakit fisik seperti sakit perut atau kepala kronis.</li>
                            </ul>
                        </div>
                    </AnimatedContent>
                </div>
            </section>
      </div> 
    </section>

        <div className="education-grid">
            {[
                {
                    icon: 'fa-brain',
                    q: 'Apa dampak psikologis dari perundungan?',
                    a: 'Perundungan kronis dapat memicu kecemasan, depresi, rasa tidak berharga, trauma, dan ketakutan sosial yang dapat bertahan lama jika tidak ditangani.'
                },
                {
                    icon: 'fa-graduation-cap',
                    q: 'Apakah performa akademis juga terpengaruh?',
                    a: 'Ya. Korban sering kehilangan konsentrasi, merasa takut pergi ke sekolah atau kampus, dan mengalami penurunan motivasi belajar.'
                },
                {
                    icon: 'fa-heart-pulse',
                    q: 'Bagaimana tubuh bereaksi terhadap tekanan?',
                    a: 'Tekanan emosional dapat muncul sebagai keluhan fisik seperti sakit kepala, mual, sulit tidur, lelah berlebih, atau gangguan pencernaan.'
                },
                {
                    icon: 'fa-comments',
                    q: 'Apa langkah pertama yang harus dilakukan?',
                    a: 'Mulailah dengan bercerita kepada orang yang dipercaya. Jangan memendam semuanya sendirian, dan cari bantuan dari orang tua, guru, konselor, atau sahabat.'
                },
                {
                    icon: 'fa-shield-heart',
                    q: 'Haruskah saya melawan balik pelaku?',
                    a: 'Utamakan keselamatan. Hindari konflik langsung, jauhi situasi berbahaya, simpan bukti jika perlu, dan laporkan pada pihak yang berwenang.'
                },
                {
                    icon: 'fa-user-doctor',
                    q: 'Kapan harus mencari ahli profesional?',
                    a: 'Segera cari bantuan jika Anda merasa sangat tertekan, kehilangan minat, sulit menjalani aktivitas, atau muncul pikiran untuk menyakiti diri.'
                }
            ].map((faq, i) => (
                <AnimatedContent key={i} distance={25} delay={i * 0.08}>
                    <div className="education-card">
                        <div className="education-icon">
                            <i className={`fa-solid ${faq.icon}`}></i>
                        </div>

                        <h3 className="serif-title">
                            {faq.q}
                        </h3>

                        <p>
                            {faq.a}
                        </p>
                    </div>
                </AnimatedContent>
            ))}
        </div>

        <section className="help-section">
            <AnimatedContent distance={30}>
                <div className="help-header">
                    <span className="sub-heading">- Kontak Profesional -</span>

                    <h2 className="serif-title">
                        Pusat Bantuan Darurat
                    </h2>

                    <p>
                        Jika Anda membutuhkan bantuan segera, hubungi layanan resmi berikut.
                        Jangan ragu mencari pertolongan saat kondisi terasa terlalu berat.
                    </p>
                </div>
            </AnimatedContent>

            <div className="help-list">
                {[
                    {
                        id: '129',
                        title: 'SAPA 129',
                        desc: 'Sahabat Perempuan dan Anak. Layanan hotline resmi untuk perlindungan perempuan dan anak.',
                        action: 'Hubungi 129',
                        link: 'tel:129'
                    },
                    {
                        id: '119',
                        title: 'National Command Center 119',
                        desc: 'Layanan gawat darurat medis. Dapat digunakan ketika membutuhkan bantuan medis segera.',
                        action: 'Panggil 119',
                        link: 'tel:119'
                    },
                    {
                        id: 'WA',
                        title: 'Yayasan Pulih',
                        desc: 'Lembaga psikologi profesional yang menyediakan layanan konseling dan dukungan psikologis.',
                        action: 'Kirim Pesan',
                        link: 'https://wa.me/628118436633'
                    }
                ].map((contact, i) => (
                    <AnimatedContent key={i} distance={25} delay={i * 0.1}>
                        <div className="help-card">
                            <div className="help-number">
                                {contact.id}
                            </div>

                            <div>
                                <h3 className="serif-title">
                                    {contact.title}
                                </h3>

                                <p>
                                    {contact.desc}
                                </p>
                            </div>

                            <a
                                href={contact.link}
                                target="_blank"
                                rel="noreferrer"
                                className="help-button"
                            >
                                {contact.action}
                                <i className="fa-solid fa-arrow-right"></i>
                            </a>
                        </div>
                    </AnimatedContent>
                ))}
            </div>
        </section>
    </div>
)}
            </div>



            <footer style={{ background: '#1e293b', color: 'white', padding: '80px 20px 30px 20px', marginTop: 'auto' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: '50px', marginBottom: '60px' }}>
                    <div style={{ flex: '2', minWidth: '300px' }}>
                        <h2 className="serif-title" style={{ margin: '0 0 20px 0', fontSize: '32px', color: 'white' }}>
                            Ruang<span style={{ color: 'var(--sage-main)' }}>Pulih.</span>
                        </h2>

                        <p style={{ color: '#94a3b8', lineHeight: '1.8', fontSize: '15px', maxWidth: '400px' }}>
                            Aplikasi sistem pakar untuk membantu mendeteksi dini dampak kesehatan mental akibat perundungan menggunakan metode komputasi logika pakar (Fuzzy Logic).
                        </p>
                    </div>

                    <div style={{ flex: '1', minWidth: '200px' }}>
                        <h3 style={{ margin: '0 0 25px 0', color: 'white', fontSize: '16px', letterSpacing: '1px', textTransform: 'uppercase' }}>Akses Cepat</h3>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            <span onClick={() => handleTabChange('beranda')} style={{ color: '#94a3b8', cursor: 'pointer', transition: '0.2s' }}>Tentang Kami</span>
                            <span onClick={() => handleTabChange('data')} style={{ color: '#94a3b8', cursor: 'pointer', transition: '0.2s' }}>Statistik Global</span>
                            <span onClick={() => handleTabChange('edukasi')} style={{ color: '#94a3b8', cursor: 'pointer', transition: '0.2s' }}>Materi Edukasi</span>
                        </div>
                    </div>

                    <div style={{ flex: '1', minWidth: '200px' }}>
                        <h3 style={{ margin: '0 0 25px 0', color: 'white', fontSize: '16px', letterSpacing: '1px', textTransform: 'uppercase' }}>Kontak</h3>

                        <p style={{ color: '#94a3b8', fontSize: '14px', lineHeight: '2.2' }}>
                            <i className="fa-solid fa-location-dot" style={{ width: '25px', color: 'var(--sage-main)' }}></i> Universitas Jendral Ahmad Yani Yogyakarta<br />
                            <i className="fa-solid fa-envelope" style={{ width: '25px', color: 'var(--sage-main)' }}></i> support@RuangPulih.edu
                        </p>
                    </div>
                </div>

                <div style={{ textAlign: 'center', color: '#64748b', fontSize: '14px', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '30px', maxWidth: '1200px', margin: '0 auto' }}>
                    &copy; 2026 Sistem Pakar Diagnosa Risiko Kesehatan Mental. Hak Cipta Dilindungi.
                </div>
            </footer>
        </div>
    );
};

export default Home;