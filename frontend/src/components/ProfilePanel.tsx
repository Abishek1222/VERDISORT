import { X, User, Mail, Shield, Clock, Trash2, Award, LogOut } from 'lucide-react';
import type { ClassifyResult } from '../App';

interface ProfilePanelProps {
  open: boolean;
  onClose: () => void;
  history: ClassifyResult[];
  role: 'Admin' | 'Citizen';
}

const AVATAR_COLORS = ['#22c55e', '#3b82f6', '#a855f7', '#f59e0b', '#06b6d4'];
const avatarColor = AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)];

// Map individual classes to the 3 main bin types for the Top Category stat
const CATEGORY_MAP: Record<string, 'Recyclable' | 'Renewable' | 'Non-Renewable'> = {
  'Cardboard':             'Recyclable',
  'Glass':                 'Recyclable',
  'Metal':                 'Recyclable',
  'Paper':                 'Recyclable',
  'Plastic':               'Recyclable',
  'Food / Organics / BIO': 'Renewable',
  'Textile Trash':         'Non-Renewable',
};

export default function ProfilePanel({ open, onClose, history, role }: ProfilePanelProps) {
  const SESSION_USER = {
    name: role === 'Admin' ? 'System Administrator' : 'Citizen Contributor',
    email: role === 'Admin' ? 'admin@verdisort.ai' : 'user@smartcity.env',
    role: role === 'Admin' ? 'Operations Manager' : 'Eco Warrior',
    since: new Date().toLocaleDateString([], { year: 'numeric', month: 'long' }),
  };

  const topCategory = (() => {
    if (history.length === 0) return '—';
    const counts: Record<string, number> = {};
    for (const r of history) {
      const cat = CATEGORY_MAP[r.label] ?? 'Non-Renewable';
      counts[cat] = (counts[cat] ?? 0) + 1;
    }
    return Object.entries(counts).sort(([,a],[,b]) => b - a)[0]?.[0] ?? '—';
  })();

  const avgConfidence = history.length > 0
    ? Math.round(history.reduce((s, r) => s + r.confidence, 0) / history.length * 100)
    : 0;

  const avgLatency = history.length > 0
    ? Math.round(history.reduce((s, r) => s + r.processing_time_ms, 0) / history.length)
    : 0;

  const stats = [
    { label: 'Classifications', value: String(history.length), icon: <Trash2 size={14} /> },
    { label: 'Avg Confidence', value: history.length ? `${avgConfidence}%` : '—', icon: <Award size={14} /> },
    { label: 'Avg Latency', value: history.length ? `${avgLatency} ms` : '—', icon: <Clock size={14} /> },
    { label: 'Top Stream', value: topCategory, icon: <Shield size={14} /> },
  ];

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 pointer-events-auto"
        style={{
          background: 'rgba(0,0,0,0.5)',
          backdropFilter: 'blur(4px)',
          opacity: open ? 1 : 0,
          pointerEvents: open ? 'auto' : 'none',
          transition: 'opacity 0.3s ease',
        }}
        onClick={onClose}
      />

      {/* Slide-in panel */}
      <div
        className="fixed top-0 right-0 bottom-0 z-50 flex flex-col"
        style={{
          width: 'min(380px, 92vw)',
          background: 'linear-gradient(180deg, #081208 0%, #040c05 100%)',
          borderLeft: '1px solid rgba(34,197,94,0.12)',
          boxShadow: '-20px 0 60px rgba(0,0,0,0.6)',
          transform: open ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.35s cubic-bezier(0.32,0.72,0,1)',
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b"
          style={{ borderColor: 'rgba(34,197,94,0.1)' }}>
          <span className="text-sm font-semibold text-white">Your Profile</span>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white/5 transition-colors"
            style={{ color: 'rgba(255,255,255,0.45)' }}
          >
            <X size={16} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
          {/* Avatar + info */}
          <div className="flex items-center gap-4">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-black flex-shrink-0"
              style={{
                background: `linear-gradient(135deg, ${avatarColor}33, ${avatarColor}11)`,
                border: `1.5px solid ${avatarColor}44`,
                color: avatarColor,
                boxShadow: `0 0 24px ${avatarColor}22`,
              }}
            >
              {SESSION_USER.name[0]}
            </div>
            <div>
              <p className="text-white font-bold">{SESSION_USER.name}</p>
              <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.4)' }}>{SESSION_USER.role}</p>
              <div className="flex items-center gap-1.5 mt-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                <span className="text-xs text-green-400">Active session</span>
              </div>
            </div>
          </div>

          {/* Contact info */}
          <div className="space-y-2.5">
            {[
              { icon: <Mail size={13} />, label: 'Email', value: SESSION_USER.email },
              { icon: <Shield size={13} />, label: 'Role', value: SESSION_USER.role },
              { icon: <Clock size={13} />, label: 'Member since', value: SESSION_USER.since },
              { icon: <User size={13} />, label: 'Session', value: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) },
            ].map(row => (
              <div key={row.label} className="flex items-center gap-3 px-4 py-3 rounded-xl"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
                <span style={{ color: 'rgba(34,197,94,0.6)' }}>{row.icon}</span>
                <span className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>{row.label}</span>
                <span className="text-xs ml-auto text-white font-medium truncate">{row.value}</span>
              </div>
            ))}
          </div>

          {/* Divider */}
          <div className="h-px" style={{ background: 'rgba(255,255,255,0.06)' }} />

          {/* Session stats */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest mb-3"
              style={{ color: 'rgba(255,255,255,0.3)' }}>
              This Session
            </p>
            <div className="grid grid-cols-2 gap-2.5">
              {stats.map(s => (
                <div key={s.label} className="rounded-xl p-3.5 border"
                  style={{ background: 'rgba(34,197,94,0.04)', borderColor: 'rgba(34,197,94,0.1)' }}>
                  <div className="flex items-center gap-1.5 mb-2" style={{ color: 'rgba(34,197,94,0.6)' }}>
                    {s.icon}
                    <span className="text-[10px] uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.3)' }}>{s.label}</span>
                  </div>
                  <p className="text-lg font-bold text-white truncate">{s.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Recent activity */}
          {history.length > 0 && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest mb-3"
                style={{ color: 'rgba(255,255,255,0.3)' }}>
                Recent Activity
              </p>
              <div className="space-y-1.5">
                {history.slice(0, 5).map((r, i) => (
                  <div key={i} className="flex items-center gap-3 px-3 py-2.5 rounded-lg"
                    style={{ background: 'rgba(255,255,255,0.025)' }}>
                    <div className="w-2 h-2 rounded-full flex-shrink-0"
                      style={{ background: `hsl(${100 + i * 30}deg, 70%, 55%)` }} />
                    <span className="text-xs text-gray-300 flex-1 truncate">{r.label}</span>
                    <span className="text-[10px]" style={{ color: 'rgba(255,255,255,0.25)' }}>
                      {Math.round(r.confidence * 100)}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sign out button */}
        <div className="px-6 py-5 border-t" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
          <button
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all hover:scale-[1.02] active:scale-[0.98]"
            style={{
              background: 'rgba(239,68,68,0.08)',
              border: '1px solid rgba(239,68,68,0.15)',
              color: '#f87171',
            }}
            onClick={onClose}
          >
            <LogOut size={14} />
            Sign Out
          </button>
        </div>
      </div>
    </>
  );
}
