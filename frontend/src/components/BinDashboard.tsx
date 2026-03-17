import { useMemo } from 'react';
import { Scale, Trash2, TrendingUp, AlertCircle, RefreshCw, Leaf, XCircle } from 'lucide-react';
import type { ClassifyResult } from '../App';

// Map individual classes to the 3 main bin types
const CATEGORY_MAP: Record<string, 'Recyclable' | 'Renewable' | 'Non-Renewable'> = {
  'Cardboard':             'Recyclable',
  'Glass':                 'Recyclable',
  'Metal':                 'Recyclable',
  'Paper':                 'Recyclable',
  'Plastic':               'Recyclable',
  'Food / Organics / BIO': 'Renewable',
  'Textile Trash':         'Non-Renewable',
};

// Simulated average weight per single item (kg) per material class
const WEIGHT_PER_ITEM_KG: Record<string, number> = {
  'Cardboard':             0.42,
  'Food / Organics / BIO': 0.28,
  'Glass':                 0.65,
  'Metal':                 0.81,
  'Paper':                 0.19,
  'Plastic':               0.15,
  'Textile Trash':         0.33,
};

// Max bin capacity in kg for the 3 main bins
const BIN_CAPACITY_KG = {
  'Recyclable':    120, // large bin because it takes many materials
  'Renewable':     80,  // organic matter is heavy but compact
  'Non-Renewable': 60,
};

const BIN_DEF = {
  'Recyclable':    { icon: RefreshCw, col: '#3b82f6', bg: 'rgba(59,130,246,0.08)', border: 'rgba(59,130,246,0.25)' },
  'Renewable':     { icon: Leaf,      col: '#22c55e', bg: 'rgba(34,197,94,0.08)',  border: 'rgba(34,197,94,0.25)' },
  'Non-Renewable': { icon: XCircle,   col: '#ef4444', bg: 'rgba(239,68,68,0.08)',  border: 'rgba(239,68,68,0.25)' },
};

interface BinDashboardProps {
  history: ClassifyResult[];
}

function BinCard({ binName, count, weightKg }: { binName: 'Recyclable' | 'Renewable' | 'Non-Renewable'; count: number; weightKg: number }) {
  const cap = BIN_CAPACITY_KG[binName];
  const def = BIN_DEF[binName];
  const Icon = def.icon;
  const fillPct = Math.min((weightKg / cap) * 100, 100);
  
  const status = fillPct >= 85 ? 'critical' : fillPct >= 55 ? 'moderate' : 'good';
  const statusColor = status === 'critical' ? '#ef4444' : status === 'moderate' ? '#f59e0b' : '#22c55e';

  return (
    <div className="rounded-2xl p-6 border flex flex-col gap-5 transition-all duration-300 hover:scale-[1.02]"
      style={{ background: def.bg, borderColor: def.border, backdropFilter: 'blur(12px)', boxShadow: `0 8px 32px ${def.bg}` }}>
      {/* Top row */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center"
            style={{ background: `${def.col}22`, border: `1px solid ${def.col}40` }}>
            <Icon size={22} style={{ color: def.col }} />
          </div>
          <div>
            <p className="text-lg font-bold text-white leading-tight">{binName}</p>
            <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.4)' }}>
              {count} item{count !== 1 ? 's' : ''} routed
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full"
          style={{ background: `${statusColor}15`, border: `1px solid ${statusColor}40` }}>
          {status === 'critical' && <AlertCircle size={12} style={{ color: statusColor }} />}
          <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: statusColor }}>
            {status === 'critical' ? 'NEARING CAP' : status === 'moderate' ? 'FILLING' : 'HEALTHY'}
          </span>
        </div>
      </div>

      {/* Weight readout */}
      <div className="flex items-end justify-between mt-2">
        <div>
          <p className="text-xs uppercase tracking-widest mb-1" style={{ color: 'rgba(255,255,255,0.35)' }}>
            Current Load
          </p>
          <div className="flex items-baseline gap-1.5">
            <span className="text-4xl font-black" style={{ color: def.col }}>
              {count === 0 ? '0.00' : weightKg.toFixed(2)}
            </span>
            <span className="text-sm font-medium" style={{ color: 'rgba(255,255,255,0.4)' }}>kg</span>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs uppercase tracking-widest mb-1" style={{ color: 'rgba(255,255,255,0.35)' }}>
            Capacity
          </p>
          <span className="text-base font-bold" style={{ color: 'rgba(255,255,255,0.6)' }}>{cap} kg</span>
        </div>
      </div>

      {/* Fill bar */}
      <div className="mt-1">
        <div className="h-3 w-full rounded-full overflow-hidden" style={{ background: 'rgba(0,0,0,0.4)' }}>
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{
              width: `${fillPct}%`,
              background: fillPct >= 85
                ? 'linear-gradient(90deg, #ef4444, #dc2626)'
                : fillPct >= 55
                  ? 'linear-gradient(90deg, #f59e0b, #d97706)'
                  : `linear-gradient(90deg, ${def.col}, ${def.col}bb)`,
              boxShadow: count > 0 ? `0 0 12px ${def.col}80` : 'none',
            }}
          />
        </div>
        <div className="flex justify-between mt-2">
          <span className="text-xs font-medium" style={{ color: 'rgba(255,255,255,0.3)' }}>0%</span>
          <span className="text-xs font-bold" style={{ color: 'rgba(255,255,255,0.5)' }}>{fillPct.toFixed(1)}% full</span>
        </div>
      </div>
    </div>
  );
}

