import { useState, useEffect } from 'react';
import { Leaf, Wifi, WifiOff, User } from 'lucide-react';

interface HeaderProps {
  onProfileClick: () => void;
}

export default function Header({ onProfileClick }: HeaderProps) {
  const [backendOnline, setBackendOnline] = useState<boolean | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const check = async () => {
      try {
        const r = await fetch('http://localhost:8000/', { signal: AbortSignal.timeout(2500) });
        setBackendOnline(r.ok);
      } catch {
        setBackendOnline(false);
      }
    };
    check();
    const id = setInterval(check, 8000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const id = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const timeStr = currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  const dateStr = currentTime.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' });

  return (
    <header className="sticky top-0 z-50 border-b"
      style={{
        background: 'rgba(7,15,9,0.82)',
        backdropFilter: 'blur(20px)',
        borderColor: 'rgba(34,197,94,0.1)',
        boxShadow: '0 1px 0 rgba(34,197,94,0.05)',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">

          {/* Logo */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #15803d, #22c55e)', boxShadow: '0 0 16px rgba(34,197,94,0.35)' }}>
              <Leaf className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-black tracking-tight leading-none text-white">
                VERDI<span style={{ color: '#22c55e' }}>SORT</span>
              </h1>
              <p className="text-[10px] font-medium tracking-widest uppercase hidden sm:block"
                style={{ color: 'rgba(255,255,255,0.3)' }}>
                AI Waste Intelligence
              </p>
            </div>
          </div>

          {/* Right cluster */}
          <div className="flex items-center gap-3">
            {/* Live clock */}
            <div className="hidden md:flex flex-col items-end">
              <span className="text-xs font-mono font-semibold" style={{ color: 'rgba(255,255,255,0.7)' }}>{timeStr}</span>
              <span className="text-[10px]" style={{ color: 'rgba(255,255,255,0.3)' }}>{dateStr}</span>
            </div>

            <div className="hidden md:block w-px h-8 self-center" style={{ background: 'rgba(255,255,255,0.08)' }} />

            {/* Backend status */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full text-sm border"
              style={{
                background: backendOnline === null ? 'rgba(255,255,255,0.04)'
                  : backendOnline ? 'rgba(34,197,94,0.07)' : 'rgba(239,68,68,0.07)',
                borderColor: backendOnline === null ? 'rgba(255,255,255,0.08)'
                  : backendOnline ? 'rgba(34,197,94,0.2)' : 'rgba(239,68,68,0.2)',
              }}
            >
              {backendOnline === null ? (
                <span className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse" />
              ) : backendOnline ? (
                <Wifi className="w-3.5 h-3.5" style={{ color: '#22c55e' }} />
              ) : (
                <WifiOff className="w-3.5 h-3.5 text-red-400" />
              )}
              <span className="text-xs font-semibold hidden sm:inline"
                style={{ color: backendOnline === null ? '#ca8a04' : backendOnline ? '#4ade80' : '#f87171' }}>
                {backendOnline === null ? 'Connecting…' : backendOnline ? 'API Online' : 'API Offline'}
              </span>
            </div>

            <div className="w-px h-8 self-center" style={{ background: 'rgba(255,255,255,0.08)' }} />

            {/* Profile button */}
            <button
              id="profile-btn"
              onClick={onProfileClick}
              className="w-9 h-9 rounded-xl flex items-center justify-center border transition-all duration-200 hover:scale-105 active:scale-95 group"
              style={{
                background: 'rgba(34,197,94,0.07)',
                borderColor: 'rgba(34,197,94,0.18)',
              }}
              title="View Profile"
            >
              <User className="w-4 h-4 transition-colors" style={{ color: '#4ade80' }} />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
