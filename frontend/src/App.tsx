import { useState, useEffect, useRef } from 'react';
import LoginPage from './components/LoginPage';
import SplashScreen from './components/SplashScreen';
import Header from './components/Header';
import SystemOverview from './components/SystemOverview';
import UploadSection from './components/UploadSection';
import ProcessingFlow from './components/ProcessingFlow';
import ClassificationResult from './components/ClassificationResult';
import Dashboard from './components/Dashboard';
import BinDashboard from './components/BinDashboard';
import ProfilePanel from './components/ProfilePanel';
import ScrollReveal from './components/ScrollReveal';
import ImpactPage from './components/ImpactPage';
import Footer from './components/Footer';

export interface ClassifyResult {
  label: string;
  confidence: number;
  processing_time_ms: number;
  all_scores?: Record<string, number>;
}

// ─── Animated background canvas ─────────────────────────────────────────────────
function AnimatedBg() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let raf: number;
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener('resize', resize);

    const orbs = Array.from({ length: 18 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      r: 60 + Math.random() * 140,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      alpha: 0.04 + Math.random() * 0.07,
      hue: 130 + Math.random() * 30,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const o of orbs) {
        o.x += o.vx; o.y += o.vy;
        if (o.x < -o.r) o.x = canvas.width + o.r;
        if (o.x > canvas.width + o.r) o.x = -o.r;
        if (o.y < -o.r) o.y = canvas.height + o.r;
        if (o.y > canvas.height + o.r) o.y = -o.r;
        const g = ctx.createRadialGradient(o.x, o.y, 0, o.x, o.y, o.r);
        g.addColorStop(0, `hsla(${o.hue},80%,55%,${o.alpha})`);
        g.addColorStop(1, `hsla(${o.hue},80%,55%,0)`);
        ctx.beginPath();
        ctx.arc(o.x, o.y, o.r, 0, Math.PI * 2);
        ctx.fillStyle = g;
        ctx.fill();
      }
      raf = requestAnimationFrame(draw);
    };
    draw();

    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); };
  }, []);

  return (
    <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none" style={{ zIndex: 0 }} />
  );
}

export default function App() {
  const [splashDone, setSplashDone] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<'Citizen' | 'Admin'>('Citizen');
  const [profileOpen, setProfileOpen] = useState(false);
  const [showImpactPage, setShowImpactPage] = useState(false);
  const [activeStep, setActiveStep] = useState<number>(-1);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<ClassifyResult | null>(null);
  const [history, setHistory] = useState<ClassifyResult[]>([]);

  if (!splashDone) return <SplashScreen onDone={() => setSplashDone(true)} />;
  if (!isLoggedIn) return <LoginPage onLogin={(role) => { setUserRole(role); setIsLoggedIn(true); }} />;

  // ── 4th Page Router ──
  if (showImpactPage) {
    return <ImpactPage onBack={() => setShowImpactPage(false)} />;
  }

  const handleImageUpload = async (file: File) => {
    setIsLoading(true);
    setResult(null);
    setActiveStep(0);

    try {
      setTimeout(() => setActiveStep(1), 500);
      setTimeout(() => setActiveStep(2), 1500);

      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('http://localhost:8000/api/classify', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Classification failed');
      const data: ClassifyResult = await response.json();

      setActiveStep(3);
      setTimeout(() => {
        setActiveStep(4);
        setTimeout(() => {
          setActiveStep(5);
          setResult(data);
          setHistory(prev => [data, ...prev].slice(0, 50));
          setIsLoading(false);
          setTimeout(() => setActiveStep(-1), 6000);
        }, 800);
      }, 800);

    } catch (err) {
      console.error('Classification error:', err);
      setIsLoading(false);
      setActiveStep(-1);
    }
  };

  return (
    <div className="min-h-screen flex flex-col relative" style={{ background: '#070f09' }}>
      <AnimatedBg />

      {/* Grid overlay */}
      <div className="fixed inset-0 pointer-events-none" style={{
        zIndex: 0,
        backgroundImage:
          'linear-gradient(rgba(34,197,94,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(34,197,94,0.03) 1px, transparent 1px)',
        backgroundSize: '72px 72px',
      }} />

      {/* Profile panel */}
      <ProfilePanel open={profileOpen} onClose={() => setProfileOpen(false)} history={history} role={userRole} />

      {/* Content */}
      <div className="relative flex flex-col flex-1" style={{ zIndex: 1 }}>
        <Header onProfileClick={() => setProfileOpen(true)} onLogoClick={() => setShowImpactPage(true)} />

        <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          {/* Upload + Result */}
          <div className="grid lg:grid-cols-12 gap-8 my-10">
            <div className="lg:col-span-7">
              <UploadSection onImageSelected={handleImageUpload} isLoading={isLoading} />
              {activeStep >= 0 && <ProcessingFlow activeStep={activeStep} />}
            </div>

            <div className="lg:col-span-5 flex flex-col justify-center">
              {result ? (
                <ClassificationResult
                  label={result.label}
                  confidence={result.confidence}
                  processingTimeMs={result.processing_time_ms}
                  allScores={result.all_scores}
                />
              ) : (
                <div className="rounded-2xl h-full min-h-[300px] flex flex-col items-center justify-center gap-3 border border-dashed"
                  style={{ background: 'rgba(34,197,94,0.02)', borderColor: 'rgba(34,197,94,0.12)' }}>
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center"
                    style={{ background: 'rgba(34,197,94,0.08)' }}>
                    <svg width="28" height="28" fill="none" viewBox="0 0 24 24">
                      <path d="M9 13l3 3 3-3M12 8v8" stroke="#22c55e" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M3 15a9 9 0 1018 0 9 9 0 00-18 0z" stroke="#22c55e" strokeWidth="1.5"/>
                    </svg>
                  </div>
                  <p className="text-sm font-medium" style={{ color: 'rgba(255,255,255,0.35)' }}>Upload an image to classify</p>
                  <p className="text-xs" style={{ color: 'rgba(255,255,255,0.18)' }}>Supports JPG, PNG, WEBP</p>
                </div>
              )}
            </div>
          </div>

          <div className="w-full h-px my-12" style={{ background: 'linear-gradient(90deg, transparent, rgba(34,197,94,0.2), transparent)' }} />

          {/* Bin Weight Dashboard */}
          <ScrollReveal direction="up" duration={800} delay={100}>
            <BinDashboard history={history} />
          </ScrollReveal>

          <div className="w-full h-px my-12" style={{ background: 'linear-gradient(90deg, transparent, rgba(34,197,94,0.2), transparent)' }} />

          {/* Sustainability Dashboard */}
          <ScrollReveal direction="up" duration={800} delay={100}>
            <Dashboard history={history} />
          </ScrollReveal>

          <div className="w-full h-px my-12" style={{ background: 'linear-gradient(90deg, transparent, rgba(34,197,94,0.2), transparent)' }} />

          <ScrollReveal direction="up" duration={800} delay={100}>
            <SystemOverview />
          </ScrollReveal>
        </main>

        <Footer />
      </div>
    </div>
  );
}
