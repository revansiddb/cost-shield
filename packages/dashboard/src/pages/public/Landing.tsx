import { ProblemScenariosSection } from '../../components/landing/ProblemScenariosSection';
import { SolutionSection } from '../../components/landing/SolutionSection';
import { HowItWorksSection } from '../../components/landing/HowItWorksSection';
import { HeroBackground } from '../../assets/illustrations/HeroBackground';
import { ArrowRight, Activity, ShieldCheck, Zap } from 'lucide-react';
import { Reveal } from '../../components/ui/Reveal';

export default function Landing() {
  return (
    <div className="flex flex-col min-h-screen overflow-hidden">
      
      {/* HERO SECTION */}
      <div className="relative pt-32 pb-24 lg:pt-40 lg:pb-32 px-4 md:px-6 w-full flex flex-col items-center justify-center min-h-[85vh]">
        
        {/* Abstract SVG Backgrounds */}
        <HeroBackground />

        {/* Hero Content */}
        <div className="relative z-10 text-center space-y-10 max-w-4xl w-full">
          <Reveal>
            <div className="mx-auto flex justify-center mb-6">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-indigo-200 dark:border-indigo-800/50 bg-indigo-50/80 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300 text-sm font-medium backdrop-blur-sm">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                </span>
                Introducing automated API cost defense
              </div>
            </div>
          </Reveal>
          
          <Reveal delay={100}>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-slate-900 dark:text-white leading-[1.1]">
              Stop guessing your <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600 dark:from-indigo-400 dark:to-violet-400">
                API infrastructure costs.
              </span>
            </h1>
          </Reveal>
          
          <Reveal delay={200}>
            <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-400 leading-relaxed font-light max-w-2xl mx-auto">
              Monitor, track, and attribute your usage in real time. CostShield detects runaway bugs and triggers critical alerts before the bill escalates.
            </p>
          </Reveal>
          
          <Reveal delay={300}>
            <div className="pt-8 flex flex-col sm:flex-row items-center justify-center gap-4 w-full px-4 sm:px-0">
              <a 
                href="/login" 
                className="w-full sm:w-auto inline-flex h-14 md:h-[3.75rem] items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-500 to-violet-600 px-8 text-base md:text-[17px] font-semibold text-white shadow-xl shadow-indigo-500/20 transition-all duration-300 hover:shadow-indigo-500/40 hover:-translate-y-0.5 hover:from-indigo-400 hover:to-violet-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B0E14] border border-white/10"
              >
                Start tracking for free
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </a>
              <a 
                href="/docs" 
                className="w-full sm:w-auto inline-flex h-14 md:h-[3.75rem] items-center justify-center rounded-2xl bg-white dark:bg-[#0E121A]/50 backdrop-blur-md border border-slate-200 dark:border-slate-800 px-8 text-base md:text-[17px] font-semibold text-slate-700 dark:text-slate-300 transition-all duration-300 hover:bg-slate-50 dark:hover:bg-[#131823] hover:border-slate-300 dark:hover:border-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300"
              >
                Read the Docs
              </a>
            </div>
          </Reveal>

          {/* Floating UI Elements directly beneath CTA to ground the hero */}
          <Reveal delay={400}>
            <div className="pt-16 pb-8 mx-auto max-w-3xl grid grid-cols-1 sm:grid-cols-3 gap-6 opacity-90 text-left">
              <div className="flex items-center gap-4 p-5 rounded-2xl border border-slate-200 dark:border-slate-800/80 bg-white/70 dark:bg-[#0E121A]/80 backdrop-blur-md shadow-lg dark:shadow-none hover:shadow-xl dark:hover:shadow-indigo-500/10 hover:-translate-y-1 transition-all">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                  <Activity className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">Real-time</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Zero-latency tracking</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-5 rounded-2xl border border-slate-200 dark:border-slate-800/80 bg-white/70 dark:bg-[#0E121A]/80 backdrop-blur-md shadow-lg dark:shadow-none hover:shadow-xl dark:hover:shadow-indigo-500/10 hover:-translate-y-1 transition-all">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">Budget Tracking</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Threshold warnings</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-5 rounded-2xl border border-slate-200 dark:border-slate-800/80 bg-white/70 dark:bg-[#0E121A]/80 backdrop-blur-md shadow-lg dark:shadow-none hover:shadow-xl dark:hover:shadow-indigo-500/10 hover:-translate-y-1 transition-all hidden sm:flex">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-violet-50 dark:bg-violet-500/10 text-violet-600 dark:text-violet-400">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">Spike Alerts</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Instant notifications</p>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
      
      {/* DIRECTLY BELOW HERO */}
      {/* MERGED PROBLEM & SCENARIOS SECTION */}
      <ProblemScenariosSection />
      
      {/* SOLUTION SECTION */}
      <SolutionSection />
      
      {/* HOW IT WORKS SECTION */}
      <HowItWorksSection />
      
    </div>
  );
}
