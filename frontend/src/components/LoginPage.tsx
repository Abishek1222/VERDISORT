import { useState, useEffect } from 'react';
import { ArrowRight, Lock, Mail, UserPlus, LogIn } from 'lucide-react';

interface LoginPageProps {
  onLogin: () => void;
}

// ─── Realistic SVG Leaf definitions ────────────────────────────────────────────
// Each leaf has a realistic organic path (main body), a midrib/vein line, and side veins
const LEAF_DEFS = [
  {
    // Oval tropical leaf
    body: "M0,-40 C12,-38 24,-28 26,-12 C28,4 22,20 14,32 C8,40 0,44 0,44 C0,44 -8,40 -14,32 C-22,20 -28,4 -26,-12 C-24,-28 -12,-38 0,-40 Z",
    midrib: "M0,-40 C1,0 0,44 0,44",
    veins: [
      "M0,-20 C-6,-14 -14,-10 -20,-6",
      "M0,-20 C6,-14 14,-10 20,-6",
      "M0,-4 C-8,2 -18,6 -22,10",
      "M0,-4 C8,2 18,6 22,10",
      "M0,14 C-6,18 -14,22 -18,26",
      "M0,14 C6,18 14,22 18,26",
    ],
    scale: 1,
  },
  {
    // Fiddle leaf / broad leaf
    body: "M0,-50 C20,-45 34,-30 36,-10 C38,10 30,30 18,42 C10,50 0,54 0,54 C0,54 -10,50 -18,42 C-30,30 -38,10 -36,-10 C-34,-30 -20,-45 0,-50 Z",
    midrib: "M0,-50 C1,-5 0,54 0,54",
    veins: [
      "M0,-30 C-8,-22 -20,-16 -28,-10",
      "M0,-30 C8,-22 20,-16 28,-10",
      "M0,-10 C-10,-2 -24,4 -30,10",
      "M0,-10 C10,-2 24,4 30,10",
      "M0,12 C-8,18 -20,26 -24,34",
      "M0,12 C8,18 20,26 24,34",
    ],
    scale: 0.85,
  },
  {
    // Elongated lanceolate leaf
    body: "M0,-60 C8,-55 14,-38 14,-18 C14,4 8,28 4,44 C2,52 0,58 0,58 C0,58 -2,52 -4,44 C-8,28 -14,4 -14,-18 C-14,-38 -8,-55 0,-60 Z",
    midrib: "M0,-60 C0.5,0 0,58 0,58",
    veins: [
      "M0,-38 C-4,-32 -10,-26 -12,-18",
      "M0,-38 C4,-32 10,-26 12,-18",
      "M0,-14 C-5,-6 -12,0 -13,8",
      "M0,-14 C5,-6 12,0 13,8",
      "M0,14 C-4,22 -10,30 -12,38",
      "M0,14 C4,22 10,30 12,38",
    ],
    scale: 0.9,
  },
  {
    // Rounded monstera-ish leaf
    body: "M0,-45 C18,-42 34,-24 36,0 C38,22 26,42 10,52 C4,56 0,58 0,58 C-4,56 -10,52 -18,44 C-30,30 -36,12 -34,-6 C-32,-28 -18,-44 0,-45 Z",
    midrib: "M0,-45 C1,-5 0,58 0,58",
    veins: [
      "M0,-24 C-10,-16 -22,-8 -28,2",
      "M0,-24 C10,-16 22,-8 28,2",
      "M0,4 C-10,12 -22,20 -28,30",
      "M0,4 C10,12 22,20 28,30",
      "M0,28 C-8,34 -16,42 -18,50",
      "M0,28 C8,34 16,42 18,50",
    ],
    scale: 0.92,
  },
];

const NUM_LEAVES = 22;

const LEAVES = Array.from({ length: NUM_LEAVES }, (_, i) => {
  const def = LEAF_DEFS[i % LEAF_DEFS.length];
  const size = 50 + Math.random() * 80;
  return {
    id: i,
    def,
    x: 5 + Math.random() * 90,
    y: -20 + Math.random() * 120,
    size,
    duration: 18 + Math.random() * 22,
    delay: Math.random() * 20,
    startRotation: Math.random() * 360,
    swayAmount: 15 + Math.random() * 25,
    driftX: (Math.random() - 0.5) * 30,
    opacity: 0.55 + Math.random() * 0.4,
    green: Math.floor(120 + Math.random() * 80),
    lightness: 25 + Math.random() * 25,
    zIndex: i % 3,
  };
});

