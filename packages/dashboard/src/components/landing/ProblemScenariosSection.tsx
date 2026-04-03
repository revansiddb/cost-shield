import { Reveal } from '../ui/Reveal';
import { AlertTriangle, Activity, Users, Layers, TrendingUp, Sparkles } from 'lucide-react';

interface ScenarioCardProps {
  title: string;
  scenario: string;
  impact: string;
  solutionHint: string;
  uiSnapshot: React.ReactNode;
  delay?: number;
}

function ScenarioCard({ title, scenario, impact, solutionHint, uiSnapshot, delay = 0 }: ScenarioCardProps) {
  return (
    <Reveal delay={delay} className="h-full flex">
      <div className="group h-full flex flex-col p-6 md:p-8 rounded-2xl bg-white dark:bg-[#0E121A] border border-slate-200 dark:border-slate-800/80 transition-all duration-300 ease-out hover:-translate-y-2 hover:border-slate-300 dark:hover:border-slate-600 hover:shadow-2xl shadow-indigo-900/5 dark:hover:shadow-indigo-500/10">
        
        {/* Text Content */}
        <div className="space-y-3 mb-6">
          <h3 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
            {title}
          </h3>
          <p className="text-slate-600 dark:text-slate-400/90 leading-relaxed text-[15px]">
            {scenario}
          </p>
        </div>

        {/* Impact Box */}
        <div className="mb-6 p-4 rounded-xl bg-amber-50 dark:bg-amber-500/5 border border-amber-200/50 dark:border-amber-500/20 text-[15px] font-medium text-amber-900 dark:text-amber-500">
          {impact}
        </div>

        {/* Mini UI Snapshot */}
        <div className="mt-auto mb-6 relative rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#131823] p-4 shadow-sm overflow-hidden group-hover:border-slate-300 dark:group-hover:border-slate-700 transition-colors">
          {uiSnapshot}
          {/* Subtle glow */}
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-transparent pointer-events-none" />
        </div>

        {/* Solution Hint */}
        <div className="mt-auto pt-4 border-t border-slate-100 dark:border-slate-800/60">
          <p className="text-sm font-medium text-emerald-600 dark:text-emerald-500 flex items-center justify-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            {solutionHint}
          </p>
        </div>
        
      </div>
    </Reveal>
  );
}

