import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Shield, Zap, Lock, Github, ArrowLeft } from 'lucide-react';

export default function Login() {
  const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api/v1';

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row bg-background">
      {/* Left Panel - Branding & Trust (40%) */}
      <div className="w-full md:w-[40%] bg-slate-950 text-slate-50 flex flex-col p-8 lg:p-12 xl:p-16 relative overflow-hidden">
        {/* Subtle background decoration */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-20">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-600 blur-[100px]"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-600 blur-[100px]"></div>
        </div>

        <div className="relative flex flex-col h-full z-10">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 font-bold text-xl mb-16 w-fit hover:opacity-90 transition-opacity">
            <div className="w-8 h-8 rounded-md bg-indigo-600 flex items-center justify-center">
              <span className="text-white text-lg leading-none">C</span>
            </div>
            <span>CostShield</span>
          </Link>

          <div className="flex-1 flex flex-col justify-center max-w-md">
            <h1 className="text-3xl lg:text-4xl font-bold tracking-tight mb-4 text-white">
              Track your API cost.<br />
              <span className="text-indigo-400">Before it breaks your budget.</span>
            </h1>
            <p className="text-lg text-slate-400 mb-10 leading-relaxed">
              See cost per user and feature. No guesswork.
            </p>

            {/* Code Snippet */}
            <div className="p-4 rounded-lg bg-slate-900 border border-slate-800 shadow-2xl font-mono text-sm mb-12">
              <div className="flex gap-1.5 mb-4 border-b border-slate-800 pb-3">
                <div className="w-2.5 h-2.5 rounded-full bg-slate-700"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-slate-700"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-slate-700"></div>
              </div>
              <code className="text-slate-300 leading-loose block">
                <span className="text-indigo-400">costshield</span>.<span className="text-blue-400">track</span>({`{`}<br />
                &nbsp;&nbsp;<span className="text-slate-400">cost:</span> <span className="text-amber-400">0.002</span>,<br />
                &nbsp;&nbsp;<span className="text-slate-400">featureId:</span> <span className="text-emerald-400">"ai-chat"</span>,<br />
                &nbsp;&nbsp;<span className="text-slate-400">userId:</span> user.id<br />
                {`}`});
              </code>
            </div>

            {/* Trust Signals */}
            <div className="space-y-4 mt-auto md:mt-0">
              <div className="flex items-center gap-3 text-slate-300">
                <Zap className="w-5 h-5 text-amber-400" />
                <span className="text-sm font-medium">0ms latency impact</span>
              </div>
              <div className="flex items-center gap-3 text-slate-300">
                <Lock className="w-5 h-5 text-emerald-400" />
                <span className="text-sm font-medium">No payload tracking</span>
              </div>
              <div className="flex items-center gap-3 text-slate-300">
                <Shield className="w-5 h-5 text-blue-400" />
                <span className="text-sm font-medium">Free for personal use</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Auth Form (60%) */}
      <div className="w-full md:w-[60%] flex-1 flex items-center justify-center p-8 lg:p-12 relative bg-background">
        <div className="w-full max-w-sm space-y-8">
          <div className="space-y-2 text-center md:text-left">
            <h2 className="text-3xl font-bold tracking-tight text-center">Create an account</h2>
            <p className="text-muted-foreground text-center">
              Sign in to start tracking your API costs.
            </p>
          </div>

          <div className="space-y-4 pt-4">
            <Button asChild size="lg" className="w-full h-12 text-md flex items-center justify-center gap-2 bg-[#24292F] hover:bg-[#24292F]/90 text-white dark:bg-white dark:hover:bg-slate-200 dark:text-black transition-all">
              <a href={`${API_BASE}/auth/github`}>
                <Github size={20} />
                Continue with GitHub
              </a>
            </Button>
            
            <Button asChild variant="outline" size="lg" className="w-full h-12 text-md flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-950 dark:hover:bg-slate-900 dark:text-slate-300 dark:border-slate-800 transition-all">
              <a href={`${API_BASE}/auth/google`}>
                <svg xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 0 24 24" width="20"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/><path d="M1 1h22v22H1z" fill="none"/></svg>
                Continue with Google
              </a>
            </Button>
          </div>

          <p className="text-center text-sm text-muted-foreground pt-4">
            By clicking continue, you agree to our{' '}
            <Link to="/terms" className="underline underline-offset-4 hover:text-primary">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link to="/privacy" className="underline underline-offset-4 hover:text-primary">
              Privacy Policy
            </Link>
            .
          </p>
        </div>

        {/* Back to home floating link */}
        <div className="absolute top-6 right-6 md:top-8 md:right-8">
          <Link to="/" className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-1.5 font-medium">
            <ArrowLeft size={16} />
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
