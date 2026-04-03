import { Reveal } from '../ui/Reveal';
import { Terminal, CheckCircle2 } from 'lucide-react';

interface StepBlockProps {
  number: string;
  title: string;
  content: string;
  code?: string;
  isLast?: boolean;
  delay?: number;
}

function StepBlock({ number, title, content, code, isLast, delay = 0 }: StepBlockProps) {
  return (
    <Reveal delay={delay} className="relative group h-full flex flex-col">
      {/* Timeline connector (Desktop) */}
      {!isLast && (
        <div className="hidden lg:block absolute top-[1.375rem] left-[4.5rem] right-[-2rem] h-px bg-slate-200 dark:bg-slate-800" />
      )}
      
      {/* Step Number Dot */}
      <div className="relative z-10 w-11 h-11 rounded-full flex items-center justify-center font-semibold text-sm bg-white dark:bg-[#0E121A] border-2 border-indigo-100 dark:border-indigo-900 text-indigo-600 dark:text-indigo-400 group-hover:border-indigo-500 dark:group-hover:border-indigo-500 group-hover:bg-indigo-50 dark:group-hover:bg-indigo-500/10 transition-colors shrink-0 mb-6 shadow-sm">
        {number}
      </div>

      <div className="flex-1 flex flex-col min-w-0 w-full">
        <h3 className="text-xl font-semibold tracking-tight text-slate-900 dark:text-white mb-2">
          {title}
        </h3>
        <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-[15px] mb-6">
          {content}
        </p>
        
        {/* Code Snippet Block */}
        <div className="mt-auto min-w-0 w-full">
          {code ? (
            <div className="rounded-xl bg-slate-900 dark:bg-[#131823] border border-slate-800 overflow-hidden shadow-sm w-full">
              <div className="flex items-center gap-1.5 px-4 py-2 border-b border-slate-800 bg-[#0B0E14]">
                <Terminal className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                <span className="text-xs font-mono text-slate-500 truncate">terminal</span>
              </div>
              <div className="p-4 w-full overflow-x-auto scrollbar-thin scrollbar-thumb-slate-700">
                <code className="text-sm font-mono text-slate-300 font-medium whitespace-pre">
                  {code}
                </code>
              </div>
            </div>
          ) : (
            <div className="rounded-xl bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20 p-6 flex flex-col justify-center h-[130px] shadow-sm">
              <div className="flex items-center gap-3 text-indigo-600 dark:text-indigo-400 font-medium">
                <CheckCircle2 className="w-6 h-6 shrink-0" />
                You're fully protected.
              </div>
            </div>
          )}
        </div>
      </div>
    </Reveal>
  );
}

export function HowItWorksSection() {
  return (
    <section className="py-24 md:py-32 px-6 md:px-10 bg-white dark:bg-[#0B0E14] border-t border-slate-200 dark:border-slate-800/60 relative z-20">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="max-w-2xl mb-16 md:mb-24">
          <Reveal>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-slate-900 dark:text-white leading-tight">
              Get started in minutes.<br /> Not days.
            </h2>
          </Reveal>
          <Reveal delay={100}>
            <p className="mt-4 text-lg md:text-xl text-slate-600 dark:text-slate-400 leading-relaxed">
              Add CostShield in a few lines and start tracking instantly.
            </p>
          </Reveal>
        </div>

        {/* 4-Step Horizontal Timeline */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
          <StepBlock 
            number="01"
            title="Install SDK"
            content="Add the CostShield SDK to your project via your package manager."
            code={`npm install @costshield/node\n# or yarn add @costshield/node`}
            delay={200}
          />
          <StepBlock 
            number="02"
            title="Initialize"
            content="Instantiate the client with your secure project key."
            code={`import { CostShield } from '@costshield/node';\n\nconst cs = new CostShield({\n  key: process.env.CS_KEY\n});`}
            delay={300}
          />
          <StepBlock 
            number="03"
            title="Track Usage"
            content="Wrap expensive endpoints or models to track their specific costs."
            code={`await cs.track({\n  feature: 'image-gen',\n  user: req.userId,\n  cost: 0.05\n});`}
            delay={400}
          />
          <StepBlock 
            number="04"
            title="See the Dashboard"
            content="Monitor real-time limits, identify runaway abusers, and rest easy."
            isLast={true}
            delay={500}
          />
        </div>

      </div>
    </section>
  );
}
