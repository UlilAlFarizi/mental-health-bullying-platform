import React from 'react';
// 1. Import dari folder assets (pastikan huruf kecil semua: logo.png)
import logoRuangPulih from '../assets/logo.png'; 

const NavbarLanding = () => {
  return (
    <nav style={styles.navContainer}>
      
      {/* --- BAGIAN LOGO --- */}
      <div style={styles.logoWrapper}>
        <a href="/" style={styles.logoLink}>
          {/* 2. Panggil menggunakan variabel import, TANPA tanda kutip */}
          <img 
            src={logoRuangPulih} 
            alt="Logo RuangPulih" 
            style={styles.logoImage} 
          />
        </a>
      </div>

      {/* --- BAGIAN MENU --- */}
      <div style={styles.menuWrapper}>
        <a href="/" style={styles.menuItem}>Home</a>
        <a href="#evaluasi" style={styles.menuItem}>Edukasi</a>
        <a href="/dashboard" style={styles.menuButton}>Dashboard</a>
      </div>

    </nav>
  );
};

const styles = {
  navContainer: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 6rem', background: '#ffffff', boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)' },
  logoWrapper: { display: 'flex', alignItems: 'center' },
  logoLink: { display: 'flex', alignItems: 'center', textDecoration: 'none' },
  logoImage: { height: '45px', width: 'auto', objectFit: 'contain' },
  menuWrapper: { display: 'flex', alignItems: 'center', gap: '2.5rem' },
  menuItem: { textDecoration: 'none', color: '#475569', fontWeight: '500' },
  menuButton: { textDecoration: 'none', color: '#ffffff', background: '#7a9b76', padding: '0.625rem 1.25rem', borderRadius: '5px', fontWeight: 'bold' },
};

export default NavbarLanding;