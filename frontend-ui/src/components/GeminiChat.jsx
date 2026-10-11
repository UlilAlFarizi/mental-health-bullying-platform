import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';

const GeminiChat = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { text: "Halo! Aku Teman RuangPulih. Ada cerita apa yang ingin kamu bagikan hari ini? Aku siap mendengarkan.", sender: 'bot' }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    // Auto-scroll ke pesan paling baru
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        if (isOpen) scrollToBottom();
    }, [messages, isOpen]);

    const sendMessage = async () => {
        if (!input.trim()) return;
        
        const userMsg = { text: input, sender: 'user' };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsLoading(true); // Memicu avatar berubah menjadi GIF bergerak

        try {
            // GANTI URL DI BAWAH INI DENGAN PRODUCTION URL WEBHOOK DARI N8N ANDA
            const res = await axios.post('https://neologi.app.n8n.cloud/webhook/chat-ruangpulih', { 
                message: input 
            });
            
            setMessages(prev => [...prev, { text: res.data.reply, sender: 'bot' }]);
        } catch (err) {
            console.error("Error chatbot:", err);
            setMessages(prev => [...prev, { text: "Maaf, sepertinya koneksiku sedang terputus. Boleh coba sapa aku lagi nanti?", sender: 'bot' }]);
        } finally {
            setIsLoading(false); // Mengembalikan avatar ke bentuk statis (diam)
        }
    };

    return (
        <div style={{ position: 'fixed', bottom: '30px', right: '30px', zIndex: 9999, fontFamily: 'sans-serif' }}>
            
            {/* Tombol Pemicu Utama (Avatar Melayang di Pojok Kanan Bawah) */}
            <div 
                onClick={() => setIsOpen(!isOpen)} 
                style={{ 
                    cursor: 'pointer', 
                    transition: 'transform 0.2s ease',
                    transform: isOpen ? 'scale(0.9)' : 'scale(1)'
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = isOpen ? 'scale(0.9)' : 'scale(1)'}
            >
                {/* Jika chatbot sedang memproses atau jendela sedang terbuka, 
                  kita bisa tentukan visual tombol melayangnya di sini 
                */}
               <img 
                    // 1. UBAH SUMBER GAMBAR DI SINI
                    src={isLoading ? "/avatar-bicara.gif" : "/avatar-diam.gif"} 
                    // 2. UBAH ALT TEXT
                    alt="Phoebe - Pendamping RuangPulih" 
                    style={{ 
                        width: '90px', // Kita besarkan sedikit agar jelas
                        height: '90px', 
                        // 3. UBAH STYLE DARI BULAT '50%' MENJADI KOTAK TUMPUL '16px'
                        borderRadius: '16px', 
                        boxShadow: '0 8px 24px rgba(0,0,0,0.15)', 
                        border: '3px solid #7a9b76', // Tetap menggunakan hijau sage RuangPulih
                        backgroundColor: '#ffffff',
                        // 4. UBAH OBJECT-FIT DARI 'cover' MENJADI 'contain'
                        objectFit: 'contain' // Agar karakter utuh terlihat di dalam bingkai
                    }} 
                />
            </div>

            {/* Jendela Percakapan (Akan Muncul Jika isOpen === true) */}
            {isOpen && (
                <div style={{ 
                    width: '360px', 
                    height: '520px', 
                    background: '#ffffff', 
                    border: '1px solid #e2e8f0', 
                    borderRadius: '24px', 
                    display: 'flex', 
                    flexDirection: 'column', 
                    boxShadow: '0 12px 36px rgba(0,0,0,0.15)', 
                    position: 'absolute', 
                    bottom: '95px', 
                    right: '0',
                    overflow: 'hidden'
                }}>
                    
                    {/* Header Jendela Chat */}
                    <div style={{ 
                        background: '#7a9b76', 
                        color: '#ffffff', 
                        padding: '16px 20px', 
                        fontWeight: 'bold', 
                        fontSize: '16px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
                    }}>
                        {/* Mini Avatar Phoebe di dalam Header */}
                            <img 
                                // 1. UBAH SUMBER GAMBAR
                                src={isLoading ? "/avatar-bicara.gif" : "/avatar-diam.gif"} 
                                alt="Status Phoebe" 
                                style={{ 
                                    width: '36px', // Kita besarkan sedikit
                                    height: '36px', 
                                    // 2. SAMAKAN STYLE JADI KOTAK TUMPUL
                                    borderRadius: '8px', 
                                    backgroundColor: '#fff',
                                    // 3. GUNAKAN CONTAIN
                                    objectFit: 'contain'
                                }}
                            />
                        <div>
                            <div style={{ fontSize: '15px' }}>Teman RuangPulih</div>
                            <div style={{ fontSize: '11px', fontWeight: 'normal', opacity: 0.9 }}>
                                {isLoading ? 'Sedang merespons...' : 'Online & Mendengarkan'}
                            </div>
                        </div>
                    </div>

                    {/* Area Pesan / Chat Bubbles */}
                    <div style={{ 
                        flex: 1, 
                        overflowY: 'auto', 
                        padding: '20px', 
                        display: 'flex', 
                        flexDirection: 'column', 
                        gap: '14px',
                        background: '#f8fafc'
                    }}>
                        {messages.map((m, i) => (
                            <div key={i} style={{ 
                                alignSelf: m.sender === 'user' ? 'flex-end' : 'flex-start',
                                background: m.sender === 'user' ? '#7a9b76' : '#ffffff',
                                color: m.sender === 'user' ? '#ffffff' : '#334155',
                                padding: '12px 16px',
                                borderRadius: m.sender === 'user' ? '16px 16px 0px 16px' : '16px 16px 16px 0px',
                                maxWidth: '80%',
                                fontSize: '14px',
                                lineHeight: '1.5',
                                boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
                                border: m.sender === 'user' ? 'none' : '1px solid #e2e8f0',
                                wordBreak: 'break-word'
                            }}>
                                {m.text}
                            </div>
                        ))}
                        
                        {/* Indikator Mengetik Khusus */}
                        {isLoading && (
                            <div style={{ alignSelf: 'flex-start', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <div style={{ fontSize: '12px', color: '#64748b', fontStyle: 'italic' }}>
                                    Teman sedang mengetik jawaban yang tepat...
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Area Input Pesan */}
                    <div style={{ padding: '16px', borderTop: '1px solid #e2e8f0', display: 'flex', gap: '10px', background: '#ffffff' }}>
                        <input 
                            value={input} 
                            onChange={(e) => setInput(e.target.value)} 
                            onKeyDown={(e) => e.key === 'Enter' && sendMessage()} 
                            placeholder="Tulis ceritamu di sini..." 
                            disabled={isLoading}
                            style={{ 
                                flex: 1, 
                                padding: '12px 18px', 
                                borderRadius: '24px', 
                                border: '1px solid #cbd5e1', 
                                outline: 'none',
                                fontSize: '14px',
                                transition: 'border-color 0.2s',
                                backgroundColor: isLoading ? '#f1f5f9' : '#ffffff'
                            }} 
                        />
                        <button 
                            onClick={sendMessage} 
                            disabled={isLoading}
                            style={{ 
                                background: '#7a9b76', 
                                color: '#ffffff', 
                                border: 'none', 
                                borderRadius: '50%', 
                                width: '42px', 
                                height: '42px', 
                                cursor: isLoading ? 'not-allowed' : 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                boxShadow: '0 4px 12px rgba(122, 155, 118, 0.3)',
                                opacity: isLoading ? 0.7 : 1
                            }}
                        >
                            {/* Menggunakan karakter panah simpel jika FontAwesome belum termuat */}
                            <span style={{ fontSize: '16px', fontWeight: 'bold' }}>➔</span>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GeminiChat;