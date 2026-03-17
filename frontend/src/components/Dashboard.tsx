import { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { TreePine, Trash2, Recycle, Activity } from 'lucide-react';
import type { ClassifyResult } from '../App';

// CO₂ saved per category (kg per classification event)
const CO2_PER_CLASS: Record<string, number> = {
  'Cardboard':             0.18,
  'Food / Organics / BIO': 0.09,
  'Glass':                 0.21,
  'Metal':                 0.35,
  'Paper':                 0.14,
  'Plastic':               0.27,
  'Textile Trash':         0.11,
};

// Landfill reduction per event (lbs)
const LANDFILL_PER_CLASS: Record<string, number> = {
  'Cardboard':             0.6,
  'Food / Organics / BIO': 0.3,
  'Glass':                 0.8,
  'Metal':                 1.1,
  'Paper':                 0.5,
  'Plastic':               0.7,
  'Textile Trash':         0.4,
};

const CLASS_COLORS: Record<string, string> = {
  'Cardboard':             '#f59e0b',
  'Food / Organics / BIO': '#22c55e',
  'Glass':                 '#06b6d4',
  'Metal':                 '#3b82f6',
  'Paper':                 '#eab308',
  'Plastic':               '#ef4444',
  'Textile Trash':         '#a855f7',
};

interface DashboardProps {
  history: ClassifyResult[];
}

export default function Dashboard({ history }: DashboardProps) {
  const stats = useMemo(() => {
    if (history.length === 0) return null;

    const totalCO2  = history.reduce((s, r) => s + (CO2_PER_CLASS[r.label] ?? 0.1), 0);
    const totalLand = history.reduce((s, r) => s + (LANDFILL_PER_CLASS[r.label] ?? 0.5), 0);

    // Count label occurrences
    const counts: Record<string, number> = {};
    for (const r of history) counts[r.label] = (counts[r.label] ?? 0) + 1;

    // Recyclable = everything except organics/food
    const recyclableCount = history.filter(r => r.label !== 'Food / Organics / BIO').length;
    const recyclablePct = Math.round((recyclableCount / history.length) * 100);

    // Dist data for pie
    const distData = Object.entries(counts)
      .sort(([,a],[,b]) => b - a)
      .map(([name, value]) => ({ name, value }));

    // Last up-to-7 sessions as trend
    const trendData = history.slice(0, 7).reverse().map((r, i) => ({
      session: `#${history.length - 6 + i > 0 ? history.length - 6 + i : i + 1}`,
      CO2: +(CO2_PER_CLASS[r.label] ?? 0.1).toFixed(2),
      ms: r.processing_time_ms,
    }));

    return { totalCO2, totalLand, recyclablePct, distData, trendData, counts, total: history.length };
  }, [history]);

  const noData = stats === null;

  return (
    <section className="my-12">
      <div className="mb-8 flex items-end justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
            <Activity className="w-6 h-6 text-verde-500" />
            Sustainability Dashboard
          </h2>
          <p className="text-gray-400 mt-1 text-sm">
            {noData
              ? 'Classify waste images to start building real-time impact metrics.'
              : `Based on ${stats.total} classification${stats.total !== 1 ? 's' : ''} this session.`}
          </p>
        </div>
        {!noData && (
          <span className="text-xs px-3 py-1.5 rounded-full font-semibold"
            style={{ background: 'rgba(34,197,94,0.1)', color: '#4ade80', border: '1px solid rgba(34,197,94,0.2)' }}>
            Live Session Data
          </span>
        )}
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
        {[
          {
            icon: <TreePine className="w-5 h-5 text-emerald-400" />,
            bg: 'rgba(16,185,129,0.08)', border: 'rgba(16,185,129,0.15)',
            label: 'CO₂ Saved', unit: 'kg',
            value: noData ? '—' : stats.totalCO2.toFixed(2),
            sub: noData ? 'No data yet' : `${(stats.totalCO2 * 1000).toFixed(0)}g total`,
            dot: 'bg-emerald-400',
          },
          {
            icon: <Trash2 className="w-5 h-5 text-blue-400" />,
            bg: 'rgba(59,130,246,0.08)', border: 'rgba(59,130,246,0.15)',
            label: 'Landfill Avoided', unit: 'lbs',
            value: noData ? '—' : stats.totalLand.toFixed(2),
            sub: noData ? 'No data yet' : `${stats.total} item${stats.total !== 1 ? 's' : ''} diverted`,
            dot: 'bg-blue-400',
          },
          {
            icon: <Recycle className="w-5 h-5 text-purple-400" />,
            bg: 'rgba(168,85,247,0.08)', border: 'rgba(168,85,247,0.15)',
            label: 'Recyclable Rate', unit: '%',
            value: noData ? '—' : String(stats.recyclablePct),
            sub: noData ? 'No data yet' : 'Non-organic items',
            dot: 'bg-purple-400',
          },
        ].map(card => (
          <div
            key={card.label}
            className="rounded-2xl p-6 flex flex-col justify-between border"
            style={{ background: card.bg, borderColor: card.border, backdropFilter: 'blur(8px)' }}
          >
            <div className="flex justify-between items-start mb-4">
              <div className="p-2.5 rounded-xl" style={{ background: card.bg }}>{card.icon}</div>
              <span className={`w-2 h-2 rounded-full mt-1.5 ${card.dot} ${noData ? 'opacity-30' : 'animate-pulse'}`} />
            </div>
            <div>
              <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-1">{card.label}</p>
              <h4 className="text-3xl font-bold text-white tracking-tight">
                {card.value}
                {!noData && <span className="text-lg text-gray-500 font-normal ml-1">{card.unit}</span>}
              </h4>
              <p className="text-xs text-gray-500 mt-1">{card.sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Pie — waste distribution */}
        <div className="rounded-2xl p-6 border" style={{ background: 'rgba(255,255,255,0.02)', borderColor: 'rgba(255,255,255,0.06)', backdropFilter: 'blur(8px)' }}>
          <h3 className="text-base font-semibold text-white mb-1">Waste Distribution</h3>
          <p className="text-xs text-gray-500 mb-5">Breakdown of detected categories</p>
          {noData ? (
            <EmptyChart label="Classify items to see distribution" />
          ) : (
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={stats.distData} cx="50%" cy="50%" innerRadius={52} outerRadius={76}
                    paddingAngle={4} dataKey="value" stroke="none">
                    {stats.distData.map((entry) => (
                      <Cell key={entry.name} fill={CLASS_COLORS[entry.name] ?? '#22c55e'} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ background: '#101810', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', color: '#fff', fontSize: '12px' }} itemStyle={{ color: '#d1fae5' }} />
                  <Legend iconType="circle" iconSize={8} formatter={(val) => <span style={{ color: '#9ca3af', fontSize: '11px' }}>{val}</span>} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Bar — CO₂ per session */}
        <div className="rounded-2xl p-6 border" style={{ background: 'rgba(255,255,255,0.02)', borderColor: 'rgba(255,255,255,0.06)', backdropFilter: 'blur(8px)' }}>
          <h3 className="text-base font-semibold text-white mb-1">CO₂ Saved per Classification</h3>
          <p className="text-xs text-gray-500 mb-5">Last {noData ? 0 : Math.min(stats.trendData.length, 7)} sessions (kg)</p>
          {noData ? (
            <EmptyChart label="CO₂ trend appears after classifications" />
          ) : (
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.trendData} margin={{ top: 4, right: 4, left: -24, bottom: 0 }}>
                  <XAxis dataKey="session" stroke="#374151" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="#374151" fontSize={11} tickLine={false} axisLine={false} />
                  <Tooltip cursor={{ fill: 'rgba(34,197,94,0.06)' }}
                    contentStyle={{ background: '#101810', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', color: '#fff', fontSize: '12px' }}
                  />
                  <Bar dataKey="CO2" fill="#22c55e" radius={[5, 5, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>

      {/* Recent history table */}
      {!noData && (
        <div className="mt-5 rounded-2xl border overflow-hidden" style={{ background: 'rgba(255,255,255,0.015)', borderColor: 'rgba(255,255,255,0.06)' }}>
          <div className="px-6 py-4 border-b" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
            <h3 className="text-sm font-semibold text-white">Recent Classifications</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ background: 'rgba(255,255,255,0.02)' }}>
                  {['#', 'Category', 'Confidence', 'Time (ms)'].map(h => (
                    <th key={h} className="text-left px-6 py-3 text-xs font-semibold uppercase tracking-wider"
                      style={{ color: 'rgba(255,255,255,0.3)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {history.slice(0, 6).map((r, i) => (
                  <tr key={i} className="border-t" style={{ borderColor: 'rgba(255,255,255,0.04)' }}>
                    <td className="px-6 py-3 text-gray-500">{history.length - i}</td>
                    <td className="px-6 py-3">
                      <span className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full" style={{ background: CLASS_COLORS[r.label] ?? '#22c55e' }} />
                        <span className="text-gray-300">{r.label}</span>
                      </span>
                    </td>
                    <td className="px-6 py-3">
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-20 rounded-full bg-white/5 overflow-hidden">
                          <div className="h-full rounded-full" style={{ width: `${Math.round(r.confidence * 100)}%`, background: CLASS_COLORS[r.label] ?? '#22c55e' }} />
                        </div>
                        <span className="text-gray-400 text-xs">{Math.round(r.confidence * 100)}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-3 text-gray-400">{r.processing_time_ms} ms</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </section>
  );
}

function EmptyChart({ label }: { label: string }) {
  return (
    <div className="h-56 flex flex-col items-center justify-center gap-2 rounded-xl"
      style={{ background: 'rgba(255,255,255,0.015)', border: '1px dashed rgba(255,255,255,0.06)' }}>
      <div className="w-10 h-10 rounded-xl flex items-center justify-center"
        style={{ background: 'rgba(34,197,94,0.07)' }}>
        <Activity className="w-5 h-5" style={{ color: 'rgba(34,197,94,0.4)' }} />
      </div>
      <p className="text-xs" style={{ color: 'rgba(255,255,255,0.2)' }}>{label}</p>
    </div>
  );
}
