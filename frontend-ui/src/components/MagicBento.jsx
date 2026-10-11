import React, { useRef, useEffect, useState, useCallback } from 'react';
import { gsap } from 'gsap';
import './MagicBento.css';

// Warna Default Hijau Sage (RGB)
const DEFAULT_GLOW_COLOR = '122, 155, 118'; 
const DEFAULT_SPOTLIGHT_RADIUS = 350;
const MOBILE_BREAKPOINT = 768;

// Data Artikel Edukasi Anda
const cardData = [
  { icon: '🌱', title: 'Mengapa Kesehatan Mental Penting?', description: 'Memahami bahwa jiwa yang sehat adalah kunci kebahagiaan fisik dan sosial.' },
  { icon: '🛡️', title: 'Menghadapi Dampak Bullying', description: 'Langkah-langkah kecil untuk memulihkan diri dan mencari bantuan tepercaya.' },
  { icon: '🧘', title: 'Teknik Relaksasi 5 Menit', description: 'Latihan pernapasan sederhana untuk meredakan kecemasan seketika.' }
];

const calculateSpotlightValues = radius => ({
  proximity: radius * 0.5,
  fadeDistance: radius * 0.75
});

const updateCardGlowProperties = (card, mouseX, mouseY, glow, radius) => {
  const rect = card.getBoundingClientRect();
  const relativeX = ((mouseX - rect.left) / rect.width) * 100;
  const relativeY = ((mouseY - rect.top) / rect.height) * 100;

  card.style.setProperty('--glow-x', `${relativeX}%`);
  card.style.setProperty('--glow-y', `${relativeY}%`);
  card.style.setProperty('--glow-intensity', glow.toString());
  card.style.setProperty('--glow-radius', `${radius}px`);
};

const GlobalSpotlight = ({ gridRef, disableAnimations = false, enabled = true, spotlightRadius = DEFAULT_SPOTLIGHT_RADIUS, glowColor = DEFAULT_GLOW_COLOR }) => {
  const spotlightRef = useRef(null);

  useEffect(() => {
    if (disableAnimations || !gridRef?.current || !enabled) return;

    const spotlight = document.createElement('div');
    spotlight.className = 'global-spotlight';
    spotlight.style.cssText = `
      position: fixed;
      width: 800px;
      height: 800px;
      border-radius: 50%;
      pointer-events: none;
      background: radial-gradient(circle,
        rgba(${glowColor}, 0.1) 0%,
        rgba(${glowColor}, 0.05) 20%,
        rgba(${glowColor}, 0.02) 40%,
        transparent 60%
      );
      z-index: 200;
      opacity: 0;
      transform: translate(-50%, -50%);
    `;
    document.body.appendChild(spotlight);
    spotlightRef.current = spotlight;

    const handleMouseMove = e => {
      if (!spotlightRef.current || !gridRef.current) return;

      const section = gridRef.current.closest('.bento-section');
      const rect = section?.getBoundingClientRect();
      const mouseInside = rect && e.clientX >= rect.left && e.clientX <= rect.right && e.clientY >= rect.top && e.clientY <= rect.bottom;

      const cards = gridRef.current.querySelectorAll('.magic-bento-card');

      if (!mouseInside) {
        gsap.to(spotlightRef.current, { opacity: 0, duration: 0.3, ease: 'power2.out' });
        cards.forEach(card => card.style.setProperty('--glow-intensity', '0'));
        return;
      }

      const { proximity, fadeDistance } = calculateSpotlightValues(spotlightRadius);
      let minDistance = Infinity;

      cards.forEach(card => {
        const cardRect = card.getBoundingClientRect();
        const centerX = cardRect.left + cardRect.width / 2;
        const centerY = cardRect.top + cardRect.height / 2;
        const distance = Math.hypot(e.clientX - centerX, e.clientY - centerY) - Math.max(cardRect.width, cardRect.height) / 2;
        const effectiveDistance = Math.max(0, distance);

        minDistance = Math.min(minDistance, effectiveDistance);

        let glowIntensity = 0;
        if (effectiveDistance <= proximity) glowIntensity = 1;
        else if (effectiveDistance <= fadeDistance) glowIntensity = (fadeDistance - effectiveDistance) / (fadeDistance - proximity);

        updateCardGlowProperties(card, e.clientX, e.clientY, glowIntensity, spotlightRadius);
      });

      gsap.to(spotlightRef.current, { left: e.clientX, top: e.clientY, duration: 0.1, ease: 'power2.out' });

      const targetOpacity = minDistance <= proximity ? 1 : minDistance <= fadeDistance ? (fadeDistance - minDistance) / (fadeDistance - proximity) : 0;
      gsap.to(spotlightRef.current, { opacity: targetOpacity, duration: targetOpacity > 0 ? 0.2 : 0.5, ease: 'power2.out' });
    };

    const handleMouseLeave = () => {
      gridRef.current?.querySelectorAll('.magic-bento-card').forEach(card => card.style.setProperty('--glow-intensity', '0'));
      if (spotlightRef.current) gsap.to(spotlightRef.current, { opacity: 0, duration: 0.3, ease: 'power2.out' });
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      spotlightRef.current?.parentNode?.removeChild(spotlightRef.current);
    };
  }, [gridRef, disableAnimations, enabled, spotlightRadius, glowColor]);

  return null;
};

const useMobileDetection = () => {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= MOBILE_BREAKPOINT);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  return isMobile;
};

const MagicBento = () => {
  const gridRef = useRef(null);
  const isMobile = useMobileDetection();
  
  // Konfigurasi Animasi
  const disableAnimations = isMobile; // Matikan animasi berat di HP agar tidak lag
  const enableSpotlight = true;
  const enableTilt = true;

  return (
    <div className="bento-section" ref={gridRef}>
      <GlobalSpotlight gridRef={gridRef} disableAnimations={disableAnimations} enabled={enableSpotlight} />
      
      <div className="card-grid">
        {cardData.map((card, index) => (
          <div
            key={index}
            className="magic-bento-card magic-bento-card--border-glow"
            ref={el => {
              if (!el || disableAnimations) return;

              const handleMouseMove = e => {
                const rect = el.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;

                if (enableTilt) {
                  const rotateX = ((y - centerY) / centerY) * -8;
                  const rotateY = ((x - centerX) / centerX) * 8;
                  gsap.to(el, { rotateX, rotateY, duration: 0.2, ease: 'power2.out', transformPerspective: 1000 });
                }
              };

              const handleMouseLeave = () => {
                if (enableTilt) gsap.to(el, { rotateX: 0, rotateY: 0, duration: 0.5, ease: 'power2.out' });
              };

              el.addEventListener('mousemove', handleMouseMove);
              el.addEventListener('mouseleave', handleMouseLeave);
            }}
          >
            <div className="magic-bento-card__header">
              <div className="magic-bento-card__icon">{card.icon}</div>
            </div>
            <div className="magic-bento-card__content">
              <h2 className="magic-bento-card__title">{card.title}</h2>
              <p className="magic-bento-card__description">{card.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MagicBento;