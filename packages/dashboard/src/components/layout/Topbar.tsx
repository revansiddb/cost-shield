import { LogOut, Menu } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { useAuth } from '../../hooks/useAuth';
import { apiClient } from '../../api/axios';

interface TopbarProps {
  onMobileMenuOpen: () => void;
}

export function Topbar({ onMobileMenuOpen }: TopbarProps) {
  const { user } = useAuth();

  const handleLogout = async () => {
    try {
      await apiClient.post('/auth/logout');
      // Hard redirect to clear all react-query cache and state
      window.location.href = '/login';
    } catch (err) {
      console.error('Logout failed', err);
    }
  };

  return (
    <header className="h-14 bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-4 sm:px-6 lg:px-8">
      {/* Mobile Menu Button */}
      <div className="flex-1 md:hidden">
        <button
          onClick={onMobileMenuOpen}
          className="text-slate-500 hover:text-slate-900 dark:hover:text-slate-50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 rounded-md p-2 -ml-2"
        >
          <Menu className="h-6 w-6" aria-hidden="true" />
        </button>
      </div>

      <div className="flex-1 hidden md:flex" />

      {/* Right side controls */}
      <div className="flex items-center space-x-4">
        <ThemeToggle />
        
        {user && (
          <div className="flex items-center space-x-3 ml-4 pl-4 border-l border-slate-200 dark:border-slate-800">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300 hidden sm:block">
              {user.email}
            </span>
            <button
              onClick={handleLogout}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 focus:outline-none transition-colors"
              aria-label="Log out"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
