import { useState, useEffect } from 'react';
import { ArrowRight, Lock, Mail, Shield } from 'lucide-react';

interface LoginPageProps {
  onLogin: (role: 'Admin' | 'Citizen') => void;
}

// ─── MarqueeBanner — stroke-only shimmer text, half-visible at edges ───────────
const MARQUEE_TEXT = 'VERDISORT';
const BANNER_H = 90;
const SVG_FONT_SIZE = 74;
const TEXT_WIDTH = 820;
const COPIES = 6;
const TOTAL_W = TEXT_WIDTH * COPIES;

function MarqueeBanner({ direction, speed, flip }: { direction: 'left' | 'right'; speed: number; flip: boolean; }) {
  const anim = direction === 'left' ? 'marqueeL' : 'marqueeR';
  const borderSide = flip ? 'borderTop' : 'borderBottom';
  const HALF = Math.round(BANNER_H / 2);
  const viewBoxY = flip ? 0 : HALF;

  return (
    <div className="absolute left-0 right-0 pointer-events-none select-none overflow-hidden"
      style={{
        zIndex: 3, height: `${HALF}px`, top: flip ? 'auto' : 0, bottom: flip ? 0 : 'auto',
        [borderSide]: '1px solid rgba(34,197,94,0.12)',
        background: flip ? 'linear-gradient(180deg, rgba(34,197,94,0.05) 0%, transparent 100%)' : 'linear-gradient(180deg, transparent 0%, rgba(34,197,94,0.05) 100%)',
      }}>
      {[0, 1].map(track => (
        <div key={track} style={{
          display: 'flex', position: 'absolute', top: 0, left: track === 0 ? 0 : `${TOTAL_W}px`,
          animation: `${anim} ${speed}s linear infinite`, animationDelay: track === 1 ? `-${speed / 2}s` : '0s', willChange: 'transform',
        }}>
          {[...Array(COPIES)].map((_, ci) => (
            <svg key={ci} width={TEXT_WIDTH} height={HALF} viewBox={`0 ${viewBoxY} ${TEXT_WIDTH} ${HALF}`} style={{ flexShrink: 0 }}>
              <defs>
                <linearGradient id={`shine-${flip ? 'b' : 't'}-${track}-${ci}`} gradientUnits="userSpaceOnUse" x1={`${-TEXT_WIDTH}`} y1="0" x2="0" y2="0">
                  <stop offset="40%" stopColor="rgba(34,197,94,0.45)">
                    <animate attributeName="stop-color" values="rgba(34,197,94,0.45);rgba(180,255,200,1);rgba(34,197,94,0.45)" dur={`${speed * 0.55}s`} repeatCount="indefinite" begin={`${ci * 0.6 + track * 0.3}s`} />
                  </stop>
                  <stop offset="50%" stopColor="rgba(200,255,220,0.95)">
                    <animate attributeName="stop-color" values="rgba(200,255,220,0.9);rgba(255,255,255,1);rgba(200,255,220,0.9)" dur={`${speed * 0.55}s`} repeatCount="indefinite" begin={`${ci * 0.6 + track * 0.3}s`} />
                  </stop>
                  <stop offset="60%" stopColor="rgba(34,197,94,0.45)">
                    <animate attributeName="stop-color" values="rgba(34,197,94,0.45);rgba(180,255,200,1);rgba(34,197,94,0.45)" dur={`${speed * 0.55}s`} repeatCount="indefinite" begin={`${ci * 0.6 + track * 0.3}s`} />
                  </stop>
                  <animateTransform attributeName="gradientTransform" type="translate" values={`${-TEXT_WIDTH},0; ${TEXT_WIDTH * 2},0`} dur={`${speed * 0.55}s`} repeatCount="indefinite" begin={`${ci * 0.6 + track * 0.3}s`} />
                </linearGradient>
                <filter id={`glow-${flip ? 'b' : 't'}-${track}-${ci}`} x="-10%" y="-50%" width="120%" height="200%">
                  <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
                  <feMerge><feMergeNode in="blur" /><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                </filter>
              </defs>
              <text x="20" y={SVG_FONT_SIZE + 6} fontFamily="'Inter','Helvetica Neue',Arial,sans-serif" fontWeight="900" fontSize={SVG_FONT_SIZE} letterSpacing="-1" fill="none" stroke="rgba(34,197,94,0.2)" strokeWidth="1.2">{MARQUEE_TEXT}</text>
              <text x="20" y={SVG_FONT_SIZE + 6} fontFamily="'Inter','Helvetica Neue',Arial,sans-serif" fontWeight="900" fontSize={SVG_FONT_SIZE} letterSpacing="-1" fill="none" stroke={`url(#shine-${flip ? 'b' : 't'}-${track}-${ci})`} strokeWidth="1.2" filter={`url(#glow-${flip ? 'b' : 't'}-${track}-${ci})`}>{MARQUEE_TEXT}</text>
            </svg>
          ))}
        </div>
      ))}
    </div>
  );
}

