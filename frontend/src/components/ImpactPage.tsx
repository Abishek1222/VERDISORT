import { ArrowLeft, Leaf, Recycle, ShieldCheck, Globe, Droplets, Zap, Box, Wind } from 'lucide-react';
import ScrollReveal from './ScrollReveal';

interface ImpactPageProps {
  onBack: () => void;
}

const METRICS = [
  { value: '315', label: 'Employees', icon: Globe },
  { value: '98%', label: 'Landfill diversion', icon: Leaf },
  { value: '100%', label: 'Waste Segregation at Source', icon: ShieldCheck },
  { value: '65.4%', label: 'Of Dry Waste recycled', icon: Recycle },
  { value: '100%', label: 'Of E-Waste recycled', icon: Zap },
  { value: '100%', label: 'Of Food Waste composted', icon: Droplets },
  { value: '94,817', label: 'MT CO₂e emissions offset', icon: Wind },
  { value: '100%', label: 'Committed to Zero Waste', icon: Box },
];

const WASTE_TYPES = [
  {
    category: 'Recyclables (Dry Waste)',
    desc: 'Clean, dry materials that can be processed into new products.',
    items: ['Paper & Cardboard', 'Plastics (PET, HDPE, LDPE)', 'Glass Bottles', 'Metal Cans & Scrap', 'Tetra Pak'],
    color: '#3b82f6',
    bg: 'rgba(59,130,246,0.06)',
    border: 'rgba(59,130,246,0.2)',
  },
  {
    category: 'Organic / Renewable',
    desc: 'Biodegradable matter composed into nutrient-rich soil/biogas.',
    items: ['Food Scraps', 'Garden Waste', 'Used Tea/Coffee Grounds', 'Bio-degradable Packaging'],
    color: '#22c55e',
    bg: 'rgba(34,197,94,0.06)',
    border: 'rgba(34,197,94,0.2)',
  },
  {
    category: 'E-Waste (EPR)',
    desc: 'Electronic items requiring specialized authorized recycling.',
    items: ['Laptops & Computers', 'Phones & Tablets', 'Cables & Chargers', 'Printers & Cartridges'],
    color: '#a855f7',
    bg: 'rgba(168,85,247,0.06)',
    border: 'rgba(168,85,247,0.2)',
  },
  {
    category: 'Non-Renewable / Reject',
    desc: 'Contaminated or hazardous materials sent to safe disposal or co-processing.',
    items: ['Textile Waste', 'Contaminated Plastics', 'Sanitary Waste', 'Inert Sweepings'],
    color: '#ef4444',
    bg: 'rgba(239,68,68,0.05)',
    border: 'rgba(239,68,68,0.2)',
  }
];

