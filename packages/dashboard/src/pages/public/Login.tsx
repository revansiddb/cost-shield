export default function Login() {
  const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api/v1';

  return (
    <div className="w-full max-w-sm space-y-8 p-6 bg-white dark:bg-slate-900 shadow-sm border border-slate-200 dark:border-slate-800 rounded-lg">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">
          Sign In
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Continue to CostShield developer dashboard
        </p>
      </div>

      <div className="space-y-4">
        <a 
          href={`${API_BASE}/auth/google`}
          className="flex items-center justify-center w-full h-10 px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-md shadow-sm text-sm font-medium text-slate-700 bg-white dark:bg-slate-950 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors"
        >
          Continue with Google
        </a>
        <a 
          href={`${API_BASE}/auth/github`}
          className="flex items-center justify-center w-full h-10 px-4 py-2 border border-slate-300 dark:border-slate-700 hover:border-slate-400 rounded-md shadow-sm text-sm font-medium text-slate-700 bg-white dark:bg-slate-950 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors"
        >
          Continue with GitHub
        </a>
      </div>
    </div>
  );
}
