import { Clock, Cpu, FileBox } from 'lucide-react';

interface ClassificationResultProps {
  label: string;
  confidence: number;
  processingTimeMs: number;
  allScores?: Record<string, number>;
}

// Color mapping per class
const CLASS_COLORS: Record<string, { bar: string; badge: string }> = {
  'Cardboard':            { bar: 'bg-amber-500',  badge: 'text-amber-400 bg-amber-500/10 border-amber-500/20' },
  'Food / Organics / BIO':{ bar: 'bg-verde-500',  badge: 'text-verde-400 bg-verde-500/10 border-verde-500/20' },
  'Glass':                { bar: 'bg-cyan-500',   badge: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20' },
  'Metal':                { bar: 'bg-blue-500',   badge: 'text-blue-400 bg-blue-500/10 border-blue-500/20' },
  'Paper':                { bar: 'bg-yellow-500', badge: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20' },
  'Plastic':              { bar: 'bg-red-500',    badge: 'text-red-400 bg-red-500/10 border-red-500/20' },
  'Textile Trash':        { bar: 'bg-purple-500', badge: 'text-purple-400 bg-purple-500/10 border-purple-500/20' },
};

function getColors(label: string) {
  return CLASS_COLORS[label] ?? { bar: 'bg-verde-500', badge: 'text-verde-400 bg-verde-500/10 border-verde-500/20' };
}

export default function ClassificationResult({ label, confidence, processingTimeMs, allScores }: ClassificationResultProps) {
  const { bar: barColor, badge: badgeClass } = getColors(label);
  const confidencePct = Math.round(confidence * 100);

  return (
    <div className="bg-dark-800 border border-white/5 rounded-2xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
      <div className="absolute top-0 right-0 p-8 opacity-5">
        <FileBox className="w-32 h-32" />
      </div>

      <h3 className="text-sm uppercase tracking-wider text-gray-500 font-semibold mb-2 flex items-center gap-2">
        <Cpu className="w-4 h-4" /> AI Analysis Complete
      </h3>

      <div className="mt-4 mb-6">
        <p className="text-gray-400 text-sm mb-1">Detected Material Category</p>
        <div className={`inline-flex items-center px-4 py-2 rounded-lg border ${badgeClass} font-bold text-xl tracking-tight`}>
          {label}
        </div>
      </div>

      {/* Confidence + Processing Time */}
      <div className="grid grid-cols-2 gap-4 sm:gap-6 mb-6">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Confidence</span>
            <span className="text-white font-mono">{confidencePct}%</span>
          </div>
          <div className="h-2 w-full bg-dark-900 rounded-full overflow-hidden">
            <div
              className={`h-full ${barColor} rounded-full transition-all duration-1000 ease-out`}
              style={{ width: `${confidencePct}%` }}
            />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-400 flex items-center gap-1">
              <Clock className="w-3 h-3" /> Time
            </span>
            <span className="text-white font-mono">{processingTimeMs}ms</span>
          </div>
          <div className="h-2 w-full bg-dark-900 rounded-full flex items-center px-0.5">
            <div className="w-full flex gap-0.5 h-1">
              {[...Array(10)].map((_, i) => (
                <div key={i} className={`flex-1 rounded-full ${i < Math.ceil(processingTimeMs / 400) ? 'bg-gray-500' : 'bg-dark-700'}`} />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* All class scores */}
      {allScores && (
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-3">All Class Probabilities</p>
          <div className="space-y-2">
            {Object.entries(allScores)
              .sort(([, a], [, b]) => b - a)
              .map(([cls, score]) => {
                const pct = Math.round(score * 100);
                const { bar } = getColors(cls);
                return (
                  <div key={cls} className="flex items-center gap-2">
                    <span className="text-xs text-gray-400 w-36 shrink-0 truncate">{cls}</span>
                    <div className="flex-1 h-1.5 bg-dark-900 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${bar} rounded-full transition-all duration-700 ease-out`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-500 font-mono w-8 text-right">{pct}%</span>
                  </div>
                );
              })}
          </div>
        </div>
      )}
    </div>
  );
}