export default function ImpactPage({ onBack }: ImpactPageProps) {
  return (
    <div className="min-h-screen bg-dark-900 pb-20">
      {/* ── Fixed Header ── */}
      <header className="sticky top-0 z-50 border-b"
        style={{
          background: 'rgba(7,15,9,0.85)',
          backdropFilter: 'blur(20px)',
          borderColor: 'rgba(34,197,94,0.1)',
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center gap-4">
          <button
            onClick={onBack}
            className="flex items-center justify-center w-10 h-10 rounded-xl hover:bg-white/5 transition-colors border border-transparent hover:border-white/10"
          >
            <ArrowLeft size={18} className="text-gray-300" />
          </button>
          
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #15803d, #22c55e)' }}>
              <Leaf className="w-4 h-4 text-white" />
            </div>
            <h1 className="text-lg font-black tracking-tight text-white leading-none">
              VERDI<span className="text-verde-500">SORT</span>
            </h1>
          </div>
          <div className="ml-auto hidden sm:block">
            <span className="text-xs font-semibold text-verde-500 uppercase tracking-widest px-3 py-1.5 rounded-full border border-verde-500/20 bg-verde-500/10">
              Impact & Solutions
            </span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 overflow-x-hidden">
        
        {/* ── Hero ── */}
        <ScrollReveal direction="up" duration={700}>
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h1 className="text-4xl md:text-5xl font-black text-white mb-6 leading-tight">
              Professional Waste Management <br/>
              <span className="text-verde-400">Services & Solutions</span>
            </h1>
            <p className="text-lg text-gray-400 leading-relaxed">
              Based on the principles of the Circular Economy, we offer holistic end-to-end waste management. 
              From source segregation and EPR compliance to maximum material recovery through authorized processors.
            </p>
          </div>
        </ScrollReveal>

        {/* ── Core Programs (ZWP / EPR) ── */}
        <ScrollReveal direction="up" delay={150}>
          <div className="grid md:grid-cols-2 gap-6 mb-24">
            <div className="p-8 rounded-3xl border relative overflow-hidden group"
              style={{ background: 'linear-gradient(145deg, rgba(8,20,12,0.6), rgba(4,10,6,0.9))', borderColor: 'rgba(34,197,94,0.15)' }}>
              <div className="absolute top-0 right-0 w-64 h-64 bg-verde-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-verde-500/10 transition-colors" />
              <ShieldCheck className="w-10 h-10 text-verde-400 mb-6" />
              <h3 className="text-2xl font-bold text-white mb-3">Zero Waste Program (ZWP)</h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                Comprehensive end-to-end management in India. Services include waste audits, 
                reduction strategies, source segregation, infrastructure setup, tracking, data analysis, and certification. 
                We ensure every fraction is routed to its highest value recovery path.
              </p>
            </div>

            <div className="p-8 rounded-3xl border relative overflow-hidden group"
              style={{ background: 'linear-gradient(145deg, rgba(8,16,24,0.6), rgba(4,8,12,0.9))', borderColor: 'rgba(59,130,246,0.15)' }}>
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-blue-500/10 transition-colors" />
              <Recycle className="w-10 h-10 text-blue-400 mb-6" />
              <h3 className="text-2xl font-bold text-white mb-3">Extended Producer Responsibility</h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                Custom solutions to help businesses comply with EPR regulations for plastic and e-waste. 
                Includes CPCB registration, material traceability, aggregator partnerships, and annual 
                return filing. We also specialize in the Refurbishment of IT assets to extend lifecycles.
              </p>
            </div>
          </div>
        </ScrollReveal>

        {/* ── Waste Types We Segregate ── */}
        <ScrollReveal direction="up">
          <div className="mb-24">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-white mb-3">What We Collect & Segregate</h2>
              <p className="text-gray-400">Strict source segregation enables maximum resource recovery.</p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {WASTE_TYPES.map((wt) => (
                <div key={wt.category} className="p-6 rounded-2xl border"
                  style={{ background: wt.bg, borderColor: wt.border }}>
                  <h4 className="text-lg font-bold text-white mb-2" style={{ color: wt.color }}>{wt.category}</h4>
                  <p className="text-xs text-gray-400 mb-5 leading-relaxed">{wt.desc}</p>
                  
                  <ul className="space-y-2.5">
                    {wt.items.map(item => (
                      <li key={item} className="flex items-start gap-2 text-sm text-gray-300">
                        <div className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0" style={{ background: wt.color }} />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </ScrollReveal>

        {/* ── Real Results Measurable Impact ── */}
        <ScrollReveal direction="up">
          <div>
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-white mb-3">Real Results, Measurable Impact</h2>
              <p className="text-gray-400">Data-driven and verifiable sustainability outcomes.</p>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {METRICS.map((m) => {
                const Icon = m.icon;
                return (
                  <div key={m.label} className="p-5 rounded-2xl border flex flex-col items-center text-center transition-transform hover:-translate-y-1"
                    style={{ background: 'rgba(255,255,255,0.02)', borderColor: 'rgba(255,255,255,0.06)' }}>
                    <div className="w-10 h-10 rounded-full flex items-center justify-center mb-4"
                      style={{ background: 'rgba(34,197,94,0.08)', color: '#4ade80' }}>
                      <Icon size={18} />
                    </div>
                    <div className="text-3xl font-black text-white mb-1.5">{m.value}</div>
                    <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{m.label}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </ScrollReveal>
      </main>
    </div>
  );
}
