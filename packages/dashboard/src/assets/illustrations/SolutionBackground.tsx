export function SolutionBackground() {
  return (
    <div className="absolute inset-0 pointer-events-none opacity-40 dark:opacity-60 flex justify-center text-indigo-500 dark:text-indigo-200">
      <svg viewBox="0 0 1200 800" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute top-0 w-full max-w-6xl h-full">
        <path d="M -100 200 C 300 200, 400 600, 1300 600" className="stroke-indigo-500 dark:stroke-indigo-200" strokeWidth="1" strokeDasharray="4 4" opacity="0.5" />
        <path d="M 0 400 C 500 400, 600 100, 1200 100" className="stroke-violet-500 dark:stroke-violet-200" strokeWidth="1" opacity="0.4" />
        <circle cx="500" cy="530" r="4" fill="currentColor" opacity="0.7" />
        <circle cx="800" cy="180" r="4" className="fill-violet-500 dark:fill-violet-200" opacity="0.7" />
      </svg>
    </div>
  );
}
