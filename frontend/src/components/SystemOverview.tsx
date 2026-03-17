import { AlertTriangle, Cpu, Recycle } from 'lucide-react';

export default function SystemOverview() {
  return (
    <section className="my-12">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
          The Smart City Solution
        </h2>
        <p className="mt-4 text-gray-400 max-w-2xl mx-auto">
          Revolutionizing waste management with cutting-edge artificial intelligence to create cleaner, more sustainable urban environments.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-dark-800/50 border border-white/5 rounded-2xl p-6 hover:bg-dark-800 transition-colors">
          <div className="w-12 h-12 bg-red-500/10 rounded-xl flex items-center justify-center mb-4">
            <AlertTriangle className="w-6 h-6 text-red-400" />
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">The Problem</h3>
          <p className="text-gray-400 text-sm leading-relaxed">
            Manual waste sorting is highly inefficient, hazardous to workers, and often leads to cross-contamination, severely limiting recycling potential in growing cities.
          </p>
        </div>

        <div className="bg-dark-800/50 border border-verde-500/20 rounded-2xl p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-verde-500/10 blur-3xl rounded-full"></div>
          <div className="w-12 h-12 bg-verde-500/20 rounded-xl flex items-center justify-center mb-4 border border-verde-500/30">
            <Cpu className="w-6 h-6 text-verde-400" />
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">Our Solution</h3>
          <p className="text-gray-300 text-sm leading-relaxed">
            AI-based automated classification utilizing advanced computer vision to accurately identify and segregate waste at the source, reducing human error.
          </p>
        </div>

        <div className="bg-dark-800/50 border border-white/5 rounded-2xl p-6 hover:bg-dark-800 transition-colors">
          <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center mb-4">
            <Recycle className="w-6 h-6 text-blue-400" />
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">The Impact</h3>
          <p className="text-gray-400 text-sm leading-relaxed">
            Significantly improved recycling rates, drastic reductions in landfill volume, lower carbon footprint, and a safer environment for sanitation workers.
          </p>
        </div>
      </div>
    </section>
  );
}
