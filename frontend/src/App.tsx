import { useState } from 'react';
import Header from './components/Header';
import SystemOverview from './components/SystemOverview';
import UploadSection from './components/UploadSection';
import ProcessingFlow from './components/ProcessingFlow';
import ClassificationResult from './components/ClassificationResult';
import Dashboard from './components/Dashboard';
import Footer from './components/Footer';

interface Result {
  label: string;
  confidence: number;
  processing_time_ms: number;
}

export default function App() {
  const [activeStep, setActiveStep] = useState<number>(-1);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<Result | null>(null);

  const handleImageUpload = async (file: File) => {
    setIsLoading(true);
    setResult(null);
    setActiveStep(0); // Image Upload step

    try {
      // Simulate flow progression before the request
      setTimeout(() => setActiveStep(1), 500); // Cloud AI
      setTimeout(() => setActiveStep(2), 1500); // Classification

      const formData = new FormData();
      formData.append('file', file);

      // In production, configure API URL correctly. Assuming backend runs on 8000
      const response = await fetch('http://localhost:8000/api/classify', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data: Result = await response.json();
      
      // Simulate completing the flow steps
      setActiveStep(3); // Sustain Engine
      setTimeout(() => {
        setActiveStep(4); // Dashboard
        setTimeout(() => {
          setActiveStep(5); // ESG API
          setResult(data);
          setIsLoading(false);
          // Reset flow visualization after a while
          setTimeout(() => setActiveStep(-1), 6000);
        }, 800);
      }, 800);
      
    } catch (error) {
      console.error('Error classifying image:', error);
      setIsLoading(false);
      setActiveStep(-1);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        {/* Main interactive area */}
        <div className="grid lg:grid-cols-12 gap-8 my-10">
          <div className="lg:col-span-7">
            <UploadSection 
              onImageSelected={handleImageUpload} 
              isLoading={isLoading} 
            />
            {activeStep >= 0 && (
              <ProcessingFlow activeStep={activeStep} />
            )}
          </div>
          
          <div className="lg:col-span-5 flex flex-col justify-center">
            {result ? (
              <ClassificationResult 
                label={result.label}
                confidence={result.confidence}
                processingTimeMs={result.processing_time_ms}
              />
            ) : (
              <div className="bg-dark-800/30 border border-white/5 border-dashed rounded-2xl h-full min-h-[300px] flex items-center justify-center text-gray-500">
                <p>Upload an image to see results</p>
              </div>
            )}
          </div>
        </div>

        <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent my-12" />

        <Dashboard />

        <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent my-12" />

        <SystemOverview />
      </main>

      <Footer />
    </div>
  );
}
