import { LogOut, Menu, Book, ChevronDown, UserCircle2 } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { useAuth } from '../../hooks/useAuth';
import { apiClient } from '../../api/axios';
import { Link } from 'react-router-dom';

interface TopbarProps {
  onMobileMenuOpen: () => void;
}

export function Topbar({ onMobileMenuOpen }: TopbarProps) {
  const { user } = useAuth();

  const handleLogout = async () => {
    try {
      await apiClient.get('/auth/logout');
      // Hard redirect to clear all react-query cache and state
      window.location.href = '/login';
    } catch (err) {
      // Even if the API call fails, clear local state and redirect
      console.error('Logout error:', err);
      window.location.href = '/login';
    }
  };

  return (
    <header className="h-14 bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-4 sm:px-6 lg:px-8">
      {/* Mobile Menu Button & Left Controls */}
      <div className="flex items-center flex-1 gap-4">
        <button
          onClick={onMobileMenuOpen}
          className="md:hidden text-slate-500 hover:text-slate-900 dark:hover:text-slate-50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 rounded-md p-2 -ml-2"
        >
          <Menu className="h-6 w-6" aria-hidden="true" />
        </button>

        {/* Project Selector (Desktop) */}
        {/* <div className="hidden md:flex items-center gap-2 px-2.5 py-1.5 rounded-md hover:bg-slate-50 dark:hover:bg-slate-900 cursor-pointer transition-colors text-sm font-medium border border-transparent dark:hover:border-slate-800">
          <div className="w-5 h-5 rounded overflow-hidden bg-indigo-600 flex justify-center items-center">
            <span className="text-white text-[10px] font-bold">P</span>
          </div>
          <span className="text-slate-700 dark:text-slate-200">Personal Project</span>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
        </div> */}
      </div>

      {/* Docs Link */}
      <div className="flex flex-1 justify-center md:justify-end md:pr-6">
        <Link 
          to="/docs" 
          className="flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-900 dark:hover:text-slate-50 transition-colors"
        >
          <Book className="w-4 h-4" />
          <span className="hidden sm:inline">Documentation</span>
        </Link>
      </div>

      {/* Right side controls */}
      <div className="flex items-center space-x-2 sm:space-x-4">
        <ThemeToggle />
        
        {user && (
          <div className="flex items-center space-x-3 ml-2 pl-2 sm:ml-4 sm:pl-4 border-l border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity">
              <UserCircle2 className="w-6 h-6 text-slate-400" />
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300 hidden sm:block">
                {user.email || 'Developer'}
              </span>
            </div>
            
            <button
              onClick={handleLogout}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 focus:outline-none transition-colors ml-2"
              aria-label="Log out"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
