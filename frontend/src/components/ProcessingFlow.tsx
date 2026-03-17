import { ArrowRight, Image as ImageIcon, CloudLightning, BrainCircuit, Leaf, LayoutDashboard, Globe } from 'lucide-react';

interface ProcessingFlowProps {
  activeStep: number;
}

const steps = [
  { id: 0, title: 'Image', icon: ImageIcon },
  { id: 1, title: 'Cloud AI', icon: CloudLightning },
  { id: 2, title: 'Classification', icon: BrainCircuit },
  { id: 3, title: 'Sustain Engine', icon: Leaf },
  { id: 4, title: 'Dashboard', icon: LayoutDashboard },
  { id: 5, title: 'ESG API', icon: Globe },
];

export default function ProcessingFlow({ activeStep }: ProcessingFlowProps) {
  return (
    <div className="bg-dark-800 border border-white/5 rounded-2xl p-6 sm:p-8 w-full mt-6 overflow-hidden relative">
      <h3 className="text-lg font-semibold text-white mb-6">AI Processing Flow</h3>
      
      <div className="relative">
        <div className="flex flex-wrap sm:flex-nowrap justify-between items-center gap-y-8 gap-x-2 relative z-10 w-full overflow-x-auto pb-4 custom-scrollbar">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = index === activeStep;
            const isCompleted = index < activeStep;
            const isPending = index > activeStep;

            return (
              <div key={step.id} className="flex items-center min-w-[max-content]">
                <div className="flex flex-col items-center">
                  <div 
                    className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500 shadow-lg
                      ${isActive ? 'bg-verde-500 text-dark-900 scale-110 shadow-verde-500/50 ring-4 ring-verde-500/30' : ''}
                      ${isCompleted ? 'bg-dark-700 text-verde-400 border border-verde-500/30' : ''}
                      ${isPending ? 'bg-dark-900 border border-white/10 text-gray-500' : ''}
                    `}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className={`text-xs mt-3 font-medium transition-colors duration-300
                    ${isActive ? 'text-verde-400' : isCompleted ? 'text-gray-300' : 'text-gray-600'}
                  `}>
                    {step.title}
                  </span>
                </div>
                
                {index < steps.length - 1 && (
                  <div className="mx-2 sm:mx-4 lg:mx-6 flex items-center translate-y-[-10px]">
                    <ArrowRight className={`w-5 h-5 transition-colors duration-500
                      ${isCompleted ? 'text-verde-500' : 'text-dark-700'}
                    `} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
