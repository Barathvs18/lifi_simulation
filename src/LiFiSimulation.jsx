import { useState } from 'react';

// Pre-compute particles outside the component to avoid recreation on every render
const particles = Array.from({ length: 25 }).map((_, i) => ({
  id: i,
  x: 420 + Math.random() * 160,
  y: 60 + Math.random() * 40,
  delay: Math.random() * 3,
  duration: 1.5 + Math.random() * 2,
  size: 0.8 + Math.random() * 2
}));

const LiFiSimulation = ({ onBack }) => {
  const [sliderVal, setSliderVal] = useState(50);
  
  // Calculate precise coordinate mapping based on slider 0-100
  // Safe zone for phone to lie flat in the middle of the floor: X from 250 to 750
  const phoneX = 250 + (sliderVal / 100) * 500;
  
  // Fixed source (LED) and target (Phone Camera Receiver) Y coordinates
  const sourceX = 500;
  const sourceY = 75;
  const targetX = phoneX;
  const targetY = 505; // Matches the top of the phone shape perfectly

  // Helper method to find the point where a beam reflects off a vertical wall
  const getBouncePoint = (wallX) => {
    // Reflect source across wallX
    const apparentSourceX = wallX + (wallX - sourceX);
    // Interpolation factor t where apparent line crosses wallX
    const t = (wallX - apparentSourceX) / (targetX - apparentSourceX);
    // Corresponding Y on the wall boundary
    const intersectY = sourceY + t * (targetY - sourceY);
    return { x: wallX, y: intersectY };
  };

  // Define wall coordinates for reflection calculations
  // We use coordinates perfectly tuned to the rendered trapezoidal walls
  const bL1 = getBouncePoint(150); // Left Back Wall crease
  const bL2 = getBouncePoint(50);  // Left Foreground Wall region
  const bR1 = getBouncePoint(850); // Right Back Wall crease
  const bR2 = getBouncePoint(950); // Right Foreground Wall region
  
  const pathMain = `M ${sourceX} ${sourceY} L ${targetX} ${targetY}`;
  // Reflection paths connecting LED to Wall to Phone
  const pathL1 = `M ${sourceX} ${sourceY} L ${bL1.x} ${bL1.y} L ${targetX} ${targetY}`;
  const pathL2 = `M ${sourceX} ${sourceY} L ${bL2.x} ${bL2.y} L ${targetX} ${targetY}`;
  const pathR1 = `M ${sourceX} ${sourceY} L ${bR1.x} ${bR1.y} L ${targetX} ${targetY}`;
  const pathR2 = `M ${sourceX} ${sourceY} L ${bR2.x} ${bR2.y} L ${targetX} ${targetY}`;

  return (
    <div className="w-full h-screen bg-[#121212] overflow-hidden flex flex-col font-sans relative">
      {/* 
        Tailwind handles basic layout. Custom embedded styles for
        animations and complex slider shadows 
      */}
      <style>
        {`
          .beam-transition {
            transition: d 0.2s ease-out;
          }
          .transform-transition {
            transition: transform 0.2s ease-out;
          }
          .circ-transition {
            transition: cx 0.2s ease-out, cy 0.2s ease-out;
          }
          
          @keyframes dashFlow {
            from { stroke-dashoffset: 60; }
            to { stroke-dashoffset: 0; }
          }
          
          .animate-dash-fast {
            animation: dashFlow 0.8s linear infinite;
          }
          
          .animate-dash-slow {
            animation: dashFlow 1.5s linear infinite;
          }

          @keyframes pulseLed {
            0%, 100% { opacity: 0.85; transform: scale(1); }
            50% { opacity: 1; transform: scale(1.15); }
          }
          
          .led-pulse {
            animation: pulseLed 3s ease-in-out infinite;
            transform-origin: 500px 75px;
          }

          @keyframes floatParticles {
            0% { transform: translateY(0) scale(0.5); opacity: 0; }
            15% { opacity: 0.7; }
            70% { opacity: 0.4; transform: translateY(-30px) scale(1.2); }
            100% { transform: translateY(-45px) scale(0.1); opacity: 0; }
          }
          
          .particle {
            animation: floatParticles linear infinite;
          }

          @keyframes recGlow {
            0%, 100% { opacity: 0.4; }
            50% { opacity: 0.9; }
          }
          
          .receiver-glow {
            animation: recGlow 1.5s ease-in-out infinite;
          }

          .lifi-slider {
            -webkit-appearance: none;
            width: 100%;
            height: 6px;
            background: rgba(255, 69, 0, 0.2);
            border-radius: 4px;
            outline: none;
            position: relative;
            z-index: 10;
          }

          .lifi-slider::-webkit-slider-thumb {
            -webkit-appearance: none;
            appearance: none;
            width: 28px;
            height: 28px;
            border-radius: 50%;
            background: #ff4500;
            cursor: pointer;
            box-shadow: 0 0 10px #ff4500, 0 0 20px #ff1100, inset 0 0 5px rgba(255,255,255,0.6);
            border: 2px solid #fff;
            transition: transform 0.1s ease;
          }

          .lifi-slider::-webkit-slider-thumb:hover {
            transform: scale(1.15);
          }
        `}
      </style>

      {/* Main UI Container / Full Screen App View */}
      <div className="w-full h-full flex flex-col items-center justify-center relative">

        {onBack && (
          <button 
            onClick={onBack}
            className="absolute top-6 left-6 z-50 bg-[#110605]/80 backdrop-blur-md border border-[#ff4500] hover:bg-[#ff4500]/20 text-[#ff4500] px-4 py-2 rounded font-mono text-xs uppercase tracking-widest cursor-pointer shadow-[0_0_15px_rgba(255,69,0,0.3)] hover:shadow-[0_0_25px_rgba(255,69,0,0.6)] transition-all font-bold flex items-center gap-2"
          >
            <span className="text-lg leading-none">←</span> Home
          </button>
        )}

        {/* Core Simulation Room SVG */}
        <svg viewBox="0 0 1000 700" className="w-full h-full select-none absolute inset-0 bg-[#121212]" preserveAspectRatio="none">
          
          {/* DEFINITIONS FOR GLOWS AND FX */}
          <defs>
            <linearGradient id="coneWash" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0.15" />
            </linearGradient>

            <filter id="heavyGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="8" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            
            <filter id="lightGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            <linearGradient id="phoneScreen" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ff4500" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#ff4500" stopOpacity="0.05" />
            </linearGradient>

            <linearGradient id="ledGlow" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="100%" stopColor="#ffefee" />
            </linearGradient>
          </defs>

          {/* ROOM GEOMETRY / WALL STRUCTURE */}
          <g id="walls">
            <polygon points="0,0 150,150 150,550 0,700" fill="#90A4AE" />
            <polygon points="1000,0 850,150 850,550 1000,700" fill="#90A4AE" />
            <polygon points="0,700 150,550 850,550 1000,700" fill="#8D6E63" />
            <polygon points="0,0 150,150 850,150 1000,0" fill="#ECEFF1" />
            
            {/* Back wall */}
            <rect x="150" y="150" width="700" height="400" fill="#CFD8DC" />
            
            {/* Baseboards */}
            <polygon points="0,680 150,535 150,550 0,700" fill="#FAFAFA" />
            <polygon points="1000,680 850,535 850,550 1000,700" fill="#FAFAFA" />
            <rect x="150" y="535" width="700" height="15" fill="#FFFFFF" />

            {/* Wall joins / Creases */}
            <line x1="150" y1="150" x2="150" y2="550" stroke="#000000" strokeWidth="5" opacity="0.15" />
            <line x1="850" y1="150" x2="850" y2="550" stroke="#000000" strokeWidth="5" opacity="0.15" />
            <line x1="150" y1="150" x2="850" y2="150" stroke="#000000" strokeWidth="6" opacity="0.1" />
            <line x1="150" y1="550" x2="850" y2="550" stroke="#000000" strokeWidth="6" opacity="0.15" />
          </g>

          {/* DECORATIVE ELEMENTS */}
          {/* Framed picture left inner wall */}
          <g transform="translate(250, 240)">
            <rect x="0" y="0" width="110" height="140" fill="#3E2723" stroke="#1F100A" strokeWidth="6" rx="2" />
            <rect x="8" y="8" width="94" height="124" fill="#F5F5F5" />
            <circle cx="55" cy="45" r="18" fill="#FFB74D" opacity="0.4" />
            <path d="M 15 110 Q 45 70 95 110" stroke="#8D6E63" strokeWidth="3" fill="none" />
            <path d="M 35 125 L 55 90 L 80 120" stroke="#5D4037" strokeWidth="2" fill="none" />
          </g>

          {/* Bookshelf right inner wall */}
          <g transform="translate(640, 310)">
            <rect x="0" y="0" width="120" height="8" fill="#4E342E" />
            <rect x="10" y="-35" width="10" height="35" fill="#D32F2F" />
            <rect x="22" y="-40" width="14" height="40" fill="#1976D2" />
            <rect x="38" y="-30" width="10" height="30" fill="#388E3C" />
            <polygon points="55,-35 65,-35 80,0 70,0" fill="#FBC02D" />
          </g>

          {/* SUBTLE AMBIENT DIMMING LAYER to darken upper corners not hit by the direct light */}
          <rect x="0" y="0" width="1000" height="700" fill="#000914" opacity="0.4" style={{ mixBlendMode: 'multiply' }} pointerEvents="none" />
          
          {/* STATIC GLOBAL LIGHT WASH */}
          {/* Projects outward from the tubelight covering the entire floor and most of the room walls realistically */}
          <polygon points="340,75 660,75 1000,700 0,700" fill="url(#coneWash)" style={{ mixBlendMode: 'screen' }} />

          {/* LIFI REFLECTED BEAMS */}
          <g id="reflected-beams">
            {/* Left Reflection Track 1 */}
            <path d={pathL1} stroke="#d42a00" strokeWidth="4" fill="none" className="beam-transition" opacity="0.4" filter="url(#heavyGlow)" />
            <path d={pathL1} stroke="#ff6230" strokeWidth="2" fill="none" className="beam-transition animate-dash-slow" strokeDasharray="10 15" />
            <circle cx={bL1.x} cy={bL1.y} r="6" fill="#ff4500" className="opacity-40 circ-transition" filter="url(#lightGlow)" />
            
            {/* Left Reflection Track 2 */}
            <path d={pathL2} stroke="#a31d00" strokeWidth="3" fill="none" className="beam-transition" opacity="0.3" filter="url(#heavyGlow)" />
            <path d={pathL2} stroke="#ff4500" strokeWidth="1.5" fill="none" className="beam-transition animate-dash-slow" strokeDasharray="8 20" />
            <circle cx={bL2.x} cy={bL2.y} r="5" fill="#ff2200" className="opacity-30 circ-transition" filter="url(#lightGlow)" />

            {/* Right Reflection Track 1 */}
            <path d={pathR1} stroke="#d42a00" strokeWidth="4" fill="none" className="beam-transition" opacity="0.4" filter="url(#heavyGlow)" />
            <path d={pathR1} stroke="#ff6230" strokeWidth="2" fill="none" className="beam-transition animate-dash-slow" strokeDasharray="10 15" />
            <circle cx={bR1.x} cy={bR1.y} r="6" fill="#ff4500" className="opacity-40 circ-transition" filter="url(#lightGlow)" />

            {/* Right Reflection Track 2 */}
            <path d={pathR2} stroke="#a31d00" strokeWidth="3" fill="none" className="beam-transition" opacity="0.3" filter="url(#heavyGlow)" />
            <path d={pathR2} stroke="#ff4500" strokeWidth="1.5" fill="none" className="beam-transition animate-dash-slow" strokeDasharray="8 20" />
            <circle cx={bR2.x} cy={bR2.y} r="5" fill="#ff2200" className="opacity-30 circ-transition" filter="url(#lightGlow)" />
          </g>

          {/* MAIN DIRECT LIFI LASER BEAM */}
          <g id="main-beam">
            {/* Outer large diffuse glow */}
            <path d={pathMain} stroke="#ff1100" strokeWidth="18" fill="none" className="beam-transition" opacity="0.25" filter="url(#heavyGlow)" />
            {/* Mid beam glow */}
            <path d={pathMain} stroke="#ff4500" strokeWidth="6" fill="none" className="beam-transition" opacity="0.8" filter="url(#lightGlow)" />
            {/* Core bright pulsing vector line */}
            <path d={pathMain} stroke="#ffffff" strokeWidth="2.5" fill="none" className="beam-transition animate-dash-fast" strokeDasharray="15 25" />
          </g>

          {/* CEILING TUBELIGHT FIXTURE (STATIC) */}
          <g id="led-fixture" transform={`translate(500, 75)`}>
            {/* Halo wide glow behind Tube making it look incredibly bright */}
            <rect x="-220" y="-30" width="440" height="80" rx="40" fill="#ffffff" opacity="0.1" filter="url(#heavyGlow)" />
            <rect x="-180" y="-20" width="360" height="50" rx="25" fill="#ffffff" opacity="0.25" filter="url(#heavyGlow)" />
            <rect x="-150" y="-10" width="300" height="25" rx="12" fill="#ffffff" opacity="0.6" filter="url(#lightGlow)" />
            
            {/* Hardware base mount */}
            <rect x="-160" y="-15" width="320" height="15" rx="4" fill="#B0BEC5" stroke="#78909C" strokeWidth="2" />
            
            {/* Tube ends */}
            <rect x="-155" y="-5" width="10" height="20" rx="2" fill="#607D8B" />
            <rect x="145" y="-5" width="10" height="20" rx="2" fill="#607D8B" />
            
            {/* The Glowing Tube Core (Ultra Bright) */}
            <rect x="-145" y="0" width="290" height="12" rx="6" fill="#FFFFFF" filter="url(#heavyGlow)" />
            <rect x="-145" y="1" width="290" height="10" rx="5" fill="#FFFFFF" filter="url(#lightGlow)" />
            <rect x="-145" y="3" width="290" height="6" rx="3" fill="#FFFFFF" />
            
            {/* LiFi Transceiver element in the center of the tubelight */}
            <rect x="-15" y="0" width="30" height="15" rx="3" fill="#263238" stroke="#000" strokeWidth="1" />
            <circle cx="0" cy="7" r="4" fill="#ff4500" filter="url(#lightGlow)" />
            <circle cx="0" cy="7" r="2" fill="#ffffff" />
          </g>

          {/* FLOATING LIGHT PARTICLES */}
          <g style={{ mixBlendMode: 'screen' }}>
            {particles.map((p) => (
              <circle
                key={p.id}
                cx={p.x}
                cy={p.y}
                r={p.size}
                fill="#ffffff"
                className="particle"
                style={{
                  animationDelay: `${p.delay}s`,
                  animationDuration: `${p.duration}s`
                }}
              />
            ))}
          </g>

          {/* MOBILE DEVICE (PHONE) */}
          {/* Target translation seamlessly aligns with beam target (targetY=505, targetX=phoneX) */}
          <g 
            className="transform-transition" 
            style={{ transform: `translateX(${phoneX}px)` }}
          >
            {/* Phone Base shadow */}
            <ellipse cx="0" cy="620" rx="35" ry="8" fill="#000" opacity="0.7" filter="url(#lightGlow)" />
            
            {/* Phone Body */}
            <rect x="-32" y="505" width="64" height="110" rx="8" fill="#18181a" stroke="#3f3f46" strokeWidth="2" />
            {/* Screen Inner Bezel */}
            <rect x="-28" y="510" width="56" height="100" rx="6" fill="#09090b" />
            
            {/* Screen LiFi Glow Reflection */}
            <rect x="-28" y="510" width="56" height="40" rx="6" fill="url(#phoneScreen)" opacity="0.5" className="receiver-glow" />
            
            {/* Audio Earpiece Line */}
            <line x1="-10" y1="516" x2="10" y2="516" stroke="#222" strokeWidth="2.5" strokeLinecap="round" />
            
            {/* Incoming Beam Target / Camera Sensor Glow */}
            <circle cx="0" cy="505" r="4.5" fill="#ff4500" className="receiver-glow" filter="url(#lightGlow)" />
            <circle cx="0" cy="505" r="2.5" fill="#ffffff" />
            
            {/* Data transfer UI mockup on screen */}
            <rect x="-18" y="535" width="36" height="4" rx="2" fill="#222" />
            <rect x="-18" y="535" width="24" height="4" rx="2" fill="#ff4500" />
            
            <circle cx="-18" cy="550" r="3" fill="#ff4500" />
            <line x1="-12" y1="550" x2="12" y2="550" stroke="#ff4500" strokeWidth="2" strokeDasharray="3 3" opacity="0.6" />
            <circle cx="18" cy="550" r="3" fill="#ff4500" />

            {/* Little indicator light on bottom */}
            <circle cx="0" cy="603" r="1.5" fill="#ff4500" opacity="0.3" />
          </g>
        </svg>

        {/* SLIDER CONTROL AREA */}
        <div className="absolute bottom-8 left-0 right-0 z-20 flex flex-col items-center px-4">
          <div className="bg-[#110605]/80 backdrop-blur-md px-8 py-5 rounded-2xl border border-[#2a1311] shadow-[0_10px_40px_-10px_rgba(255,69,0,0.2)] flex flex-col items-center w-full max-w-xl">
            <label className="text-[#ff4500] font-mono text-[13px] tracking-widest mb-4 uppercase inline-flex items-center gap-3 drop-shadow-[0_0_8px_rgba(255,69,0,0.8)]">
              <span className="text-xl">←</span>
              Move Device
              <span className="text-xl">→</span>
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={sliderVal}
              onChange={(e) => setSliderVal(Number(e.target.value))}
              className="lifi-slider w-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiFiSimulation;