export function ProblemScenariosSection() {
  return (
    <section className="py-24 md:py-32 px-6 md:px-10 relative z-20">
      <div className="max-w-7xl mx-auto space-y-16">
        
        {/* Section Header */}
        <div className="max-w-3xl space-y-6 text-left md:text-center md:mx-auto">
          <Reveal>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-slate-900 dark:text-white leading-tight">
              Small issues. <br className="hidden sm:block"/> Expensive consequences.
            </h2>
          </Reveal>
          <Reveal delay={100}>
            <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 leading-relaxed">
              Most API costs don’t grow gradually. <br className="hidden sm:block"/>
              <span className="font-semibold text-indigo-600 dark:text-white">They spike — because of things you didn’t notice.</span>
            </p>
          </Reveal>
        </div>

        {/* 3-Column Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          
          {/* Card 1 */}
          <ScenarioCard 
            title="One bug. 10× cost."
            scenario="A retry loop turns 1 request into 1000 calls in minutes."
            impact="₹2,800 spent before you even notice."
            solutionHint="Detected early with CostShield alerts"
            delay={200}
            uiSnapshot={
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <h4 className="text-xs font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <Activity className="w-3.5 h-3.5 text-indigo-500" /> background-job
                  </h4>
                  <div className="inline-flex items-center gap-1 bg-red-100 dark:bg-red-500/10 text-red-600 dark:text-red-400 text-[10px] font-bold px-2 py-0.5 rounded border border-red-200 dark:border-red-500/20">
                    <AlertTriangle className="w-3 h-3" /> SPIKE
                  </div>
                </div>
                <div className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  ₹2,800
                  <span className="text-red-500 text-[11px] flex items-center">
                    <TrendingUp className="w-3 h-3 mr-0.5" /> +1400%
                  </span>
                </div>
                {/* Fake Graph */}
                <div className="h-16 flex items-end gap-1 opacity-80 mt-2">
                  <div className="w-full bg-slate-200 dark:bg-slate-800 h-[15%] rounded-sm" />
                  <div className="w-full bg-slate-200 dark:bg-slate-800 h-[10%] rounded-sm" />
                  <div className="w-full bg-slate-200 dark:bg-slate-800 h-[20%] rounded-sm" />
                  <div className="w-full bg-red-400 dark:bg-red-500/80 h-[50%] rounded-sm" />
                  <div className="w-full bg-red-500 dark:bg-red-500 h-[100%] rounded-sm animate-pulse" />
                </div>
              </div>
            }
          />

          {/* Card 2 */}
          <ScenarioCard 
            title="One user draining your budget."
            scenario="A single free-tier user hits your AI endpoint hundreds of times."
            impact="Almost half your daily budget gone."
            solutionHint="Identify top users instantly"
            delay={300}
            uiSnapshot={
              <div className="space-y-4">
                <h4 className="text-xs font-semibold text-slate-900 dark:text-white flex items-center gap-1.5 border-b border-slate-200 dark:border-slate-800 pb-2">
                  <Users className="w-3.5 h-3.5 text-indigo-500" /> Users 
                </h4>
                <div className="space-y-2">
                  {[
                    { id: 'user_9482', cost: '₹1,200', pct: 48, alert: true },
                    { id: 'user_1024', cost: '₹240', pct: 15 },
                  ].map((u, i) => (
                    <div key={i} className="flex justify-between items-center bg-white dark:bg-[#0E121A] p-2 rounded border border-slate-100 dark:border-slate-800/60">
                      <div className="flex flex-col">
                        <span className="text-xs font-mono text-slate-800 dark:text-slate-200 font-medium">{u.id}</span>
                        <span className="text-[10px] text-slate-500">{u.pct}% usages</span>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="text-xs font-bold text-slate-900 dark:text-white">{u.cost}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            }
          />

          {/* Card 3 */}
          <ScenarioCard 
            title="One feature is costing everything."
            scenario="You assumed equal cost across features. But image generation is 20× more expensive."
            impact="Margins disappear silently."
            solutionHint="See feature-level cost breakdown"
            delay={400}
            uiSnapshot={
              <div className="space-y-4">
                <h4 className="text-xs font-semibold text-slate-900 dark:text-white flex items-center gap-1.5 border-b border-slate-200 dark:border-slate-800 pb-2">
                  <Layers className="w-3.5 h-3.5 text-indigo-500" /> Cost by feature
                </h4>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-end mb-1.5">
                      <span className="text-[11px] font-mono text-slate-800 dark:text-slate-200 font-medium flex items-center gap-1">
                        <Sparkles className="w-3 h-3" /> image-generation
                      </span>
                      <span className="text-xs font-bold text-slate-900 dark:text-white">₹3,400</span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-indigo-500 h-full rounded-full" style={{ width: '85%' }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between items-end mb-1.5">
                      <span className="text-[11px] font-mono text-slate-500 font-medium">chat</span>
                      <span className="text-[11px] font-medium text-slate-600 dark:text-slate-400">₹400</span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-slate-400 dark:bg-slate-600 h-full rounded-full" style={{ width: '15%' }} />
                    </div>
                  </div>
                </div>
              </div>
            }
          />
        </div>

        {/* Global Trust Signal */}
        <Reveal delay={500} className="pt-4">
          <p className="text-center text-[15px] font-medium text-slate-500 dark:text-slate-400">
            Track cost without touching your API payloads.
          </p>
        </Reveal>

      </div>
    </section>
  );
}
