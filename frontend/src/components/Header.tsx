import { Leaf } from 'lucide-react';

export default function Header() {
  return (
    <header className="border-b border-white/10 bg-dark-900/50 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-verde-500/10 rounded-lg">
              <Leaf className="w-6 h-6 text-verde-500" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-white">
                VERDI<span className="text-verde-500">SORT</span>
              </h1>
              <p className="text-xs text-gray-400 font-medium hidden sm:block">
                Transforming Waste into Intelligent Data Streams
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 bg-dark-800 px-3 py-1.5 rounded-full border border-white/5 shadow-sm">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-verde-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-verde-500"></span>
            </span>
            <span className="text-sm font-medium text-gray-300">System Status: <span className="text-verde-400">Active</span></span>
          </div>
        </div>
      </div>
    </header>
  );
}
