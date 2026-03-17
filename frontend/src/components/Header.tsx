import { useState, useEffect } from 'react';
import { Leaf, User } from 'lucide-react';

interface HeaderProps {
  onProfileClick: () => void;
  onLogoClick: () => void;
}

export default function Header({ onProfileClick, onLogoClick }: HeaderProps) {
  const [apiStatus, setApiStatus] = useState<'online' | 'offline' | 'error' | 'checking'>('checking');
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const res = await fetch('http://localhost:8000/', { signal: AbortSignal.timeout(2500) });
        if (res.ok) {
          setApiStatus('online');
        } else {
          setApiStatus('error');
        }
      } catch {
        setApiStatus('offline');
      }
    };
    checkStatus();
    const probe = setInterval(checkStatus, 10000);
    return () => clearInterval(probe);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const timeStr = time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  const dateStr = time.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' });

  return (
    <header className="relative z-50 border-b border-verde-900/30 bg-dark-900/60 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Logo - now clickable */}
        <div 
          onClick={onLogoClick}
          className="flex items-center gap-3 cursor-pointer group transition-transform hover:scale-[1.02]"
        >
          <div className="w-8 h-8 rounded-lg flex items-center justify-center shadow-lg shadow-verde-500/20 group-hover:shadow-verde-500/40 transition-shadow"
            style={{ background: 'linear-gradient(135deg, #15803d, #22c55e)' }}>
            <Leaf className="w-4 h-4 text-white" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-xl font-black tracking-tight text-white leading-none">
              VERDI<span className="text-verde-500">SORT</span>
            </h1>
          </div>
        </div>

        {/* Right cluster */}
        <div className="flex items-center gap-3">
          {/* API Status */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full border border-dark-700 bg-dark-800/80">
            <div className="relative flex h-2 w-2">
              {apiStatus === 'online' && (
                <>
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-verde-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-verde-500"></span>
                </>
              )}
              {apiStatus === 'checking' && <span className="relative inline-flex rounded-full h-2 w-2 bg-yellow-500"></span>}
              {apiStatus === 'error' && <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>}
              {apiStatus === 'offline' && <span className="relative inline-flex rounded-full h-2 w-2 bg-gray-500"></span>}
            </div>
            <span className="text-xs font-medium text-gray-400">
              {apiStatus === 'online' ? 'System Online' : 
               apiStatus === 'checking' ? 'Connecting...' : 
               apiStatus === 'error' ? 'Degraded' : 'Offline'}
            </span>
          </div>

          {/* Clock */}
          <div className="hidden md:flex flex-col items-end justify-center px-4 border-l border-dark-700/50">
            <div className="text-sm font-bold text-gray-200 font-mono tracking-tight leading-none mb-1">
              {timeStr}
            </div>
            <div className="text-[10px] font-medium text-gray-500 uppercase tracking-widest leading-none">
              {dateStr}
            </div>
          </div>

          {/* Profile Quick Action */}
          <button 
            onClick={onProfileClick}
            className="w-10 h-10 rounded-xl bg-dark-800 border border-dark-700 flex items-center justify-center hover:bg-dark-700 hover:border-verde-500/30 hover:text-verde-400 transition-all group"
            title="View Profile & Session"
          >
            <User size={18} className="text-gray-400 group-hover:text-verde-400 transition-colors" />
          </button>
        </div>

      </div>
    </header>
  );
}