// ─── Main Login Page ────────────────────────────────────────────────────────────
export default function LoginPage({ onLogin }: LoginPageProps) {
  const [role, setRole] = useState<'Citizen' | 'Admin'>('Citizen');
  const [phase, setPhase] = useState(0); 
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 100);
    const t2 = setTimeout(() => setPhase(2), 1100);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email || !password) { setError('Please enter credentials.'); return; }
    setLoading(true);
    setTimeout(() => { setLoading(false); onLogin(role); }, 1400);
  };

  const LETTERS = 'VERDISORT'.split('');

  return (
    <div className="min-h-screen flex overflow-hidden relative" style={{ background: 'linear-gradient(135deg, #03100a 0%, #051a0c 50%, #041209 100%)' }}>
      <MarqueeBanner direction="left" speed={28} flip={false} />
      <MarqueeBanner direction="right" speed={34} flip />

      <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 0 }}>
        <div className="absolute top-[-20%] left-[-10%] w-[55vw] h-[55vw] rounded-full" style={{ background: 'radial-gradient(circle, rgba(34,197,94,0.13) 0%, transparent 65%)' }} />
        <div className="absolute bottom-[-20%] right-[-8%] w-[60vw] h-[60vw] rounded-full" style={{ background: 'radial-gradient(circle, rgba(22,163,74,0.09) 0%, transparent 65%)' }} />
        <div className="absolute top-[40%] right-[25%] w-[25vw] h-[25vw] rounded-full" style={{ background: 'radial-gradient(circle, rgba(74,222,128,0.06) 0%, transparent 65%)' }} />
      </div>

      {/* ── LEFT PANEL — Animated VERDISORT ────────────────────────────────────── */}
      <div className="hidden lg:flex lg:w-[55%] flex-col justify-center pl-16 pr-8 relative" style={{ zIndex: 2 }}>
        <div>
          <div className="flex items-baseline mb-2" style={{ lineHeight: 1 }}>
            {LETTERS.map((ch, i) => {
              const isGreen = i >= 5;

              // Custom styling for the letter 'I' to have a leaf dot
              if (ch === 'I') {
                return (
                  <span
                    key={i}
                    className="relative inline-flex flex-col items-center justify-end font-black"
                    style={{
                      height: 'clamp(56px, 7vw, 110px)',
                      width: 'clamp(20px, 3.5vw, 50px)',
                      marginRight: 'clamp(4px, 0.5vw, 10px)',
                      opacity: phase >= 1 ? 1 : 0,
                      transform: phase >= 1 ? 'translateY(0) scale(1)' : 'translateY(40px) scale(0.85)',
                      transition: `opacity 0.5s ease, transform 0.65s cubic-bezier(0.34,1.56,0.64,1)`,
                      transitionDelay: `${i * 75}ms`,
                    }}
                  >
                    <svg 
                      viewBox="0 0 24 24" 
                      fill="url(#leafGradBase)" 
                      className="absolute top-0 w-[42%] h-auto drop-shadow-[0_0_12px_rgba(34,197,94,0.7)] animate-float-leaf"
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
                      className="w-[32%] bg-white rounded-sm drop-shadow-[0_0_20px_rgba(34,197,94,0.15)]" 
                      style={{ height: '70%', background: 'rgba(255,255,255,0.93)' }} 
                    />
                  </span>
                );
              }

              return (
                <span key={i} className="font-black inline-block" style={{
                  fontSize: 'clamp(56px, 7vw, 110px)', letterSpacing: '-0.035em',
                  ...(isGreen ? { background: 'linear-gradient(160deg, #4ade80 0%, #22c55e 55%, #15803d 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', filter: 'drop-shadow(0 0 20px rgba(34,197,94,0.55))' } 
                             : { color: 'rgba(255,255,255,0.93)', textShadow: '0 0 50px rgba(34,197,94,0.07)' }),
                  opacity: phase >= 1 ? 1 : 0, transform: phase >= 1 ? 'translateY(0) scale(1)' : 'translateY(40px) scale(0.85)',
                  transition: `opacity 0.5s ease, transform 0.65s cubic-bezier(0.34,1.56,0.64,1)`, transitionDelay: `${i * 75}ms`,
                }}>{ch}</span>
              );
            })}
          </div>

          <div style={{ height: '3px', borderRadius: '99px', background: 'linear-gradient(90deg, #22c55e, rgba(34,197,94,0.2), transparent)', width: phase >= 2 ? '100%' : '0%', transition: 'width 0.9s cubic-bezier(0.4,0,0.2,1)', marginBottom: '28px' }} />

          <div style={{ opacity: phase >= 2 ? 1 : 0, transform: phase >= 2 ? 'translateY(0)' : 'translateY(14px)', transition: 'all 0.7s ease 0.1s', marginBottom: '36px' }}>
            <p className="text-gray-300 text-xl font-light leading-snug">
              Transforming Waste into<br /> <span style={{ color: '#4ade80', fontWeight: 500 }}>Intelligent Data Streams</span>
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3" style={{ opacity: phase >= 2 ? 1 : 0, transform: phase >= 2 ? 'translateY(0)' : 'translateY(20px)', transition: 'all 0.7s ease 0.25s' }}>
            {[{ label: 'Waste Classes', value: '7', icon: '🗂️' }, { label: 'AI Accuracy', value: '97%', icon: '🎯' }, { label: 'Avg Latency', value: '<2ms', icon: '⚡' }].map(s => (
              <div key={s.label} className="rounded-2xl p-4 border" style={{ background: 'rgba(255,255,255,0.025)', borderColor: 'rgba(34,197,94,0.12)', backdropFilter: 'blur(10px)' }}>
                <div className="text-xl mb-1">{s.icon}</div>
                <div className="text-2xl font-bold" style={{ color: '#4ade80' }}>{s.value}</div>
                <div className="text-xs text-gray-500 mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="w-full lg:w-[45%] flex items-center justify-center p-6 lg:p-12 relative" style={{ zIndex: 2 }}>
        <div className="w-full max-w-sm" style={{ opacity: phase >= 2 ? 1 : 0, transform: phase >= 2 ? 'translateY(0)' : 'translateY(24px)', transition: 'all 0.7s ease 0.35s' }}>
          
          <div className="rounded-3xl p-7 border" style={{ background: 'linear-gradient(160deg, rgba(8,20,12,0.90) 0%, rgba(5,14,9,0.95) 100%)', backdropFilter: 'blur(36px)', borderColor: 'rgba(34,197,94,0.14)', boxShadow: '0 0 0 1px rgba(255,255,255,0.04) inset, 0 32px 64px rgba(0,0,0,0.55), 0 0 50px rgba(34,197,94,0.05)' }}>
            
            <div className="mb-6">
              <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3 block">Access Level</p>
              <div className="grid grid-cols-2 gap-2">
                {(['Citizen', 'Admin'] as const).map(r => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => { setRole(r); setError(''); }}
                    className={`flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all duration-300 border ${
                      role === r 
                        ? 'border-green-500/50 bg-green-500/10 text-green-400 shadow-[0_0_15px_rgba(34,197,94,0.2)]' 
                        : 'border-white/5 bg-white/5 text-gray-400 hover:bg-white/10'
                    }`}
                  >
                    {r === 'Admin' ? <Shield size={16} /> : <span className="text-[14px]">🏙️</span>}
                    {r} View
                  </button>
                ))}
              </div>
            </div>

            {error && <div className="mb-4 px-3 py-2.5 rounded-xl text-sm border" style={{ background: 'rgba(239,68,68,0.08)', borderColor: 'rgba(239,68,68,0.2)', color: '#f87171' }}>{error}</div>}

            <form onSubmit={handleSubmit} className="space-y-3.5 mt-2">
              <InputField id="email" label={`${role} ID / Email`} type="email" value={email} onChange={setEmail} placeholder={role === 'Admin' ? "operator@verdisort.ai" : "user@app.com"} icon={<Mail size={14} className="text-gray-500" />} />
              <InputField id="password" label="Passkey" type="password" value={password} onChange={setPassword} placeholder="••••••••" icon={<Lock size={14} className="text-gray-500" />} />
              
              <button disabled={loading} className="w-full py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 text-sm mt-5 transition-all duration-200 disabled:opacity-60 hover:scale-[1.02] active:scale-[0.98]" style={{ background: 'linear-gradient(135deg, #22c55e 0%, #15803d 100%)', color: '#000', boxShadow: '0 6px 24px rgba(34,197,94,0.35), inset 0 1px 0 rgba(255,255,255,0.2)' }}>
                {loading ? <><div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />Authenticating...</> : <>{`Enter ${role} Portal`} <ArrowRight size={16} /></>}
              </button>
            </form>
          </div>

          <p className="text-center text-xs mt-5" style={{ color: 'rgba(255,255,255,0.13)', letterSpacing: '0.15em' }}>🌿 Demo: enter any credentials</p>
        </div>
      </div>

      <style>{`
        @keyframes marqueeL { 0% { transform: translateX(0%); } 100% { transform: translateX(-50%); } }
        @keyframes marqueeR { 0% { transform: translateX(-50%); } 100% { transform: translateX(0%); } }
      `}</style>
    </div>
  );
}

function InputField({ id, label, type, value, onChange, placeholder, icon }: { id: string; label: string; type: string; value: string; onChange: (v: string) => void; placeholder: string; icon?: React.ReactNode; }) {
  return (
    <div>
      <label htmlFor={id} className="block text-xs font-semibold mb-1.5 uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.35)' }}>{label}</label>
      <div className="relative">
        {icon && <div className="absolute left-3.5 top-1/2 -translate-y-1/2">{icon}</div>}
        <input id={id} type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} className="w-full text-white text-sm rounded-xl py-3 outline-none transition-all duration-200 placeholder:text-gray-700" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', paddingLeft: icon ? '2.5rem' : '1rem', paddingRight: '1rem' }} onFocus={e => { e.target.style.borderColor = 'rgba(34,197,94,0.5)'; e.target.style.background = 'rgba(34,197,94,0.04)'; }} onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.08)'; e.target.style.background = 'rgba(255,255,255,0.04)'; }} />
      </div>
    </div>
  );
}
