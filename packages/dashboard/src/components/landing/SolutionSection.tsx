import { Layers, Users, BellRing, ChevronRight, ShieldCheck } from 'lucide-react';
import { Reveal } from '../ui/Reveal';
import { SolutionBackground } from '../../assets/illustrations/SolutionBackground';
import dashboardDark from '../../assets/dashboard-preview.png';
import dashboardLight from '../../assets/dashboard-preview-light.png';

// Solution Block Component
interface SolutionBlockProps {
  title: string;
  text: string;
  icon: React.ElementType;
  delay?: number;
}

function SolutionBlock({ title, text, icon: Icon, delay = 0 }: SolutionBlockProps) {
  return (
    <Reveal delay={delay}>
      <div className="group flex gap-4 p-4 rounded-2xl border border-transparent hover:border-slate-200 dark:hover:border-slate-800/60 hover:bg-white/50 dark:hover:bg-slate-900/30 transition-all duration-300 ease-out cursor-default">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300 shrink-0">
          <Icon className="w-5 h-5" />
        </div>
        <div className="space-y-1.5 flex-1">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
            {title}
            <ChevronRight className="w-4 h-4 opacity-0 -ml-2 group-hover:opacity-100 group-hover:ml-0 transition-all text-slate-400" />
          </h3>
          <p className="text-[15px] text-slate-600 dark:text-slate-400 leading-relaxed">
            {text}
          </p>
        </div>
      </div>
    </Reveal>
  );
}

export function SolutionSection() {
  return (
    <section className="relative py-24 md:py-32 px-6 md:px-10 overflow-hidden bg-white dark:bg-[#0B0E14]">
      {/* Subtle Background SVGs */}
      <SolutionBackground />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Section Header */}
        <div className="max-w-3xl space-y-6 mb-16 md:mb-24">
          <Reveal>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-slate-900 dark:text-white leading-[1.15]">
              Finally — see where your <br className="hidden md:block"/> API cost actually comes from.
            </h2>
          </Reveal>
          <Reveal delay={100}>
            <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl">
              Track cost per user and feature. Identify spikes instantly. <br className="hidden sm:block"/>
              Fix issues before they get expensive.
            </p>
          </Reveal>
        </div>

        {/* 2-Column Desktop Grid */}
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-12 items-center">
          
          {/* Left Side: Solution Text Content */}
          <div className="space-y-4 md:space-y-6 order-2 lg:order-1">
            <SolutionBlock 
              title="Know which feature is costing you."
              text="See exactly which part of your product is driving API cost. No guessing. No digging through logs."
              icon={Layers}
              delay={200}
            />
            <SolutionBlock 
              title="Spot expensive users instantly."
              text="Identify users consuming the most resources. Stop free-tier abuse before it becomes a problem."
              icon={Users}
              delay={300}
            />
            <SolutionBlock 
              title="Catch spikes before they hit your bill."
              text="Get alerted when your budget crosses thresholds. Fix issues before they escalate."
              icon={BellRing}
              delay={400}
            />

            {/* Trust Signal */}
            <Reveal delay={500}>
              <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800/60 inline-flex items-center gap-3 text-sm text-slate-500 dark:text-slate-400">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>Tracks cost metadata only. No payload data stored.</span>
              </div>
            </Reveal>
          </div>

          {/* Right Side: Real Dashboard Screenshot in macOS window frame */}
          <Reveal delay={300} className="order-1 lg:order-2">
            {/* Outer glow / shadow + slight hover lift */}
            <div className="group relative w-full select-none transition-transform duration-500 hover:-translate-y-1" style={{ maxWidth: '640px', margin: '0 auto' }}>

              {/* Ambient glow beneath the frame */}
              <div className="absolute -inset-3 rounded-2xl bg-indigo-500/10 dark:bg-indigo-500/20 blur-2xl pointer-events-none opacity-60" />

              {/* ── macOS Window Frame ── */}
              <div className="relative rounded-xl overflow-hidden shadow-2xl shadow-slate-900/25 dark:shadow-black/50 border border-slate-200 dark:border-slate-700/60 ring-1 ring-slate-900/5 dark:ring-white/5">

                {/* Title bar */}
                <div className="flex items-center gap-2 px-4 py-[10px] bg-slate-100 dark:bg-[#1C2032] border-b border-slate-200 dark:border-slate-700/80">
                  {/* Traffic lights */}
                  <span className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-[#FF5F57] shadow-sm" />
                    <span className="w-3 h-3 rounded-full bg-[#FEBC2E] shadow-sm" />
                    <span className="w-3 h-3 rounded-full bg-[#28C840] shadow-sm" />
                  </span>

                  {/* Fake address bar */}
                  <div className="flex-1 mx-3 flex items-center gap-1.5 px-3 py-1 rounded-md bg-white dark:bg-[#131823] border border-slate-200 dark:border-slate-700/60 text-[11px] font-mono text-slate-400 dark:text-slate-500 tracking-tight overflow-hidden">
                    <svg className="w-3 h-3 shrink-0 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <rect width="18" height="11" x="3" y="11" rx="2" ry="2"/>
                      <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                    </svg>
                    <span className="truncate">app.costshield.dev/overview</span>
                  </div>

                  {/* Spacer matching traffic lights width */}
                  <span className="w-[52px] shrink-0" />
                </div>

                {/* Screenshot — light mode */}
                <img
                  src={dashboardLight}
                  alt="CostShield Dashboard Preview"
                  className="block dark:hidden w-full h-auto"
                  style={{ maxHeight: '540px', objectFit: 'cover', objectPosition: 'top' }}
                />

                {/* Screenshot — dark mode */}
                <img
                  src={dashboardDark}
                  alt="CostShield Dashboard Preview"
                  className="hidden dark:block w-full h-auto"
                  style={{ maxHeight: '540px', objectFit: 'cover', objectPosition: 'top' }}
                />
              </div>
            </div>
          </Reveal>

        </div>
      </div>
    </section>
  );
}
