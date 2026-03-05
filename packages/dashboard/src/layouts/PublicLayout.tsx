import { Outlet } from 'react-router-dom';
import { ThemeToggle } from '../components/layout/ThemeToggle';

export function PublicLayout() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-50">
      <header className="absolute top-0 w-full p-4 flex justify-end z-50">
        <ThemeToggle />
      </header>
      <main className="flex-1 flex flex-col justify-center items-center p-4">
        <Outlet />
      </main>
    </div>
  );
}
