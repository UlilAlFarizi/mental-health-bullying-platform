import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import './Carousel.css';

const DRAG_BUFFER = 0;
const VELOCITY_THRESHOLD = 500;
const GAP = 16;
const SPRING_OPTIONS = { type: 'spring', stiffness: 300, damping: 30 };

function CarouselItem({ item, index, itemWidth, round, trackItemOffset, x, transition }) {

  return (
    <motion.div
      key={`${item?.id ?? index}-${index}`}
      className={`carousel-item ${round ? 'round' : ''}`}
      style={{
        width: itemWidth,
        height: '200px', 
        // rotateY dihapus dari sini agar tidak ada efek memutar 3D
        ...(round && { borderRadius: '50%' })
      }}
      transition={transition}
    >
      {/* DESAIN KARTU ARTIKEL LANDSCAPE (MEMANJANG) */}
      <div 
          onClick={() => window.open(item.link, '_blank', 'noopener,noreferrer')}
          style={{ 
              background: 'white', borderRadius: '24px', overflow: 'hidden', border: '1px solid #f1f5f9', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', 
              display: 'flex', flexDirection: 'row', height: '100%', cursor: 'pointer' 
          }}
      >
          {/* Gambar (40%) */}
          <div style={{ width: '40%', height: '100%', overflow: 'hidden', pointerEvents: 'none' }}>
              <img src={item.img} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          
          {/* Teks (60%) */}
          <div style={{ width: '60%', padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <div style={{ display: 'flex', gap: '10px', marginBottom: '8px' }}>
                  <span style={{ background: item.bg, color: item.color, padding: '4px 10px', borderRadius: '8px', fontSize: '10px', fontWeight: 'bold' }}>{item.category}</span>
              </div>
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.1rem', margin: '0 0 8px 0', lineHeight: '1.3', color: '#1e293b' }}>
                  {item.title}
              </h3>
              <p style={{ color: '#64748b', fontSize: '12px', lineHeight: '1.5', margin: '0 0 10px 0', flexGrow: 1, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' }}>
                  {item.desc}
              </p>
              <div style={{ color: 'var(--sage-main)', fontWeight: '600', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                  Baca Selengkapnya <i className="fa-solid fa-arrow-right-long"></i>
              </div>
          </div>
      </div>
    </motion.div>
  );
}


export default function Carousel({ items = [], baseWidth = 480, autoplay = false, autoplayDelay = 3000, pauseOnHover = false, loop = false, round = false }) {
  const containerPadding = 16;
  const itemWidth = baseWidth - containerPadding * 2;
  const trackItemOffset = itemWidth + GAP;
  const itemsForRender = useMemo(() => {
    if (!loop) return items;
    if (items.length === 0) return [];
    return [items[items.length - 1], ...items, items[0]];
  }, [items, loop]);

  const [position, setPosition] = useState(loop ? 1 : 0);
  const x = useMotionValue(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isJumping, setIsJumping] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const containerRef = useRef(null);
  useEffect(() => {
    if (pauseOnHover && containerRef.current) {
      const container = containerRef.current;
      const handleMouseEnter = () => setIsHovered(true);
      const handleMouseLeave = () => setIsHovered(false);
      container.addEventListener('mouseenter', handleMouseEnter);
      container.addEventListener('mouseleave', handleMouseLeave);
      return () => {
        container.removeEventListener('mouseenter', handleMouseEnter);
        container.removeEventListener('mouseleave', handleMouseLeave);
      };
    }
  }, [pauseOnHover]);

  useEffect(() => {
    if (!autoplay || itemsForRender.length <= 1) return undefined;
    if (pauseOnHover && isHovered) return undefined;
    const timer = setInterval(() => { setPosition(prev => Math.min(prev + 1, itemsForRender.length - 1)); }, autoplayDelay);
    return () => clearInterval(timer);
  }, [autoplay, autoplayDelay, isHovered, pauseOnHover, itemsForRender.length]);

  useEffect(() => {
    const startingPosition = loop ? 1 : 0;
    setPosition(startingPosition);
    x.set(-startingPosition * trackItemOffset);
  }, [items.length, loop, trackItemOffset, x]);

  useEffect(() => {
    if (!loop && position > itemsForRender.length - 1) {
      setPosition(Math.max(0, itemsForRender.length - 1));
    }
  }, [itemsForRender.length, loop, position]);

  const effectiveTransition = isJumping ? { duration: 0 } : SPRING_OPTIONS;

  const handleAnimationStart = () => { setIsAnimating(true); };

  const handleAnimationComplete = () => {
    if (!loop || itemsForRender.length <= 1) { setIsAnimating(false); return; }
    const lastCloneIndex = itemsForRender.length - 1;
    if (position === lastCloneIndex || position === 0) {
      setIsJumping(true);
      const target = position === lastCloneIndex ? 1 : items.length;
      setPosition(target);
      x.set(-target * trackItemOffset);
      requestAnimationFrame(() => { setIsJumping(false); setIsAnimating(false); });
      return;
    }
    setIsAnimating(false);
  };

  const handleDragEnd = (_, info) => {
    const { offset, velocity } = info;
    const direction = offset.x < -DRAG_BUFFER || velocity.x < -VELOCITY_THRESHOLD ? 1 : offset.x > DRAG_BUFFER || velocity.x > VELOCITY_THRESHOLD ? -1 : 0;
    if (direction === 0) return;
    setPosition(prev => {
      const next = prev + direction;
      const max = itemsForRender.length - 1;
      return Math.max(0, Math.min(next, max));
    });
  };

  const dragProps = loop ? {} : { dragConstraints: { left: -trackItemOffset * Math.max(itemsForRender.length - 1, 0), right: 0 } };
  const activeIndex = items.length === 0 ? 0 : loop ? (position - 1 + items.length) % items.length : Math.min(position, items.length - 1);

  return (
    // PERUBAHAN UTAMA: width container menjadi 100% agar kartu samping tidak terpotong
    <div ref={containerRef} className={`carousel-container ${round ? 'round' : ''}`} style={{ width: '100%', margin: '0 auto', perspective: 1000 }}>
      <motion.div
        className="carousel-track"
        drag={isAnimating ? false : 'x'}
        {...dragProps}
        style={{ width: itemWidth, gap: `${GAP}px`, perspective: 1000, perspectiveOrigin: `${position * trackItemOffset + itemWidth / 2}px 50%`, x }}
        onDragEnd={handleDragEnd}
        animate={{ x: -(position * trackItemOffset) }}
        transition={effectiveTransition}
        onAnimationStart={handleAnimationStart}
        onAnimationComplete={handleAnimationComplete}
      >
        {itemsForRender.map((item, index) => (
          <CarouselItem key={`${item?.id ?? index}-${index}`} item={item} index={index} itemWidth={itemWidth} round={round} trackItemOffset={trackItemOffset} x={x} transition={effectiveTransition} />
        ))}
      </motion.div>
      <div className={`carousel-indicators-container ${round ? 'round' : ''}`} style={{ display: 'flex', justifyContent: 'center', marginTop: '30px' }}>
        <div className="carousel-indicators" style={{ display: 'flex', gap: '8px' }}>
          {items.map((_, index) => (
            <motion.div key={index} className={`carousel-indicator ${activeIndex === index ? 'active' : 'inactive'}`} animate={{ scale: activeIndex === index ? 1.2 : 1 }} onClick={() => setPosition(loop ? index + 1 : index)} transition={{ duration: 0.15 }} style={{ width: '8px', height: '8px', borderRadius: '50%', background: activeIndex === index ? 'var(--sage-main)' : '#cbd5e1', cursor: 'pointer' }} />
          ))}
        </div>
      </div>
    </div>
  );
}