export default function BinDashboard({ history }: BinDashboardProps) {
  const binData = useMemo(() => {
    const bins = { 'Recyclable': { count: 0, weight: 0 }, 'Renewable': { count: 0, weight: 0 }, 'Non-Renewable': { count: 0, weight: 0 } };
    
    for (const r of history) {
      const binType = CATEGORY_MAP[r.label] ?? 'Non-Renewable';
      const weight = WEIGHT_PER_ITEM_KG[r.label] ?? 0.5;
      bins[binType].count += 1;
      bins[binType].weight += weight;
    }

    return (Object.keys(bins) as Array<keyof typeof bins>).map(k => ({
      binName: k, count: bins[k].count, weightKg: bins[k].weight
    }));
  }, [history]);

  const totalWeight = binData.reduce((s, b) => s + b.weightKg, 0);
  const totalItems  = history.length;
  const heaviestBin = binData.reduce((max, b) => b.weightKg > max.weightKg ? b : max, binData[0]);
  const criticalBins = binData.filter(b => (b.weightKg / BIN_CAPACITY_KG[b.binName]) * 100 >= 85 && b.count > 0);

  return (
    <section className="my-12">
      {/* Section header */}
      <div className="flex items-end justify-between flex-wrap gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
            <Scale className="w-6 h-6 text-verde-500" />
            Master Bin Routing
          </h2>
          <p className="text-gray-400 mt-1 text-sm">
            {totalItems === 0
              ? 'Real-time aggregated bin weight tracking across 3 primary waste streams.'
              : `${totalItems} item${totalItems !== 1 ? 's' : ''} classified · ${totalWeight.toFixed(2)} kg total routed this session`}
          </p>
        </div>
        {criticalBins.length > 0 && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold animate-pulse"
            style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', color: '#f87171' }}>
            <AlertCircle size={12} />
            {criticalBins.length} bin{criticalBins.length > 1 ? 's' : ''} near capacity
          </div>
        )}
      </div>

      {/* Summary KPI row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Load Routed', value: totalItems ? `${totalWeight.toFixed(2)} kg` : '—', icon: <Scale size={15} />, col: '#22c55e' },
          { label: 'Total Items Scanned', value: String(totalItems), icon: <Trash2 size={15} />, col: '#3b82f6' },
          { label: 'Heaviest Stream', value: totalItems ? heaviestBin.binName : '—', icon: <TrendingUp size={15} />, col: '#f59e0b' },
          { label: 'Active Streams', value: `${binData.filter(b => b.count > 0).length} / 3`, icon: <RefreshCw size={15} />, col: '#a855f7' },
        ].map(k => (
          <div key={k.label} className="rounded-xl px-4 py-3.5 border"
            style={{ background: `${k.col}0a`, borderColor: `${k.col}22`, backdropFilter: 'blur(8px)' }}>
            <div className="flex items-center gap-1.5 mb-1.5" style={{ color: k.col }}>
              {k.icon}
              <span className="text-[10px] uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.3)' }}>{k.label}</span>
            </div>
            <p className="text-xl font-bold text-white truncate">{k.value}</p>
          </div>
        ))}
      </div>

      {/* Bin cards grid — 3 columns for 3 main bins */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {binData.map(b => (
          <BinCard key={b.binName} binName={b.binName} count={b.count} weightKg={b.weightKg} />
        ))}
      </div>
    </section>
  );
}
