export default function Landing() {
  return (
    <div className="text-center space-y-6 max-w-2xl">
      <h1 className="text-4xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">
        CostShield Developer Platform
      </h1>
      <p className="text-lg text-slate-600 dark:text-slate-400">
        Monitor and control API costs in real time.
      </p>
      <div className="pt-4">
        <a 
          href="/login" 
          className="inline-flex h-10 items-center justify-center rounded-md bg-indigo-600 px-8 text-sm font-medium text-white shadow transition-colors hover:bg-indigo-700 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-indigo-700 disabled:pointer-events-none disabled:opacity-50"
        >
          Sign In
        </a>
      </div>
    </div>
  );
}
