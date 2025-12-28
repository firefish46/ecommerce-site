import React, { useState, useEffect } from 'react';

const HeroSlider = ({ slides }) => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 5000); // Change slide every 5 seconds
    return () => clearInterval(timer);
  }, [slides.length]);

  if (!slides || slides.length === 0) return null;

  return (
    <div style={sliderWrapper}>
      {slides.map((slide, index) => (
        <div 
          key={slide._id} 
          style={{
            ...slideContainer,
            opacity: index === current ? 1 : 0,
            backgroundImage: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url(${slide.image})`
          }}
        >
          <div style={slideContent}>
            <h1 style={heroTitle}>{slide.title}</h1>
            <p style={heroSubtitle}>{slide.subtitle}</p>
            <button style={heroBtn}>View Deal</button>
          </div>
        </div>
      ))}
    </div>
  );
};

// Styles
const sliderWrapper = { position: 'relative', height: '450px', overflow: 'hidden', backgroundColor: '#000' };
const slideContainer = { 
  position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', 
  backgroundSize: 'cover', backgroundPosition: 'center', 
  transition: 'opacity 1s ease-in-out', display: 'flex', alignItems: 'center', justifyContent: 'center' 
};
const slideContent = { textAlign: 'center', color: '#fff', padding: '20px' };
const heroTitle = { fontSize: '3.5rem', fontWeight: '800', marginBottom: '10px' };
const heroSubtitle = { fontSize: '1.2rem', marginBottom: '25px' };
const heroBtn = { padding: '12px 35px', backgroundColor: '#0d76ff', color: '#fff', border: 'none', borderRadius: '5px', fontWeight: 'bold', cursor: 'pointer' };

export default HeroSlider;