// ─── Animated leaf component ────────────────────────────────────────────────────
function AnimatedLeaf({ leaf }: { leaf: typeof LEAVES[0] }) {
  const color = `hsl(${120 + leaf.lightness / 3}deg, 65%, ${leaf.lightness + 10}%)`;
  const darkColor = `hsl(${115 + leaf.lightness / 3}deg, 55%, ${leaf.lightness - 5}%)`;
  const veinColor = `hsl(${100 + leaf.lightness / 3}deg, 40%, ${leaf.lightness + 30}%)`;

  return (
    <div
      className="absolute pointer-events-none"
      style={{
        left: `${leaf.x}%`,
        top: `${leaf.y}%`,
        width: `${leaf.size}px`,
        height: `${leaf.size * 1.4}px`,
        animation: `leafFloat${leaf.id % 4} ${leaf.duration}s ease-in-out infinite`,
        animationDelay: `-${leaf.delay}s`,
        opacity: leaf.opacity,
        zIndex: leaf.zIndex,
        filter: `drop-shadow(0 4px 8px rgba(0,80,0,0.25))`,
      }}
    >
      <svg
        viewBox="-40 -65 80 130"
        width={leaf.size}
        height={leaf.size * 1.4}
        style={{
          transform: `rotate(${leaf.startRotation}deg)`,
          animation: `leafTilt${leaf.id % 4} ${leaf.duration * 0.7}s ease-in-out infinite`,
          animationDelay: `-${leaf.delay * 0.5}s`,
        }}
      >
        <defs>
          <linearGradient id={`lg${leaf.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={`hsl(${125 + leaf.lightness / 2}deg, 70%, ${leaf.lightness + 20}%)`} />
            <stop offset="50%" stopColor={color} />
            <stop offset="100%" stopColor={darkColor} />
          </linearGradient>
          <filter id={`shadow${leaf.id}`} x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="1" dy="2" stdDeviation="2" floodColor="rgba(0,60,0,0.3)" />
          </filter>
        </defs>
        {/* Leaf body with gradient */}
        <path
          d={leaf.def.body}
          fill={`url(#lg${leaf.id})`}
          filter={`url(#shadow${leaf.id})`}
          transform={`scale(${leaf.def.scale})`}
        />
        {/* Midrib (central vein) */}
        <path
          d={leaf.def.midrib}
          fill="none"
          stroke={veinColor}
          strokeWidth="0.8"
          strokeLinecap="round"
          opacity="0.6"
          transform={`scale(${leaf.def.scale})`}
        />
        {/* Side veins */}
        {leaf.def.veins.map((vein, vi) => (
          <path
            key={vi}
            d={vein}
            fill="none"
            stroke={veinColor}
            strokeWidth="0.45"
            strokeLinecap="round"
            opacity="0.4"
            transform={`scale(${leaf.def.scale})`}
          />
        ))}
      </svg>
    </div>
  );
}

// ─── Marquee Banner — stroke-only + shimmer ────────────────────────────────────
const MARQUEE_TEXT = 'VERDISORT';
const BANNER_H = 90;         // px height
const SVG_FONT_SIZE = 74;    // px — big & bold
const TEXT_WIDTH = 820;      // approximate pixel width per word + gap
const COPIES = 6;            // enough to fill widest screens seamlessly
const TOTAL_W = TEXT_WIDTH * COPIES;

function MarqueeBanner({ direction, speed, flip }: { direction: 'left' | 'right'; speed: number; flip: boolean }) {
  const anim = direction === 'left' ? 'marqueeL' : 'marqueeR';
  const borderSide = flip ? 'borderTop' : 'borderBottom';

  return (
    <div
      className="absolute left-0 right-0 pointer-events-none select-none overflow-hidden"
      style={{
        zIndex: 3,
        height: `${BANNER_H}px`,
        top: flip ? 'auto' : 0,
        bottom: flip ? 0 : 'auto',
        [borderSide]: '1px solid rgba(34,197,94,0.10)',
        background: flip
          ? 'linear-gradient(180deg, rgba(34,197,94,0.04) 0%, transparent 100%)'
          : 'linear-gradient(180deg, transparent 0%, rgba(34,197,94,0.04) 100%)',
      }}
    >
      {/* Two copies side-by-side so the loop is seamless */}
      {[0, 1].map(track => (
        <div
          key={track}
          style={{
            display: 'flex',
            position: 'absolute',
            top: 0,
            left: track === 0 ? 0 : `${TOTAL_W}px`,
            animation: `${anim} ${speed}s linear infinite`,
            animationDelay: track === 1 ? `-${speed / 2}s` : '0s',
            willChange: 'transform',
          }}
        >
          {[...Array(COPIES)].map((_, ci) => (
            <svg
              key={ci}
              width={TEXT_WIDTH}
              height={BANNER_H}
              viewBox={`0 0 ${TEXT_WIDTH} ${BANNER_H}`}
              style={{ flexShrink: 0 }}
            >
              <defs>
                {/* Shimmer gradient — sweeps left-to-right on each copy */}
                <linearGradient id={`shine-${track}-${ci}`} gradientUnits="userSpaceOnUse"
                  x1={`${-TEXT_WIDTH}`} y1="0" x2={`0`} y2="0">
                  <stop offset="40%" stopColor="rgba(34,197,94,0.55)">
                    <animate attributeName="stop-color"
                      values="rgba(34,197,94,0.45);rgba(180,255,200,1);rgba(34,197,94,0.45)"
                      dur={`${speed * 0.55}s`} repeatCount="indefinite"
                      begin={`${ci * 0.6 + track * 0.3}s`} />
                  </stop>
                  <stop offset="50%" stopColor="rgba(200,255,220,0.95)">
                    <animate attributeName="stop-color"
                      values="rgba(200,255,220,0.9);rgba(255,255,255,1);rgba(200,255,220,0.9)"
                      dur={`${speed * 0.55}s`} repeatCount="indefinite"
                      begin={`${ci * 0.6 + track * 0.3}s`} />
                  </stop>
                  <stop offset="60%" stopColor="rgba(34,197,94,0.55)">
                    <animate attributeName="stop-color"
                      values="rgba(34,197,94,0.45);rgba(180,255,200,1);rgba(34,197,94,0.45)"
                      dur={`${speed * 0.55}s`} repeatCount="indefinite"
                      begin={`${ci * 0.6 + track * 0.3}s`} />
                  </stop>
                  <animateTransform attributeName="gradientTransform" type="translate"
                    values={`${-TEXT_WIDTH},0; ${TEXT_WIDTH * 2},0`}
                    dur={`${speed * 0.55}s`} repeatCount="indefinite"
                    begin={`${ci * 0.6 + track * 0.3}s`} />
                </linearGradient>

                {/* Glow filter */}
                <filter id={`glow-${track}-${ci}`} x="-10%" y="-50%" width="120%" height="200%">
                  <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* Base stroke — dim green outline */}
              <text
                x="20" y={SVG_FONT_SIZE + 6}
                fontFamily="'Inter', 'Helvetica Neue', Arial, sans-serif"
                fontWeight="900"
                fontSize={SVG_FONT_SIZE}
                letterSpacing="-1"
                fill="none"
                stroke="rgba(34,197,94,0.22)"
                strokeWidth="1.2"
              >
                {MARQUEE_TEXT}
              </text>

              {/* Shimmer stroke — bright animated gradient */}
              <text
                x="20" y={SVG_FONT_SIZE + 6}
                fontFamily="'Inter', 'Helvetica Neue', Arial, sans-serif"
                fontWeight="900"
                fontSize={SVG_FONT_SIZE}
                letterSpacing="-1"
                fill="none"
                stroke={`url(#shine-${track}-${ci})`}
                strokeWidth="1.2"
                filter={`url(#glow-${track}-${ci})`}
              >
                {MARQUEE_TEXT}
              </text>
            </svg>
          ))}
        </div>
      ))}
    </div>
  );
}

// ─── Main Login Page ────────────────────────────────────────────────────────────
export default function LoginPage({ onLogin }: LoginPageProps) {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [mounted, setMounted] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 80);
    return () => clearTimeout(t);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email || !password) { setError('Please fill in all required fields.'); return; }
    if (mode === 'signup' && password !== confirm) { setError('Passwords do not match.'); return; }
    setLoading(true);
    setTimeout(() => { setLoading(false); onLogin(); }, 1600);
  };

  const switchMode = (m: typeof mode) => { setError(''); setMode(m); };

  return (
    <div className="min-h-screen flex overflow-hidden relative" style={{ background: 'linear-gradient(135deg, #03100a 0%, #051a0c 50%, #041209 100%)' }}>

      {/* ── TOP Scrolling marquee — outline stroke + shimmer ──────────────────── */}
      <MarqueeBanner direction="left" speed={28} flip={false} />

      {/* ── BOTTOM Scrolling marquee — outline stroke + shimmer ───────────────── */}
      <MarqueeBanner direction="right" speed={34} flip />

      {/* ── Animated Leaves background ─────────────────────────────────────────── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 1 }}>
        {LEAVES.map(leaf => <AnimatedLeaf key={leaf.id} leaf={leaf} />)}
      </div>

      {/* ── Ambient glow orbs ──────────────────────────────────────────────────── */}
      <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 1 }}>
        <div className="absolute top-[-15%] left-[-8%] w-[45vw] h-[45vw] rounded-full" style={{ background: 'radial-gradient(circle, rgba(34,197,94,0.11) 0%, transparent 65%)' }} />
        <div className="absolute bottom-[-20%] right-[-5%] w-[55vw] h-[55vw] rounded-full" style={{ background: 'radial-gradient(circle, rgba(16,120,44,0.09) 0%, transparent 65%)' }} />
      </div>

      {/* ── LEFT PANEL — Big VERDISORT branding ────────────────────────────────── */}
      <div className="hidden lg:flex lg:w-[55%] flex-col justify-center pl-16 pr-8 relative" style={{ zIndex: 2 }}>
        {/* Giant VERDISORT letters */}
        <div
          className={`transition-all duration-1000 ${mounted ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12'}`}
        >
          {/* Single-line animated VERDISORT */}
          <div className="mb-6 flex items-baseline" style={{ lineHeight: 1 }}>
            {'VERDISORT'.split('').map((ch, i) => {
              const isGreen = i >= 5; // S-O-R-T
              return (
                <span
                  key={i}
                  className="font-black inline-block"
                  style={{
                    fontSize: 'clamp(52px, 6.8vw, 104px)',
                    letterSpacing: '-0.03em',
                    ...(isGreen ? {
                      background: 'linear-gradient(160deg, #4ade80 0%, #22c55e 50%, #15803d 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                      filter: 'drop-shadow(0 0 18px rgba(34,197,94,0.5))',
                    } : {
                      color: 'rgba(255,255,255,0.93)',
                      textShadow: '0 0 40px rgba(34,197,94,0.07)',
                    }),
                    opacity: mounted ? 1 : 0,
                    transform: mounted ? 'translateY(0)' : 'translateY(28px)',
                    transition: `opacity 0.55s ease, transform 0.55s cubic-bezier(0.34,1.56,0.64,1)`,
                    transitionDelay: `${i * 70}ms`,
                  }}
                >{ch}</span>
              );
            })}
          </div>

          {/* Tagline */}
          <div
            className="mb-10"
            style={{
              opacity: mounted ? 1 : 0,
              transform: mounted ? 'none' : 'translateY(12px)',
              transition: 'all 0.7s ease 0.7s',
            }}
          >
            <div className="w-16 h-0.5 mb-4 rounded-full" style={{ background: 'linear-gradient(90deg, #22c55e, transparent)' }} />
            <p className="text-gray-300 text-lg font-light leading-relaxed">
              Transforming Waste into<br />
              <span style={{ color: '#4ade80' }}>Intelligent Data Streams</span>
            </p>
          </div>

          {/* Stats cards */}
          <div
            className="grid grid-cols-3 gap-3"
            style={{
              opacity: mounted ? 1 : 0,
              transform: mounted ? 'none' : 'translateY(16px)',
              transition: 'all 0.7s ease 0.9s',
            }}
          >
            {[
              { label: 'Waste Classes', value: '7', icon: '🗂️' },
              { label: 'AI Accuracy', value: '97%', icon: '🎯' },
              { label: 'Avg Latency', value: '<2ms', icon: '⚡' },
            ].map(s => (
              <div
                key={s.label}
                className="rounded-2xl p-4 border"
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  borderColor: 'rgba(34,197,94,0.12)',
                  backdropFilter: 'blur(8px)',
                }}
              >
                <div className="text-xl mb-1">{s.icon}</div>
                <div className="text-2xl font-bold" style={{ color: '#4ade80' }}>{s.value}</div>
                <div className="text-xs text-gray-500 mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── RIGHT PANEL — Auth Form ─────────────────────────────────────────────── */}
      <div className="w-full lg:w-[45%] flex items-center justify-center p-6 lg:p-12 relative" style={{ zIndex: 2 }}>
        <div
          className={`w-full max-w-sm transition-all duration-700 delay-300 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
        >
          {/* Mobile logo */}
          <div className="flex lg:hidden items-center justify-center gap-2 mb-8">
            <span className="text-3xl font-black text-white">VERDI<span style={{ color: '#22c55e' }}>SORT</span></span>
          </div>

          {/* Glass card */}
          <div
            className="rounded-3xl p-7 border"
            style={{
              background: 'linear-gradient(160deg, rgba(8,20,12,0.88) 0%, rgba(5,15,9,0.92) 100%)',
              backdropFilter: 'blur(32px)',
              borderColor: 'rgba(34,197,94,0.15)',
              boxShadow: '0 0 0 1px rgba(255,255,255,0.04) inset, 0 32px 64px rgba(0,0,0,0.5), 0 0 40px rgba(34,197,94,0.06)',
            }}
          >
            {/* Tab switcher */}
            <div className="flex gap-1 p-1 rounded-2xl mb-6" style={{ background: 'rgba(0,0,0,0.4)' }}>
              {(['login', 'signup'] as const).map(tab => (
                <button
                  key={tab}
                  id={`tab-${tab}`}
                  onClick={() => switchMode(tab)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300"
                  style={mode === tab ? {
                    background: 'linear-gradient(135deg, #22c55e 0%, #15803d 100%)',
                    color: '#000',
                    boxShadow: '0 4px 16px rgba(34,197,94,0.35)',
                  } : { color: 'rgba(255,255,255,0.35)' }}
                >
                  {tab === 'login' ? <LogIn size={14} /> : <UserPlus size={14} />}
                  {tab === 'login' ? 'Sign In' : 'Sign Up'}
                </button>
              ))}
            </div>

            {/* Error */}
            {error && (
              <div className="mb-4 px-3 py-2.5 rounded-xl text-sm border"
                style={{ background: 'rgba(239,68,68,0.08)', borderColor: 'rgba(239,68,68,0.2)', color: '#f87171' }}>
                {error}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-3.5">
              {mode === 'signup' && (
                <InputField id="name" label="Full Name" type="text" value={name} onChange={setName} placeholder="Jane Doe" />
              )}

              <InputField id="email" label="Email" type="email" value={email} onChange={setEmail}
                placeholder="you@verdisort.ai"
                icon={<Mail size={14} className="text-gray-500" />}
              />

              <InputField id="password" label="Password" type="password" value={password} onChange={setPassword}
                placeholder="••••••••"
                icon={<Lock size={14} className="text-gray-500" />}
              />

              {mode === 'signup' && (
                <InputField id="confirm" label="Confirm Password" type="password" value={confirm} onChange={setConfirm}
                  placeholder="••••••••"
                  icon={<Lock size={14} className="text-gray-500" />}
                />
              )}

              {mode === 'login' && (
                <div className="flex justify-end">
                  <a href="#" className="text-xs" style={{ color: '#4ade80' }}>Forgot password?</a>
                </div>
              )}

              <button
                id="auth-btn"
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 text-sm mt-1 transition-all duration-200 disabled:opacity-60 hover:scale-[1.02] active:scale-[0.98]"
                style={{
                  background: 'linear-gradient(135deg, #22c55e 0%, #15803d 100%)',
                  color: '#000',
                  boxShadow: '0 6px 24px rgba(34,197,94,0.35), inset 0 1px 0 rgba(255,255,255,0.2)',
                }}
              >
                {loading ? (
                  <><div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />Authenticating...</>
                ) : (
                  <>{mode === 'login' ? 'Sign In' : 'Create Account'}<ArrowRight size={16} /></>
                )}
              </button>
            </form>

            <div className="flex items-center gap-3 my-4">
              <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.06)' }} />
              <span className="text-xs text-gray-600">OR</span>
              <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.06)' }} />
            </div>

            <p className="text-center text-sm" style={{ color: 'rgba(255,255,255,0.3)' }}>
              {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
              <button onClick={() => switchMode(mode === 'login' ? 'signup' : 'login')}
                className="font-semibold transition-colors hover:opacity-80"
                style={{ color: '#4ade80' }}>
                {mode === 'login' ? 'Sign Up' : 'Sign In'}
              </button>
            </p>
          </div>

          <p className="text-center text-xs mt-5" style={{ color: 'rgba(255,255,255,0.15)', letterSpacing: '0.15em' }}>
            🌿 Demo: any credentials accepted
          </p>
        </div>
      </div>

      {/* ── Keyframe animations ─────────────────────────────────────────────────── */}
      <style>{`
        @keyframes leafFloat0 {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          33%       { transform: translateY(-22px) translateX(8px); }
          66%       { transform: translateY(-10px) translateX(-6px); }
        }
        @keyframes leafFloat1 {
          0%, 100% { transform: translateY(0px) translateX(0px) rotate(0deg); }
          40%       { transform: translateY(-18px) translateX(-10px) rotate(5deg); }
          70%       { transform: translateY(-28px) translateX(5px) rotate(-3deg); }
        }
        @keyframes leafFloat2 {
          0%, 100% { transform: translateY(0px) scale(1); }
          50%       { transform: translateY(-24px) scale(1.04); }
        }
        @keyframes leafFloat3 {
          0%, 100% { transform: translateX(0px) translateY(0px) rotate(0deg); }
          25%       { transform: translateX(10px) translateY(-12px) rotate(4deg); }
          75%       { transform: translateX(-8px) translateY(-20px) rotate(-4deg); }
        }
        @keyframes leafTilt0 {
          0%, 100% { transform: rotate(var(--sr,0deg)) rotateY(0deg); }
          50%       { transform: rotate(var(--sr,0deg)) rotateY(25deg); }
        }
        @keyframes leafTilt1 {
          0%, 100% { transform: rotate(var(--sr,0deg)) rotateX(0deg) rotateY(0deg); }
          50%       { transform: rotate(var(--sr,0deg)) rotateX(15deg) rotateY(-20deg); }
        }
        @keyframes leafTilt2 {
          0%, 100% { transform: rotate(var(--sr,0deg)) rotateY(0deg) rotateX(0deg); }
          50%       { transform: rotate(var(--sr,0deg)) rotateY(-30deg) rotateX(10deg); }
        }
        @keyframes leafTilt3 {
          0%, 100% { transform: rotate(var(--sr,0deg)) rotateY(0deg); }
          33%       { transform: rotate(var(--sr,0deg)) rotateY(20deg); }
          66%       { transform: rotate(var(--sr,0deg)) rotateY(-15deg); }
        }
        @keyframes marqueeL {
          0%   { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        @keyframes marqueeR {
          0%   { transform: translateX(-50%); }
          100% { transform: translateX(0%); }
        }
        @keyframes shimmerSweep {
          0%   { stop-color: rgba(74,222,128,0.25); }
          50%  { stop-color: rgba(200,255,220,0.95); }
          100% { stop-color: rgba(74,222,128,0.25); }
        }
        @keyframes shimmerMove {
          0%   { x1: -100%; x2: 0%; }
          100% { x1: 100%; x2: 200%; }
        }
      `}</style>
    </div>
  );
}

// ─── Reusable Input Field ───────────────────────────────────────────────────────
function InputField({ id, label, type, value, onChange, placeholder, icon }: {
  id: string; label: string; type: string;
  value: string; onChange: (v: string) => void;
  placeholder: string; icon?: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-xs font-semibold mb-1.5 uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.35)' }}>
        {label}
      </label>
      <div className="relative">
        {icon && <div className="absolute left-3.5 top-1/2 -translate-y-1/2">{icon}</div>}
        <input
          id={id}
          type={type}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full text-white text-sm rounded-xl py-3 outline-none transition-all duration-200 placeholder:text-gray-700"
          style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)',
            paddingLeft: icon ? '2.5rem' : '1rem',
            paddingRight: '1rem',
          }}
          onFocus={e => { e.target.style.borderColor = 'rgba(34,197,94,0.5)'; e.target.style.background = 'rgba(34,197,94,0.04)'; }}
          onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.08)'; e.target.style.background = 'rgba(255,255,255,0.04)'; }}
        />
      </div>
    </div>
  );
}
