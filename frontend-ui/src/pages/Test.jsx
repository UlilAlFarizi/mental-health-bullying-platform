import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import AnimatedContent from '../components/AnimatedContent';

const Test = () => {
    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState({});
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    const [resultData, setResultData] = useState(null);
    const [showExplanation, setShowExplanation] = useState(false);

    const navigate = useNavigate();

    const token = localStorage.getItem('auth_token');
    const isGuest = !token;

    useEffect(() => {
        fetchQuestions();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const fetchQuestions = async () => {
        try {
            const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};

            // PERBAIKAN: ambil pertanyaan random dari backend
            const response = await axios.get('http://127.0.0.1:8000/api/questions/random', config);

            setQuestions(response.data || []);
            setLoading(false);
        } catch (err) {
            console.error("Gagal mengambil soal", err);
            setLoading(false);

            if (err.response && err.response.status === 401) {
                alert("Sistem: Anda harus login untuk melihat soal.");
                navigate('/login');
            }
        }
    };

    const handleOptionChange = (questionId, value) => {
        setAnswers({
            ...answers,
            [questionId]: parseInt(value)
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (Object.keys(answers).length < questions.length) {
            alert("Mohon jawab semua pertanyaan terlebih dahulu agar hasil sistem pakar akurat.");
            return;
        }

        setSubmitting(true);

        // 💡 FIX FRONTEND: Mengurutkan pertanyaan berdasarkan ID asli dari database agar urutan array scores sinkron dengan backend
        const orderedQuestions = [...questions].sort((a, b) => a.id - b.id);
        const scoresArray = orderedQuestions.map(q => answers[q.id] ?? 0);
        const totalScore = scoresArray.reduce((a, b) => a + b, 0);

        // =======================================================
        // JIKA TAMU: Hitung Menggunakan Total Akumulasi di Frontend
        // =======================================================
        const handleSubmit = async (e) => {
        e.preventDefault();

        if (Object.keys(answers).length < questions.length) {
            alert("Mohon jawab semua pertanyaan terlebih dahulu agar hasil sistem pakar akurat.");
            return;
        }

        setSubmitting(true);

        // Susun total skor global untuk evaluasi cepat
        const totalScore = questions.reduce((acc, q) => acc + (answers[q.id] || 0), 0);

        // =======================================================
        // JIKA TAMU: Hitung Dinamis Berdasarkan Tipe Kategori Asli
        // =======================================================
        const handleSubmit = async (e) => {
        e.preventDefault();

        if (Object.keys(answers).length < questions.length) {
            alert("Mohon jawab semua pertanyaan terlebih dahulu agar hasil sistem pakar akurat.");
            return;
        }

        setSubmitting(true);

        // Susun total skor global untuk evaluasi cepat
        const totalScore = questions.reduce((acc, q) => acc + (answers[q.id] || 0), 0);

        // =======================================================
        // JIKA TAMU: Hitung Dinamis Berdasarkan Tipe Kategori Asli
        // =======================================================
       if (isGuest) {
            setTimeout(() => {
                let severity, rec, dominant_type;

                // 💡 FIX FATAL: Objek kosong agar bisa menangkap nama kategori (seperti "Verbal (Lisan)")
                const guestCategories = {};

                questions.forEach(q => {
                    const score = answers[q.id] || 0;
                    const type = q.type || 'Umum';
                    if (score > 0) {
                        guestCategories[type] = (guestCategories[type] || 0) + score;
                    }
                });

                // Ambil semua nama kategori yang nilainya di atas 0
                let activeComponents = Object.keys(guestCategories);
                const totalActive = activeComponents.length;

                if (totalActive === 0) {
                    dominant_type = "Tidak Terindikasi Sistematis";
                } else if (totalActive >= 1 && totalActive <= 3) {
                    dominant_type = "Bullying " + activeComponents.join(', ');
                } else {
                    dominant_type = "Multi-Indikasi Bullying (Trauma Kompleks)";
                }

                if (totalScore >= 40) {
                    severity = "Tingkat Berat (Kritis)";
                    rec = "Analisis mendeteksi indikasi kuat bullying tingkat lanjut. Trauma yang dialami sangat berisiko. Segera hubungi guru BK, psikolog, atau layanan darurat SAPA 129.";
                } else if (totalScore >= 15) {
                    severity = "Tingkat Sedang";
                    rec = "Dampak perundungan membebani pikiranmu secara psikologis. Sangat disarankan untuk mulai mencari dukungan dari ahli atau orang dewasa yang dipercaya.";
                } else if (totalScore > 0) {
                    severity = "Tingkat Ringan";
                    rec = "Indikasi awal trauma bullying terbentuk. Tetap waspada, bangun kembali kepercayaan dirimu, dan jangan ragu untuk bercerita pada sahabat.";
                } else {
                    severity = "Stabil / Konflik Biasa";
                    rec = "Gejala belum memenuhi kriteria mutlak bullying penindasan. Ini mungkin konflik pertemanan biasa atau kesalahpahaman.";
                }

                setResultData({
                    bullying_type: dominant_type,
                    severity_level: severity,
                    recommendation: rec,
                    total_score: totalScore
                });

                setSubmitting(false);
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }, 1000);

            return;
        }
        
        // =======================================================
        // 💡 JIKA LOGIN: KIRIM ARRAY OBJEK ID & SKOR TERIKAT (FIX BUG)
        // =======================================================
        try {
            // Membuat payload jawaban terstruktur memasangkan ID asli gejala dan skor pilihan user
            const answersPayload = questions.map(q => ({
                symptom_id: q.id, 
                score: answers[q.id] ?? 0
            }));

            const response = await axios.post(
                'http://127.0.0.1:8000/api/submit-test',
                {
                    answers: answersPayload // Kirim key 'answers' berupa array pasangan data objek
                },
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            setResultData(response.data.data);
            setSubmitting(false);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } catch (err) {
            console.error(err);
            alert("Gagal memproses hasil tes. Pastikan server backend Laravel menyala.");
            setSubmitting(false);
        }
    };

        // =======================================================
        // 💡 JIKA LOGIN: KIRIM ARRAY OBJEK ID & SKOR TERIKAT (FIX BUG)
        // =======================================================
        try {
            // Membuat payload jawaban terstruktur memasangkan ID asli gejala dan skor pilihan user
            const answersPayload = questions.map(q => ({
                symptom_id: q.id, 
                score: answers[q.id] ?? 0
            }));

            const response = await axios.post(
                'http://127.0.0.1:8000/api/submit-test',
                {
                    answers: answersPayload // Kirim key 'answers' berupa array pasangan data objek
                },
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            setResultData(response.data.data);
            setSubmitting(false);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } catch (err) {
            console.error(err);
            alert("Gagal memproses hasil tes. Pastikan server backend Laravel menyala.");
            setSubmitting(false);
        }
    };

        // =======================================================
        // JIKA LOGIN: Kirim Urutan Array Angka Sinkron ke Backend
        // =======================================================
        try {
            const response = await axios.post(
                'http://127.0.0.1:8000/api/submit-test',
                {
                    scores: scoresArray // Mengirim array scores berurutan ID database
                },
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            setResultData(response.data.data);
            setSubmitting(false);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } catch (err) {
            console.error(err);
            alert("Gagal memproses hasil tes. Pastikan server backend Laravel menyala.");
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div style={{
                textAlign: 'center',
                padding: '50px',
                color: 'var(--sage-dark)',
                marginTop: '100px',
                fontWeight: 'bold'
            }}>
                Menyiapkan ruang tenang untukmu...
            </div>
        );
    }

    if (resultData) {
        return (
            <div style={{ maxWidth: '750px', width: '100%', padding: '20px', margin: '40px auto' }} className="test-wrapper">
                <style>{`
                    .result-card { background: white; padding: 50px; border-radius: 24px; box-shadow: 0 10px 40px rgba(0,0,0,0.06); text-align: center; }
                    .result-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 30px; }
                    .explain-box { text-align: left; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 25px; margin-bottom: 30px; overflow: hidden; transition: all 0.3s ease-in-out; }

                    @media (max-width: 768px) {
                        .result-card { padding: 30px 20px; }
                        .result-grid { grid-template-columns: 1fr; gap: 15px; }
                    }
                `}</style>

                <AnimatedContent distance={50} duration={0.8}>
                    <div className="result-card">
                        <div style={{ fontSize: '50px', marginBottom: '10px' }}>📋</div>

                        <h2 style={{ color: 'var(--sage-dark)', fontSize: '2rem', margin: '0 0 10px 0' }}>
                            Hasil Evaluasi
                        </h2>

                        <p style={{ color: '#666', marginBottom: '20px', fontSize: '15px' }}>
                            Berikut adalah hasil analisis sistem pakar berdasarkan jawabanmu.
                        </p>

                        {isGuest && (
                            <div style={{
                                background: '#fef3c7',
                                color: '#b45309',
                                padding: '10px',
                                borderRadius: '10px',
                                fontSize: '13px',
                                marginBottom: '30px',
                                fontWeight: 'bold'
                            }}>
                                <i className="fa-solid fa-circle-info"></i> Mode Tamu: Hasil ini tidak disimpan ke riwayatmu.
                            </div>
                        )}

                        <div className="result-grid">
                            <div style={{
                                background: '#f8fafc',
                                padding: '20px',
                                borderRadius: '16px',
                                border: '1px solid #e2e8f0'
                            }}>
                                <div style={{
                                    fontSize: '12px',
                                    color: '#64748b',
                                    textTransform: 'uppercase',
                                    letterSpacing: '1px',
                                    marginBottom: '10px',
                                    fontWeight: 'bold'
                                }}>
                                    Jenis Terdeteksi
                                </div>

                                <div style={{
                                    fontSize: '17px',
                                    fontWeight: '900',
                                    color: '#475569',
                                    lineHeight: '1.4'
                                }}>
                                    {resultData.bullying_type}
                                </div>
                            </div>

                            <div style={{
                                background: '#f8fafc',
                                padding: '20px',
                                borderRadius: '16px',
                                border: '1px solid #e2e8f0',
                                borderBottom: `4px solid ${resultData.severity_level.includes('Berat') ? '#e63946' : 'var(--sage-main)'}`
                            }}>
                                <div style={{
                                    fontSize: '12px',
                                    color: '#64748b',
                                    textTransform: 'uppercase',
                                    letterSpacing: '1px',
                                    marginBottom: '10px',
                                    fontWeight: 'bold'
                                }}>
                                    Tingkat Trauma
                                </div>

                                <div style={{
                                    fontSize: '18px',
                                    fontWeight: '900',
                                    color: resultData.severity_level.includes('Berat') ? '#e63946' : 'var(--sage-dark)'
                                }}>
                                    {resultData.severity_level}
                                </div>
                            </div>
                        </div>

                        <div style={{
                            background: 'linear-gradient(135deg, var(--sage-light) 0%, #b2cf8e 100%)',
                            color: 'var(--sage-dark)',
                            padding: '30px',
                            borderRadius: '16px',
                            marginBottom: '20px',
                            textAlign: 'left',
                            boxShadow: '0 5px 15px rgba(0,0,0,0.05)'
                        }}>
                            <h4 style={{
                                margin: '0 0 15px 0',
                                fontSize: '1.2rem',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px',
                                fontWeight: '900'
                            }}>
                                💡 Rekomendasi Psikologis
                            </h4>

                            <p style={{
                                margin: 0,
                                lineHeight: '1.8',
                                fontSize: '15px',
                                fontWeight: '500'
                            }}>
                                {resultData.recommendation}
                            </p>
                        </div>

                        <div style={{ marginBottom: '40px' }}>
                            <button
                                onClick={() => setShowExplanation(!showExplanation)}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    color: '#64748b',
                                    fontWeight: 'bold',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '8px',
                                    width: '100%',
                                    padding: '10px'
                                }}
                            >
                                {showExplanation ? (
                                    <i className="fa-solid fa-chevron-up"></i>
                                ) : (
                                    <i className="fa-solid fa-chevron-down"></i>
                                )}

                                {showExplanation ? 'Tutup Analisis Sistem' : 'Bagaimana Sistem Mengambil Keputusan Ini?'}
                            </button>

                            {showExplanation && (
                                <AnimatedContent distance={-20} duration={0.4}>
                                    <div className="explain-box">
                                        <p style={{
                                            fontSize: '14px',
                                            color: '#475569',
                                            lineHeight: '1.7',
                                            margin: '0 0 15px 0'
                                        }}>
                                            <strong>1. Tahap Gatekeeper (Rule-Based):</strong> Sistem mengecek apakah jawabanmu memenuhi kriteria mutlak pada masing-masing jenis bullying (Multi-Diagnosis). Jika ada 1 saja gejala utama yang bernilai 'Tidak Pernah', maka jenis tersebut dibatalkan.
                                        </p>

                                        <p style={{
                                            fontSize: '14px',
                                            color: '#475569',
                                            lineHeight: '1.7',
                                            margin: 0
                                        }}>
                                            <strong>2. Tahap Probabilitas Keparahan:</strong> Sistem kemudian mengambil jenis bullying dengan skor himpunan yang paling tinggi (Fuzzy MAX). Berdasarkan kalkulasi intensitasnya, indikasi trauma emosionalmu jatuh pada kategori <strong>{resultData.severity_level}</strong>.
                                        </p>
                                    </div>
                                </AnimatedContent>
                            )}
                        </div>

                        <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
                            <button
                                onClick={() => navigate(isGuest ? '/tamu' : '/dashboard')}
                                className="btn-primary"
                                style={{
                                    padding: '15px 40px',
                                    width: '100%',
                                    maxWidth: '300px'
                                }}
                            >
                                Kembali ke Beranda
                            </button>

                            {isGuest && (
                                <button
                                    onClick={() => navigate('/register')}
                                    style={{
                                        background: 'white',
                                        color: 'var(--sage-main)',
                                        border: '2px solid var(--sage-main)',
                                        padding: '15px 20px',
                                        borderRadius: '12px',
                                        fontWeight: 'bold',
                                        cursor: 'pointer',
                                        transition: '0.3s'
                                    }}
                                >
                                    Simpan & Daftar
                                </button>
                            )}
                        </div>
                    </div>
                </AnimatedContent>
            </div>
        );
    }

    return (
        <div style={{ maxWidth: '800px', width: '100%', padding: '20px', margin: '0 auto' }} className="test-wrapper">
            <style>{`
                .test-card { background: white; padding: 50px; border-radius: 24px; box-shadow: 0 10px 40px rgba(0,0,0,0.04); }
                .options-container { display: flex; justify-content: space-between; gap: 10px; }
                .option-label { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 15px 5px; border-radius: 12px; border: 1px solid #eee; cursor: pointer; transition: 0.2s all; }
                .option-label:hover { border-color: var(--sage-main); background: #fafdf8; }
                .option-input { margin: 0 auto 10px auto !important; cursor: pointer; transform: scale(1.2); }

                @media (max-width: 768px) {
                    .test-wrapper { padding: 10px; }
                    .test-card { padding: 30px 20px; }
                    .options-container { flex-direction: column; gap: 8px; }
                    .option-label { flex-direction: row; justify-content: flex-start; padding: 12px 20px; text-align: left; }
                    .option-input { margin: 0 15px 0 0 !important; }
                }
            `}</style>

            <button
                onClick={() => navigate(isGuest ? '/tamu' : '/dashboard')}
                style={{
                    background: 'none',
                    border: 'none',
                    color: '#888',
                    marginBottom: '20px',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px'
                }}
            >
                <i className="fa-solid fa-arrow-left"></i> Kembali ke Beranda
            </button>

            <div className="test-card">
                <AnimatedContent distance={30} duration={0.8}>
                    <div style={{
                        textAlign: 'center',
                        marginBottom: '40px',
                        borderBottom: '2px solid rgba(0,0,0,0.03)',
                        paddingBottom: '30px'
                    }}>
                        <h2 style={{
                            color: 'var(--sage-dark)',
                            fontSize: '2.2rem',
                            margin: '0 0 15px 0'
                        }}>
                            Evaluasi Mandiri
                        </h2>

                        {isGuest && (
                            <span style={{
                                background: '#fef3c7',
                                color: '#b45309',
                                padding: '5px 12px',
                                borderRadius: '20px',
                                fontSize: '12px',
                                fontWeight: 'bold'
                            }}>
                                Mode Tamu Aktif
                            </span>
                        )}

                        <p style={{
                            fontSize: '15px',
                            color: '#666',
                            margin: '15px 0 0 0',
                            lineHeight: '1.6'
                        }}>
                            Jujurlah pada dirimu sendiri. Pilih jawaban yang paling menggambarkan pengalaman yang <strong>pernah atau sedang kamu alami</strong>, tanpa memedulikan kapan hal itu terjadi.
                        </p>
                    </div>
                </AnimatedContent>

                <form onSubmit={handleSubmit}>
                    {questions.map((q, index) => (
                        <AnimatedContent key={q.id} distance={40} delay={0.1 + (index * 0.05)}>
                            <div style={{ marginBottom: '40px', background: '#fff', padding: '10px 0' }}>
                                <p style={{
                                    fontWeight: '600',
                                    marginBottom: '20px',
                                    lineHeight: '1.6',
                                    fontSize: '16px',
                                    color: '#333'
                                }}>
                                    <span style={{ color: 'var(--sage-main)', marginRight: '5px' }}>
                                        {index + 1}.
                                    </span>

                                    {q.teks_pertanyaan || q.question_text || q.text || 'Pertanyaan tidak ditemukan'}

                                    <span style={{
                                        fontSize: '12px',
                                        color: '#94a3b8',
                                        fontWeight: 'normal'
                                    }}>
                                        {' '} ({q.code || `G${String(q.id).padStart(2, '0')}`} - {q.type || 'Umum'})
                                    </span>
                                </p>

                                <div className="options-container">
                                    {[
                                        { label: "Tidak Pernah", val: 0 },
                                        { label: "Pernah (1-2 Kali)", val: 1 },
                                        { label: "Sering (Berkali-kali)", val: 2 },
                                        { label: "Sangat Sering", val: 3 }
                                    ].map((opt) => (
                                        <label
                                            key={opt.val}
                                            className="option-label"
                                            style={{
                                                backgroundColor: answers[q.id] === opt.val ? '#e9f5db' : 'transparent',
                                                borderColor: answers[q.id] === opt.val ? 'var(--sage-main)' : '#eee'
                                            }}
                                        >
                                            <input
                                                type="radio"
                                                name={`question-${q.id}`}
                                                value={opt.val}
                                                checked={answers[q.id] === opt.val}
                                                onChange={(e) => handleOptionChange(q.id, e.target.value)}
                                                className="option-input"
                                            />

                                            <span style={{
                                                color: answers[q.id] === opt.val ? 'var(--sage-dark)' : '#666',
                                                fontSize: '14px',
                                                fontWeight: answers[q.id] === opt.val ? 'bold' : 'normal',
                                                textAlign: 'center'
                                            }}>
                                                {opt.label}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </AnimatedContent>
                    ))}

                    <AnimatedContent distance={20} delay={0.2}>
                        <div style={{
                            borderTop: '2px solid rgba(0,0,0,0.03)',
                            paddingTop: '30px',
                            marginTop: '20px'
                        }}>
                            <button
                                type="submit"
                                className="btn-primary"
                                disabled={submitting}
                                style={{
                                    padding: '18px',
                                    width: '100%',
                                    fontSize: '16px',
                                    borderRadius: '12px',
                                    boxShadow: '0 4px 15px rgba(122, 155, 118, 0.3)'
                                }}
                            >
                                {submitting ? (
                                    <span>
                                        <i className="fa-solid fa-circle-notch fa-spin" style={{ marginRight: '10px' }}></i>
                                        Sistem Pakar Sedang Menganalisis...
                                    </span>
                                ) : (
                                    <span>Kirim Jawaban & Lihat Hasil Diagnosa</span>
                                )}
                            </button>
                        </div>
                    </AnimatedContent>
                </form>
            </div>
        </div>
    );
};

export default Test;