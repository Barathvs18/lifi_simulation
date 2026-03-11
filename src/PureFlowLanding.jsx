import React, { useEffect } from 'react';

const PureFlowLanding = ({ onSingleCell, onMultiCell }) => {
  useEffect(() => {
    // Load Google Fonts
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Rajdhani:wght@400;500;600;700&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);

    // Clean up
    return () => {
      document.head.removeChild(link);
    };
  }, []);

  return (
    <div className="pureflow-container">
      {/* Background Elements */}
      <div className="pureflow-bg-grid" />
      <div className="pureflow-beams">
        <div className="beam beam-1" />
        <div className="beam beam-2" />
        <div className="beam beam-3" />
      </div>

      <div className="particles">
        {[...Array(8)].map((_, i) => (
          <div key={i} className={`particle particle-${i + 1}`} />
        ))}
      </div>

      {/* Hero Section */}
      <header className="hero-section">
        <div className="logo-container">
          <div className="led-icon">
            <div className="led-core" />
            <div className="led-ring ring-1" />
            <div className="led-ring ring-2" />
          </div>
        </div>

        <h1 className="main-title">PureFlow</h1>
        <p className="tagline">"The Future of Wireless. Carried by Light."</p>
        
        <p className="description">
          PureFlow harnesses the power of Light Fidelity (LiFi) technology — using infrared light beams to deliver ultra-fast, secure, and interference-free wireless communication indoors. No radio waves. No congestion. Just pure light.
        </p>

        <div className="divider" />
      </header>

      {/* CTA Buttons */}
      <section className="cta-section">
        <button className="cta-button btn-single" onClick={onSingleCell}>
          <div className="btn-icon">💡</div>
          <span className="btn-label">Single Cell Simulation</span>
          <span className="btn-sublabel">One LED · One Device · Direct Beam</span>
        </button>

        <button className="cta-button btn-multi" onClick={onMultiCell}>
          <div className="btn-icon">
            <span className="dot"></span>
            <span className="dot"></span>
            <span className="dot"></span>
            <span className="dot"></span>
          </div>
          <span className="btn-label">Multi-Cell Simulation</span>
          <span className="btn-sublabel">4 LEDs · Handover · Mobile Tracking</span>
        </button>
      </section>
      {/* Scoped CSS */}
      <style dangerouslySetInnerHTML={{ __html: `
        /* CSS reset & base for component */
        .pureflow-container {
          position: relative;
          min-height: 100vh;
          background-color: #050a14;
          color: #e8f0fe;
          font-family: 'Rajdhani', sans-serif;
          overflow-x: hidden;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 0 20px;
          box-sizing: border-box;
          z-index: 1;
        }

        .pureflow-container * {
          box-sizing: border-box;
        }

        h1, h2, h3, .btn-label {
          font-family: 'Orbitron', sans-serif;
        }

        /* Animated Background Grid */
        .pureflow-bg-grid {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-image: 
            linear-gradient(rgba(0, 212, 255, 0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 212, 255, 0.05) 1px, transparent 1px);
          background-size: 50px 50px;
          background-position: center center;
          z-index: -2;
          opacity: 0.5;
          animation: moveGrid 20s linear infinite;
        }

        @keyframes moveGrid {
          0% { transform: translateY(0); }
          100% { transform: translateY(50px); }
        }

        /* LiFi Beams */
        .pureflow-beams {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: -1;
          pointer-events: none;
          overflow: hidden;
        }

        .beam {
          position: absolute;
          width: 2px;
          height: 150vh;
          opacity: 0.15;
          transform-origin: top center;
          box-shadow: 0 0 20px 2px currentColor;
        }

        .beam-1 {
          top: -20vh;
          left: 10vw;
          color: #00d4ff;
          animation: sweep1 14s ease-in-out infinite alternate;
        }

        .beam-2 {
          top: -10vh;
          left: 80vw;
          color: #ff4d00;
          animation: sweep2 18s ease-in-out infinite alternate-reverse;
        }

        .beam-3 {
          top: -30vh;
          left: 50vw;
          color: #00d4ff;
          animation: sweep3 22s ease-in-out infinite alternate;
        }

        @keyframes sweep1 {
          0% { transform: rotate(20deg) translateX(-15vw); }
          100% { transform: rotate(50deg) translateX(15vw); }
        }

        @keyframes sweep2 {
          0% { transform: rotate(-40deg) translateX(-10vw); }
          100% { transform: rotate(-10deg) translateX(10vw); }
        }

        @keyframes sweep3 {
          0% { transform: rotate(5deg) translateX(-20vw); }
          100% { transform: rotate(35deg) translateX(20vw); }
        }

        /* Floating Particles */
        .particles {
          position: absolute;
          top: 0; left: 0; width: 100%; height: 100%;
          z-index: -1; pointer-events: none;
          overflow: hidden;
        }

        .particle {
          position: absolute;
          width: 4px; height: 4px;
          border-radius: 50%;
          bottom: -10px;
          animation: floatUp var(--duration, 8s) linear infinite;
          opacity: 0;
        }

        .particle-1 { left: 15%; --duration: 7s; animation-delay: 0.5s; background: #00d4ff; box-shadow: 0 0 10px 2px #00d4ff; }
        .particle-2 { left: 85%; --duration: 11s; animation-delay: 2.1s; background: #ff4d00; box-shadow: 0 0 10px 2px #ff4d00; }
        .particle-3 { left: 35%; --duration: 9s; animation-delay: 1.2s; background: #00d4ff; box-shadow: 0 0 10px 2px #00d4ff; }
        .particle-4 { left: 65%; --duration: 14s; animation-delay: 3.5s; background: #ff4d00; box-shadow: 0 0 10px 2px #ff4d00; }
        .particle-5 { left: 50%; --duration: 8s; animation-delay: 0.1s; background: #00d4ff; box-shadow: 0 0 10px 2px #00d4ff; }
        .particle-6 { left: 25%; --duration: 12s; animation-delay: 4.2s; background: #ff4d00; box-shadow: 0 0 10px 2px #ff4d00; }
        .particle-7 { left: 75%; --duration: 10s; animation-delay: 2.8s; background: #00d4ff; box-shadow: 0 0 10px 2px #00d4ff; }
        .particle-8 { left: 45%; --duration: 13s; animation-delay: 1.9s; background: #ff4d00; box-shadow: 0 0 10px 2px #ff4d00; }

        @keyframes floatUp {
          0% { transform: translateY(0) scale(0.5); opacity: 0; }
          20% { opacity: 0.6; }
          80% { opacity: 0.4; }
          100% { transform: translateY(-100vh) scale(1.5); opacity: 0; }
        }

        /* Hero Section */
        .hero-section {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          margin-top: 12vh;
          max-width: 800px;
        }

        /* Logo Animation */
        .logo-container {
          margin-bottom: 20px;
          animation: fadeInSlideUp 1s ease forwards;
          opacity: 0;
        }

        .led-icon {
          position: relative;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .led-core {
          width: 16px;
          height: 16px;
          background: #00d4ff;
          border-radius: 50%;
          box-shadow: 0 0 15px 5px rgba(0, 212, 255, 0.8);
          z-index: 2;
        }

        .led-ring {
          position: absolute;
          border: 2px solid #00d4ff;
          border-radius: 50%;
          animation: pulseRing 2s cubic-bezier(0.215, 0.61, 0.355, 1) infinite;
        }

        .ring-1 { width: 100%; height: 100%; animation-delay: 0s; }
        .ring-2 { width: 100%; height: 100%; animation-delay: 1s; }

        @keyframes pulseRing {
          0% { transform: scale(0.5); opacity: 1; }
          100% { transform: scale(2); opacity: 0; }
        }

        /* Typography */
        .main-title {
          font-size: clamp(3rem, 8vw, 6rem);
          font-weight: 900;
          letter-spacing: 4px;
          margin: 0;
          background: linear-gradient(180deg, #ffffff 0%, #00d4ff 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          text-shadow: 0 0 40px rgba(0, 212, 255, 0.4);
          animation: fadeInSlideUp 1s ease 0.2s forwards;
          opacity: 0;
          transform: translateY(20px);
        }

        .tagline {
          font-size: clamp(1.1rem, 2vw, 1.5rem);
          color: #a0b8cc;
          font-style: italic;
          margin: 5px 0 20px;
          animation: fadeInSlideUp 1s ease 0.4s forwards;
          opacity: 0;
          transform: translateY(20px);
        }

        .description {
          font-size: 1.1rem;
          color: #4a6080;
          line-height: 1.6;
          max-width: 600px;
          animation: fadeInSlideUp 1s ease 0.6s forwards;
          opacity: 0;
          transform: translateY(20px);
        }

        .divider {
          width: 80%;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(0, 212, 255, 0.5), transparent);
          margin: 40px 0;
          box-shadow: 0 0 10px rgba(0, 212, 255, 0.5);
          animation: fadeInSlideUp 1s ease 0.8s forwards;
          opacity: 0;
        }

        /* Buttons */
        .cta-section {
          display: flex;
          gap: 30px;
          flex-wrap: wrap;
          justify-content: center;
          animation: fadeInSlideUp 1s ease 1s forwards;
          opacity: 0;
          transform: translateY(20px);
          margin-bottom: 60px;
        }

        .cta-button {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          width: 280px;
          padding: 20px;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
          font-family: inherit;
          text-decoration: none;
          position: relative;
          overflow: hidden;
        }

        .btn-icon {
          font-size: 2rem;
          margin-bottom: 10px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        .btn-label {
          font-size: 1.2rem;
          font-weight: 700;
          letter-spacing: 1px;
          margin-bottom: 5px;
        }

        .btn-sublabel {
          font-size: 0.85rem;
          opacity: 0.8;
          font-family: 'Rajdhani', sans-serif;
        }

        /* Button 1 (Single) */
        .btn-single {
          background: rgba(0, 212, 255, 0.05);
          border: 2px solid #00d4ff;
          color: #00d4ff;
          box-shadow: 0 0 15px rgba(0, 212, 255, 0.2), inset 0 0 10px rgba(0, 212, 255, 0.1);
          backdrop-filter: blur(8px);
        }

        .btn-single .btn-icon {
          text-shadow: 0 0 10px #00d4ff;
        }

        .btn-single:hover {
          background: #00d4ff;
          color: #050a14;
          transform: scale(1.05);
          box-shadow: 0 0 30px rgba(0, 212, 255, 0.6);
        }

        /* Button 2 (Multi) */
        .btn-multi {
          background: linear-gradient(135deg, #ff4d00, #ff8800);
          border: none;
          color: #ffffff;
          box-shadow: 0 0 20px rgba(255, 77, 0, 0.4);
        }

        .btn-multi .dot {
          width: 8px;
          height: 8px;
          background: white;
          border-radius: 50%;
          box-shadow: 0 0 8px white;
        }

        .btn-multi:hover {
          transform: scale(1.05) rotate(-1deg);
          box-shadow: 0 0 35px rgba(255, 77, 0, 0.7);
          filter: brightness(1.1);
        }

        /* Features Section */
        .features-section {
          display: flex;
          flex-wrap: wrap;
          gap: 24px;
          justify-content: center;
          max-width: 1000px;
          margin-bottom: 80px;
        }

        .feature-card {
          flex: 1;
          min-width: 280px;
          background: rgba(255, 255, 255, 0.04);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(0, 212, 255, 0.15);
          border-radius: 16px;
          padding: 30px 20px;
          text-align: center;
          transition: all 0.3s ease;
          opacity: 0;
          animation: fadeInSlideUp 1s ease forwards;
        }

        .feature-card.delay-1 { animation-delay: 1.2s; }
        .feature-card.delay-2 { animation-delay: 1.4s; }
        .feature-card.delay-3 { animation-delay: 1.6s; }

        .feature-card:hover {
          transform: translateY(-6px);
          border-color: rgba(0, 212, 255, 0.5);
          box-shadow: 0 10px 30px rgba(0, 212, 255, 0.1);
          background: rgba(255, 255, 255, 0.06);
        }

        .feature-icon {
          font-size: 2.5rem;
          margin-bottom: 15px;
          display: inline-block;
          filter: drop-shadow(0 0 8px rgba(0, 212, 255, 0.4));
        }

        .feature-title {
          font-size: 1.3rem;
          color: #e8f0fe;
          margin-bottom: 10px;
          letter-spacing: 0.5px;
        }

        .feature-desc {
          font-size: 0.95rem;
          color: #a0b8cc;
          line-height: 1.5;
          margin: 0;
        }

        /* Footer */
        .footer {
          width: 100%;
          border-top: 1px solid rgba(0, 212, 255, 0.2);
          padding: 20px 40px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: rgba(5, 10, 20, 0.9);
          backdrop-filter: blur(10px);
          margin-top: auto;
          flex-wrap: wrap;
          gap: 15px;
          z-index: 10;
        }

        .footer-left {
          color: #4a6080;
          font-size: 0.9rem;
        }

        .footer-center {
          color: #a0b8cc;
          font-size: 0.9rem;
          font-weight: 500;
          letter-spacing: 1px;
        }

        .footer-right {
          display: flex;
          align-items: center;
        }

        .signal-dot {
          width: 8px;
          height: 8px;
          background: #00d4ff;
          border-radius: 50%;
          box-shadow: 0 0 10px #00d4ff;
          animation: blink 1.5s infinite alternate;
        }

        @keyframes blink {
          0% { opacity: 0.3; transform: scale(0.8); }
          100% { opacity: 1; transform: scale(1.2); }
        }

        @keyframes fadeInSlideUp {
          0% { opacity: 0; transform: translateY(30px); }
          100% { opacity: 1; transform: translateY(0); }
        }

        /* Responsive */
        @media (max-width: 768px) {
          .cta-section {
            flex-direction: column;
            width: 100%;
            align-items: center;
          }
          .cta-button {
            width: 100%;
            max-width: 350px;
          }
          .features-section {
            flex-direction: column;
          }
          .footer {
            flex-direction: column;
            text-align: center;
          }
        }
      `}} />
    </div>
  );
};

export default PureFlowLanding;
