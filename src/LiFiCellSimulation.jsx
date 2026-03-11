import { useState, useEffect } from 'react';

// Pre-compute floating particles
const particles = Array.from({ length: 60 }).map((_, i) => {
  const cellIndex = i % 4; // Distribute across 4 cells
  return {
    id: i,
    cell: cellIndex,
    x: cellIndex * 250 + 125 + (Math.random() * 120 - 60),
    y: 80 + Math.random() * 400,
    delay: Math.random() * 3,
    duration: 2 + Math.random() * 3,
    size: 1 + Math.random() * 2
  };
});

const LiFiCellSimulation = ({ onBack }) => {
  const [sliderVal, setSliderVal] = useState(50);
  const [isMoving, setIsMoving] = useState(false);
  const [lastVal, setLastVal] = useState(50);

  // Detect movement for walking animation
  useEffect(() => {
    if (sliderVal !== lastVal) {
      setIsMoving(true);
      const timer = setTimeout(() => setIsMoving(false), 150);
      setLastVal(sliderVal);
      return () => clearTimeout(timer);
    }
  }, [sliderVal, lastVal]);

  // Determine active cell based on 4 zones (0-24, 25-49, 50-74, 75-100)
  const activeCell = Math.min(3, Math.floor(sliderVal / 25));

  // Calculate person position (x from 150 to 850)
  const personX = 150 + (sliderVal / 100) * 700;
  
  // Hand/Phone target coordinates receiving the beam
  const targetX = personX + 25;
  const targetY = 367;

  const cells = [
    { id: 0, x: 125, label: "Cell 1" },
    { id: 1, x: 375, label: "Cell 2" },
    { id: 2, x: 625, label: "Cell 3" },
    { id: 3, x: 875, label: "Cell 4" },
  ];

  return (
    <div className="w-full h-screen bg-[#1A1817] overflow-hidden flex flex-col font-sans relative">
      <style>
        {`
          .smooth-transform { transition: transform 0.3s ease-out; }
          .smooth-opacity { transition: opacity 0.3s ease-in-out, fill 0.3s ease-in-out; }
          .smooth-stroke { transition: stroke-opacity 0.3s ease, stroke-width 0.3s ease; }
          
          @keyframes dashFlow {
            from { stroke-dashoffset: 60; }
            to { stroke-dashoffset: 0; }
          }
          .animate-flow { animation: dashFlow 0.6s linear infinite; }
          .animate-flow-slow { animation: dashFlow 1.2s linear infinite; }

          @keyframes pulseRing {
            0% { transform: scale(0.8); opacity: 0.8; }
            100% { transform: scale(2.5); opacity: 0; }
          }
          .animate-ring { animation: pulseRing 1.5s cubic-bezier(0.215, 0.61, 0.355, 1) infinite; transform-origin: center; }

          @keyframes floatUp {
            0% { transform: translateY(0) scale(0.5); opacity: 0; }
            20% { opacity: 0.8; }
            80% { opacity: 0.3; }
            100% { transform: translateY(-30px) scale(1.2); opacity: 0; }
          }
          .particle-float { animation: floatUp linear infinite; }

          @keyframes swingArmBack {
            0%, 100% { transform: translate(5px, 430px) rotate(0deg); }
            25% { transform: translate(5px, 430px) rotate(20deg); }
            75% { transform: translate(5px, 430px) rotate(-20deg); }
          }
          @keyframes swingLegBack {
            0%, 100% { transform: translate(0px, 480px) rotate(0deg); }
            25% { transform: translate(0px, 480px) rotate(-20deg); }
            75% { transform: translate(0px, 480px) rotate(20deg); }
          }
          @keyframes swingLegFront {
            0%, 100% { transform: translate(5px, 480px) rotate(0deg); }
            25% { transform: translate(5px, 480px) rotate(20deg); }
            75% { transform: translate(5px, 480px) rotate(-20deg); }
          }
          @keyframes bodyBob {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-4px); }
          }
          
          .walking .arm-back { animation: swingArmBack 0.5s linear infinite; }
          .walking .leg-back { animation: swingLegBack 0.5s linear infinite; }
          .walking .leg-front { animation: swingLegFront 0.5s linear infinite; }
          .walking .body-bob { animation: bodyBob 0.25s linear infinite; }

          @keyframes shimmerScan {
            0% { opacity: 0; transform: translateY(-50px); }
            10% { opacity: 0.5; }
            90% { opacity: 0.5; }
            100% { opacity: 0; transform: translateY(500px); }
          }
          .scan-line { animation: shimmerScan 2s linear infinite; }

          @keyframes phoneGlowPulse {
            0%, 100% { opacity: 0.5; }
            50% { opacity: 1; }
          }
          .phone-receiving { animation: phoneGlowPulse 1s ease-in-out infinite; }

          .tech-slider {
            -webkit-appearance: none;
            width: 100%;
            height: 6px;
            background: rgba(0, 255, 170, 0.2);
            border-radius: 4px;
            outline: none;
            position: relative;
            z-index: 50;
          }
          .tech-slider::-webkit-slider-thumb {
            -webkit-appearance: none;
            width: 32px;
            height: 32px;
            border-radius: 50%;
            background: #00ffa2;
            cursor: pointer;
            box-shadow: 0 0 15px #00ffa2, 0 0 30px rgba(0,255,162,0.5), inset 0 0 8px #fff;
            border: 2px solid #fff;
            transition: transform 0.1s;
          }
          .tech-slider::-webkit-slider-thumb:hover { transform: scale(1.1); }
          
        `}
      </style>

      {/* Main Room Container */}
      <div className="w-full h-full relative">

        {onBack && (
          <button 
            onClick={onBack}
            className="absolute top-6 left-6 z-50 bg-[#111827]/80 backdrop-blur-md border border-[#00ffa2] hover:bg-[#00ffa2]/20 text-[#00ffa2] px-4 py-2 rounded font-mono text-xs uppercase tracking-widest cursor-pointer shadow-[0_0_15px_rgba(0,255,162,0.3)] hover:shadow-[0_0_25px_rgba(0,255,162,0.6)] transition-all font-bold flex items-center gap-2"
          >
            <span className="text-lg leading-none">←</span> Home
          </button>
        )}

        <svg viewBox="0 0 1000 700" className="w-full h-full select-none absolute inset-0" preserveAspectRatio="none">
          <defs>
            {/* Wall Gradient */}
            <linearGradient id="wallGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#F5F0E6" />
              <stop offset="100%" stopColor="#D7CCC8" />
            </linearGradient>

            {/* Ceiling Gradient */}
            <linearGradient id="ceilingGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#FAFAFA" />
              <stop offset="50%" stopColor="#F5F5F5" />
              <stop offset="100%" stopColor="#FAFAFA" />
            </linearGradient>

            {/* Light Cone Gradients */}
            <linearGradient id="activeCone" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#E0F7FA" stopOpacity="0.85" />
              <stop offset="50%" stopColor="#00FFFF" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#00E5FF" stopOpacity="0.0" />
            </linearGradient>

            <linearGradient id="inactiveCone" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FFF9C4" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#FFF9C4" stopOpacity="0.0" />
            </linearGradient>

            {/* Glow Filters */}
            <filter id="glowHeavy" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="10" result="blur" />
              <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
            <filter id="glowLight" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
            
            {/* Floor pattern */}
            <pattern id="woodPattern" width="60" height="20" patternUnits="userSpaceOnUse">
              <rect width="60" height="20" fill="#8D6E63" />
              <path d="M0,0 L60,0 L60,20 L0,20 Z" fill="none" stroke="#795548" strokeWidth="1" />
              <line x1="20" y1="0" x2="20" y2="20" stroke="#795548" strokeWidth="1" opacity="0.5" />
            </pattern>
          </defs>

          {/* ROOM BACKGROUND */}
          <rect x="0" y="0" width="1000" height="700" fill="url(#wallGrad)" />
          
          {/* Ceiling */}
          <rect x="0" y="0" width="1000" height="60" fill="url(#ceilingGrad)" />
          <rect x="0" y="60" width="1000" height="8" fill="#E0E0E0" /> {/* Cornice */}
          
          {/* Floor */}
          <rect x="0" y="600" width="1000" height="100" fill="url(#woodPattern)" />
          <rect x="0" y="585" width="1000" height="15" fill="#FAFAFA" /> {/* Skirting board */}
          <polygon points="0,585 1000,585 1000,600 0,600" fill="#EEEEEE" />

          {/* BACKGROUND LIGHT CONES & HALOS */}
          {cells.map((cell) => {
            const isActive = cell.id === activeCell;
            return (
              <g key={`cone-${cell.id}`}>
                {/* Cone */}
                <polygon 
                  points={`${cell.x - 30},65 ${cell.x + 30},65 ${cell.x + 300},600 ${cell.x - 300},600`}
                  fill={isActive ? "url(#activeCone)" : "url(#inactiveCone)"}
                  className="smooth-opacity"
                  style={{ mixBlendMode: isActive ? 'screen' : 'normal' }}
                />
                
                {/* Shimmer Scan Line (Active Only) */}
                {isActive && (
                  <g>
                    <clipPath id={`clip-${cell.id}`}>
                      <polygon points={`${cell.x - 30},65 ${cell.x + 30},65 ${cell.x + 300},600 ${cell.x - 300},600`} />
                    </clipPath>
                    <line 
                      x1={cell.x - 300} y1="0" x2={cell.x + 300} y2="0" 
                      stroke="#FFFFFF" strokeWidth="15" opacity="0.5" filter="url(#glowLight)"
                      className="scan-line" clipPath={`url(#clip-${cell.id})`}
                    />
                  </g>
                )}

                {/* Ceiling Halo spread */}
                <ellipse 
                  cx={cell.x} cy="60" rx={isActive ? "100" : "50"} ry={isActive ? "30" : "15"}
                  fill={isActive ? "#00FFFF" : "#FFF59D"} opacity={isActive ? "0.3" : "0.1"}
                  filter="url(#glowHeavy)" className="smooth-opacity" style={{ mixBlendMode: 'screen' }}
                />
              </g>
            );
          })}


          {/* LIFI FIXTURES (Hardware) */}
          {cells.map((cell) => {
            const isActive = cell.id === activeCell;
            return (
              <g key={`fixture-${cell.id}`} transform={`translate(${cell.x}, 55)`}>
                {/* Hardware bounding / Ring pulse */}
                {isActive && (
                  <circle cx="0" cy="5" r="20" fill="none" stroke="#00FFFF" strokeWidth="3" className="animate-ring" />
                )}
                
                {/* Silver housing */}
                <ellipse cx="0" cy="0" rx="40" ry="10" fill="#E0E0E0" stroke="#9E9E9E" strokeWidth="1" />
                <ellipse cx="0" cy="4" rx="30" ry="6" fill="#F5F5F5" />
                
                {/* LED Core */}
                <ellipse 
                  cx="0" cy="6" rx="20" ry="4" 
                  fill={isActive ? "#FFFFFF" : "#FFF9C4"} 
                  filter={isActive ? "url(#glowHeavy)" : "url(#glowLight)"}
                  className="smooth-opacity"
                />
                {isActive && <ellipse cx="0" cy="6" rx="10" ry="2" fill="#E0F7FA" />}
                
                {/* Info Label above fixture */}
                <g transform="translate(0, -25)" className="smooth-opacity">
                  <rect x="-40" y="-12" width="80" height="20" rx="4" fill="#212121" opacity="0.8" />
                  <text x="0" y="2" fill="#FFFFFF" fontSize="11" fontFamily="monospace" textAnchor="middle" fontWeight="bold">
                    {cell.label}
                  </text>
                  {isActive && (
                    <g transform="translate(0, -18)">
                      <rect x="-45" y="-10" width="90" height="16" rx="8" fill="#004D40" stroke="#00BFA5" strokeWidth="1" />
                      <circle cx="-35" cy="-2" r="3" fill="#00E676" filter="url(#glowLight)" />
                      <text x="6" y="1" fill="#00E676" fontSize="9" fontFamily="monospace" textAnchor="middle" fontWeight="bold">ACTIVE</text>
                    </g>
                  )}
                </g>
              </g>
            );
          })}


          {/* DUST PARTICLES */}
          <g style={{ mixBlendMode: 'screen' }}>
            {particles.map((p) => (
              <circle
                key={`p-${p.id}`}
                cx={p.x} cy={p.y} r={p.size}
                fill={p.cell === activeCell ? "#00FFFF" : "#FFFFFF"}
                className={`particle-float smooth-opacity ${p.cell === activeCell ? 'opacity-80' : 'opacity-20'}`}
                style={{ animationDelay: p.delay + 's', animationDuration: p.duration + 's' }}
                filter="url(#glowLight)"
              />
            ))}
          </g>

          {/* LIFI SIGNAL BEAMS */}
          <g id="lifi-beams">
            {cells.map((cell) => {
              const isActive = cell.id === activeCell;
              
              if (!isActive) {
                // Inactive Standby Beam (Short, straight down, faint)
                return (
                  <g key={`beam-inactive-${cell.id}`} className="smooth-opacity" opacity="0.15">
                    <line x1={cell.x} y1="65" x2={cell.x} y2="150" stroke="#FFF9C4" strokeWidth="4" filter="url(#glowLight)" />
                    <line x1={cell.x} y1="65" x2={cell.x} y2="200" stroke="#FFF59D" strokeWidth="1" opacity="0.5" strokeDasharray="5 5" />
                  </g>
                );
              }

              // Active Beam routing
              const startX = cell.x;
              const startY = 65;
              const directPath = "M " + startX + " " + startY + " L " + targetX + " " + targetY;

              return (
                <g key={`beam-active-${cell.id}`} className="smooth-opacity">
                  {/* Primary Direct Data Beam ONLY */}
                  <path d={directPath} stroke="#D50000" strokeWidth="14" fill="none" opacity="0.2" filter="url(#glowHeavy)" className="smooth-transform" />
                  <path d={directPath} stroke="#FF1744" strokeWidth="6" fill="none" opacity="0.8" filter="url(#glowLight)" className="smooth-transform" />
                  <path d={directPath} stroke="#FFFFFF" strokeWidth="2.5" fill="none" className="animate-flow smooth-transform" strokeDasharray="12 20" />
                </g>
              );
            })}
          </g>

          {/* CHARACTER & PHONE (Walking animation container) */}
          <g 
            className={"smooth-transform " + (isMoving ? 'walking' : '')}
            style={{ transform: "translateX(" + personX + "px)" }}
          >
            {/* Shadow */}
            <ellipse cx="0" cy="590" rx="30" ry="6" fill="#000000" opacity="0.3" filter="url(#glowLight)" />

            <g className="body-bob">
              
              {/* Back Arm (Swinging opposite to front leg) */}
              <g className="arm-back" transform="translate(5, 430)">
                <line x1="0" y1="0" x2="-10" y2="40" stroke="#374151" strokeWidth="10" strokeLinecap="round" />
              </g>

              {/* Back Leg */}
              <g className="leg-back" transform="translate(0, 480)">
                <line x1="0" y1="0" x2="-15" y2="50" stroke="#1F2937" strokeWidth="12" strokeLinecap="round" />
                <line x1="-15" y1="50" x2="-15" y2="105" stroke="#1F2937" strokeWidth="10" strokeLinecap="round" />
                <ellipse cx="-12" cy="107" rx="8" ry="4" fill="#000000" />
              </g>

              {/* Front Leg */}
              <g className="leg-front" transform="translate(5, 480)">
                <line x1="0" y1="0" x2="15" y2="50" stroke="#374151" strokeWidth="12" strokeLinecap="round" />
                <line x1="15" y1="50" x2="15" y2="105" stroke="#374151" strokeWidth="10" strokeLinecap="round" />
                <ellipse cx="18" cy="107" rx="8" ry="4" fill="#000000" />
              </g>

              {/* Torso/Body */}
              <rect x="-12" y="400" width="26" height="85" rx="10" fill="#3B82F6" />
              <rect x="-12" y="400" width="26" height="25" rx="5" fill="#2563EB" /> {/* Collar/jacket */}
              
              {/* Head */}
              <circle cx="2" cy="365" r="20" fill="#FCA5A5" />
              {/* Hair */}
              <path d="M -16 365 Q 0 335 20 355 Q 22 375 16 365 Q 10 345 -16 365" fill="#111827" />

              {/* Front Arm holding Phone (Static/Raised) */}
              <g transform="translate(5, 420)">
                {/* Upper arm */}
                <line x1="0" y1="0" x2="22" y2="15" stroke="#2563EB" strokeWidth="10" strokeLinecap="round" />
                {/* Forearm raised up */}
                <line x1="22" y1="15" x2="20" y2="-25" stroke="#FCA5A5" strokeWidth="8" strokeLinecap="round" />
                
                {/* Mobile Phone Box relative to hand */}
                <g transform="translate(18, -40)">
                  {/* Phone body */}
                  <rect x="-8" y="-18" width="16" height="30" rx="3" fill="#111827" />
                  {/* Glow on screen from LiFi */}
                  <rect x="-6" y="-16" width="12" height="26" rx="2" fill="#00E5FF" opacity="0.6" className="phone-receiving" />
                </g>
              </g>
            </g>
          </g>

        </svg>

        {/* SLIDER CONTROL AREA: Bottom Center */}
        <div className="absolute bottom-6 left-0 right-0 z-40 flex flex-col items-center px-4">
          <div className="bg-[#1F2937]/90 backdrop-blur-md px-8 py-5 rounded-2xl border border-[#374151] shadow-[0_15px_50px_-10px_rgba(0,0,0,0.6)] flex flex-col items-center w-full max-w-2xl transform transition-transform hover:scale-[1.02]">
            <label className="text-[#00ffa2] font-mono text-[14px] font-bold tracking-widest mb-5 uppercase inline-flex items-center gap-4 drop-shadow-[0_0_8px_rgba(0,255,162,0.6)]">
              <span className="text-xl">←</span>
              Walk Through Room
              <span className="text-xl">→</span>
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={sliderVal}
              onChange={(e) => setSliderVal(Number(e.target.value))}
              onMouseDown={() => setIsMoving(true)}
              onMouseUp={() => setIsMoving(false)}
              onTouchStart={() => setIsMoving(true)}
              onTouchEnd={() => setIsMoving(false)}
              className="tech-slider w-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiFiCellSimulation;
