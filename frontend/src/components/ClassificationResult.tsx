import { Clock, Cpu, FileBox } from 'lucide-react';

interface ClassificationResultProps {
  label: string;
  confidence: number;
  processingTimeMs: number;
}

export default function ClassificationResult({ label, confidence, processingTimeMs }: ClassificationResultProps) {
  
  // Choose color based on category
  let colorClass = "text-verde-400 bg-verde-500/10 border-verde-500/20";
  let barColor = "bg-verde-500";
  if (label.toLowerCase().includes("non-bio")) {
    colorClass = "text-red-400 bg-red-500/10 border-red-500/20";
    barColor = "bg-red-500";
  } else if (label.toLowerCase().includes("metal")) {
    colorClass = "text-blue-400 bg-blue-500/10 border-blue-500/20";
    barColor = "bg-blue-500";
  }

  const confidencePct = Math.round(confidence * 100);

  return (
    <div className="bg-dark-800 border border-white/5 rounded-2xl p-6 sm:p-8 shadow-xl mt-6 relative overflow-hidden">
      <div className="absolute top-0 right-0 p-8 opacity-5">
        <FileBox className="w-32 h-32" />
      </div>

      <h3 className="text-sm uppercase tracking-wider text-gray-500 font-semibold mb-2 flex items-center gap-2">
        <Cpu className="w-4 h-4" /> AI Analysis Complete
      </h3>
      
      <div className="mt-4 mb-8">
        <p className="text-gray-400 text-sm mb-1">Detected Material Category</p>
        <div className={`inline-flex items-center px-4 py-2 rounded-lg border ${colorClass} font-bold text-2xl tracking-tight`}>
          {label}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:gap-8">
        <div className="space-y-2 relative z-10">
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Confidence Score</span>
            <span className="text-white font-mono">{confidencePct}%</span>
          </div>
          <div className="h-2 w-full bg-dark-900 rounded-full overflow-hidden">
            <div 
              className={`h-full ${barColor} rounded-full transition-all duration-1000 ease-out`}
              style={{ width: `${confidencePct}%` }}
            ></div>
          </div>
        </div>

        <div className="space-y-2 relative z-10">
          <div className="flex justify-between text-sm">
            <span className="text-gray-400 flex items-center gap-1">
              <Clock className="w-3 h-3" /> Processing Time
            </span>
            <span className="text-white font-mono">{processingTimeMs} ms</span>
          </div>
          <div className="h-2 w-full bg-dark-900 rounded-full flex items-center px-1">
             <div className="w-full flex gap-1 h-1">
                {[...Array(10)].map((_, i) => (
                  <div key={i} className={`flex-1 rounded-full ${i < (processingTimeMs/400) ? 'bg-gray-400' : 'bg-dark-700'}`}></div>
                ))}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
