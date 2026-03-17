import { useState, useEffect } from 'react';

// Stage flow:
//  'idle'    — leaf floats + pulses, waiting for click
//  'burst'   — leaf explodes outward on click (scale + glow)
//  'reveal'  — VERDISORT letters bloom from center one by one
//  'exit'    — whole splash fades out, login fades in

type Stage = 'idle' | 'burst' | 'reveal' | 'exit';

interface SplashProps {
  onDone: () => void;
}

export default function SplashScreen({ onDone }: SplashProps) {
  const [stage, setStage] = useState<Stage>('idle');
  const [visibleLetters, setVisibleLetters] = useState(0);
  const [hint, setHint] = useState(false);

  // Show "click" hint after 1.5s
  useEffect(() => {
    const t = setTimeout(() => setHint(true), 1500);
    return () => clearTimeout(t);
  }, []);

  const handleClick = () => {
    if (stage !== 'idle') return;
    setStage('burst');

    // After burst expand (500ms) → start letter reveals
    setTimeout(() => {
      setStage('reveal');

      const LETTERS = 'VERDISORT'.length;
      for (let i = 0; i <= LETTERS; i++) {
        setTimeout(() => setVisibleLetters(i), i * 90);
      }

      // After all letters visible → exit
      setTimeout(() => {
        setStage('exit');
        setTimeout(onDone, 900); // let exit animation finish
      }, LETTERS * 90 + 700);

    }, 500);
  };

  const LETTERS = 'VERDISORT'.split('');

  return (
    <div
      className="fixed inset-0 flex items-center justify-center overflow-hidden select-none"
      style={{
        background: '#040c05',
        zIndex: 100,
        opacity: stage === 'exit' ? 0 : 1,
        transition: stage === 'exit' ? 'opacity 0.85s ease' : 'none',
      }}
      onClick={handleClick}
    >
      {/* ── Star/particle field ─────────────────────────────────────────────────── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(60)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              width: `${1 + Math.random() * 2}px`,
              height: `${1 + Math.random() * 2}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              background: '#22c55e',
              opacity: 0.05 + Math.random() * 0.15,
              animation: `twinkle ${3 + Math.random() * 5}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          />
        ))}
      </div>

      {/* ── Burst radial glow ───────────────────────────────────────────────────── */}
      <div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: stage === 'burst' || stage === 'reveal' || stage === 'exit' ? '200vmax' : '0',
          height: stage === 'burst' || stage === 'reveal' || stage === 'exit' ? '200vmax' : '0',
          background: 'radial-gradient(circle, rgba(34,197,94,0.18) 0%, rgba(34,197,94,0.06) 30%, transparent 65%)',
          transition: 'width 0.6s cubic-bezier(0.16,1,0.3,1), height 0.6s cubic-bezier(0.16,1,0.3,1)',
        }}
      />

      {/* ── Shockwave ring ─────────────────────────────────────────────────────── */}
      {(stage === 'burst' || stage === 'reveal') && (
        <div
          className="absolute rounded-full pointer-events-none"
          style={{
            border: '2px solid rgba(34,197,94,0.5)',
            animation: 'shockwave 0.7s ease-out forwards',
          }}
        />
      )}

      {/* ── The Leaf (idle + burst) ─────────────────────────────────────────────── */}
      <div
        className="absolute flex items-center justify-center pointer-events-none"
        style={{
          transform: stage === 'burst' ? 'scale(12) rotate(15deg)' :
                     stage === 'reveal' || stage === 'exit' ? 'scale(20) rotate(20deg)' :
                     'scale(1) rotate(0deg)',
          opacity: stage === 'reveal' || stage === 'exit' ? 0 : 1,
          transition: stage === 'burst'
            ? 'transform 0.5s cubic-bezier(0.16,1,0.3,1), opacity 0.2s ease 0.35s'
            : stage === 'idle'
              ? 'none'
              : 'opacity 0.15s ease, transform 0.5s ease',
        }}
      >
        {/* Outer glow rings */}
        {stage === 'idle' && [1, 2, 3].map(ring => (
          <div
            key={ring}
            className="absolute rounded-full pointer-events-none"
            style={{
              width: `${180 + ring * 60}px`,
              height: `${180 + ring * 60}px`,
              border: `1px solid rgba(34,197,94,${0.15 - ring * 0.04})`,
              animation: `pulseRing ${2 + ring * 0.8}s ease-in-out infinite`,
              animationDelay: `${ring * 0.3}s`,
            }}
          />
        ))}

        {/* Main leaf SVG */}
        <div
          className="relative"
          style={{
            animation: stage === 'idle' ? 'leafBreathe 3s ease-in-out infinite, leafSway 5s ease-in-out infinite' : 'none',
            cursor: stage === 'idle' ? 'pointer' : 'default',
            filter: stage === 'idle'
              ? 'drop-shadow(0 0 30px rgba(34,197,94,0.6)) drop-shadow(0 0 60px rgba(34,197,94,0.3))'
              : 'drop-shadow(0 0 60px rgba(34,197,94,1))',
          }}
        >
          <svg width="180" height="240" viewBox="-50 -80 100 160">
            <defs>
              <linearGradient id="leafGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#4ade80" />
                <stop offset="45%" stopColor="#22c55e" />
                <stop offset="100%" stopColor="#15803d" />
              </linearGradient>
              <linearGradient id="leafShine" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="rgba(255,255,255,0)" />
                <stop offset="48%" stopColor="rgba(255,255,255,0.18)" />
                <stop offset="100%" stopColor="rgba(255,255,255,0)" />
              </linearGradient>
              <filter id="leafGlow">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feMerge><feMergeNode in="blur"/><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
              </filter>
            </defs>

            {/* Leaf body */}
            <path
              d="M0,-75 C22,-68 42,-48 44,-20 C46,10 36,38 22,56 C12,68 0,74 0,74 C0,74 -12,68 -22,56 C-36,38 -46,10 -44,-20 C-42,-48 -22,-68 0,-75 Z"
              fill="url(#leafGrad)"
              filter="url(#leafGlow)"
              opacity="0.95"
            />
            {/* Shine overlay */}
            <path
              d="M0,-75 C22,-68 42,-48 44,-20 C46,10 36,38 22,56 C12,68 0,74 0,74 C0,74 -12,68 -22,56 C-36,38 -46,10 -44,-20 C-42,-48 -22,-68 0,-75 Z"
              fill="url(#leafShine)"
            />
            {/* Midrib */}
            <path d="M0,-75 C1,-20 0,74 0,74" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="1.2" strokeLinecap="round" />
            {/* Side veins */}
            {[
              ["M0,-45 C-10,-35 -28,-28 -36,-18", "M0,-45 C10,-35 28,-28 36,-18"],
              ["M0,-20 C-12,-8 -32,0 -40,10",     "M0,-20 C12,-8 32,0 40,10"],
              ["M0,10  C-10,20 -26,28 -32,38",    "M0,10  C10,20 26,28 32,38"],
            ].flat().map((d, i) => (
              <path key={i} d={d} fill="none" stroke="rgba(255,255,255,0.22)" strokeWidth="0.7" strokeLinecap="round" />
            ))}
          </svg>
        </div>
      </div>

      {/* ── VERDISORT text reveal ───────────────────────────────────────────────── */}
      {(stage === 'reveal' || stage === 'exit') && (
        <div className="absolute flex items-baseline" style={{ zIndex: 10, lineHeight: 1 }}>
          {LETTERS.map((ch, i) => {
            const isGreen = i >= 5;
            
            // Custom styling for the letter 'I' to have a leaf dot
            if (ch === 'I') {
              return (
                <span
                  key={i}
                  className="relative inline-flex flex-col items-center justify-end font-black"
                  style={{
                    height: 'clamp(48px, 8vw, 120px)',
                    width: 'clamp(20px, 3.5vw, 50px)',
                    marginRight: 'clamp(4px, 0.5vw, 10px)',
                    opacity: visibleLetters > i ? 1 : 0,
                    transform: visibleLetters > i
                      ? 'translateY(0) scale(1)'
                      : 'translateY(30px) scale(0.7)',
                    transition: 'opacity 0.35s ease, transform 0.5s cubic-bezier(0.34,1.56,0.64,1)',
                  }}
                >
                    <svg 
                      viewBox="0 0 24 24" 
                      fill="url(#leafGradBase)" 
                      className="absolute top-0 w-[40%] h-auto drop-shadow-[0_0_12px_rgba(34,197,94,0.8)] animate-float-leaf"
                      style={{ transform: 'translateY(-20%) rotate(15deg)' }}
                    >
                    <defs>
                      <linearGradient id="leafGradBase" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#4ade80" />
                        <stop offset="100%" stopColor="#15803d" />
                      </linearGradient>
                    </defs>
                    <path d="M2 22 C2 22 0 10 8 4 C15 -1 22 2 22 2 C22 2 24 14 16 20 C9 25 2 22 2 22 Z" />
                  </svg>
                  {/* The stem of the 'I' */}
                  <div 
                    className="w-[30%] bg-white rounded-sm drop-shadow-[0_0_20px_rgba(34,197,94,0.2)]" 
                    style={{ height: '70%' }} 
                  />
                </span>
              );
            }

            return (
              <span
                key={i}
                className="font-black inline-block"
                style={{
                  fontSize: 'clamp(48px, 8vw, 120px)',
                  letterSpacing: '-0.035em',
                  ...(isGreen ? {
                    background: 'linear-gradient(160deg, #4ade80, #22c55e, #15803d)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    filter: 'drop-shadow(0 0 20px rgba(34,197,94,0.7))',
                  } : {
                    color: '#fff',
                    textShadow: '0 0 30px rgba(34,197,94,0.3)',
                  }),
                  opacity: visibleLetters > i ? 1 : 0,
                  transform: visibleLetters > i
                    ? 'translateY(0) scale(1)'
                    : 'translateY(30px) scale(0.7)',
                  transition: 'opacity 0.35s ease, transform 0.5s cubic-bezier(0.34,1.56,0.64,1)',
                }}
              >
                {ch}
              </span>
            );
          })}
        </div>
      )}

      {/* ── Tagline under letters ───────────────────────────────────────────────── */}
      {(stage === 'reveal' || stage === 'exit') && (
        <div
          className="absolute text-center"
          style={{
            top: '58%',
            opacity: visibleLetters >= 9 ? 1 : 0,
            transform: visibleLetters >= 9 ? 'translateY(0)' : 'translateY(10px)',
            transition: 'all 0.5s ease 0.2s',
          }}
        >
          <p className="text-sm font-medium tracking-widest uppercase"
            style={{ color: 'rgba(74,222,128,0.7)', letterSpacing: '0.3em' }}>
            AI Waste Intelligence
          </p>
        </div>
      )}

      {/* ── Click hint (idle) ───────────────────────────────────────────────────── */}
      {stage === 'idle' && (
        <div
          className="absolute text-center pointer-events-none"
          style={{
            bottom: '15%',
            opacity: hint ? 1 : 0,
            transform: hint ? 'translateY(0)' : 'translateY(8px)',
            transition: 'all 0.6s ease',
          }}
        >
          <p className="text-sm font-medium tracking-widest"
            style={{ color: 'rgba(255,255,255,0.3)', letterSpacing: '0.2em' }}>
            TAP TO ENTER
          </p>
          <div className="flex justify-center mt-3">
            <div style={{ animation: 'bounceArrow 1.5s ease-in-out infinite' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M12 5v14M5 12l7 7 7-7" stroke="rgba(34,197,94,0.5)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
        </div>
      )}

      {/* ── Keyframes ─────────────────────────────────────────────────────────── */}
      <style>{`
        @keyframes leafBreathe {
          0%, 100% { transform: scale(1); }
          50%       { transform: scale(1.06); }
        }
        @keyframes leafSway {
          0%, 100% { transform: rotate(-4deg); }
          50%       { transform: rotate(4deg); }
        }
        @keyframes pulseRing {
          0%, 100% { opacity: 0.6; transform: scale(1); }
          50%       { opacity: 0.15; transform: scale(1.08); }
        }
        @keyframes twinkle {
          0%, 100% { opacity: 0.05; transform: scale(1); }
          50%       { opacity: 0.4; transform: scale(1.5); }
        }
        @keyframes shockwave {
          0%   { width: 40px; height: 40px; opacity: 1; }
          100% { width: 600px; height: 600px; opacity: 0; }
        }
        @keyframes bounceArrow {
          0%, 100% { transform: translateY(0); }
          50%       { transform: translateY(6px); }
        }
      `}</style>
    </div>
  );
}
