import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ShieldAlert } from 'lucide-react';
import { Button } from '../ui/button';
import { ThemeToggle } from './ThemeToggle';
import { cn } from '../../lib/utils';
import { useAuth } from '../../hooks/useAuth';

export function PublicHeader() {
  const { user } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300 h-16 flex items-center px-4 sm:px-6 lg:px-8',
        isScrolled
          ? 'bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800'
          : 'bg-transparent border-b border-transparent'
      )}
    >
      <div className="flex-1 flex items-center">
        <Link to="/" className="flex items-center gap-2 font-bold text-lg text-slate-900 dark:text-white hover:opacity-90 transition-opacity">
          <ShieldAlert className="w-6 h-6 text-indigo-600" />
          <span>CostShield</span>
        </Link>
      </div>

      {/* Desktop Navigation */}
      <nav className="hidden md:flex items-center gap-2">
        <Link 
          to="/" 
          className={cn(
            "text-sm font-medium transition-colors px-3 py-1.5 rounded-lg",
            location.pathname === '/' 
              ? "text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10" 
              : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/50"
          )}
        >
          Home
        </Link>
        <Link 
          to="/docs" 
          className={cn(
            "text-sm font-medium transition-colors px-3 py-1.5 rounded-lg",
            location.pathname.startsWith('/docs') 
              ? "text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10" 
              : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/50"
          )}
        >
          Docs
        </Link>
        {/* <Link 
          to="/pricing" 
          className={cn(
            "text-sm font-medium transition-colors px-3 py-1.5 rounded-lg",
            location.pathname === '/pricing' 
              ? "text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10" 
              : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/50"
          )}
        >
          Pricing
        </Link> */}
      </nav>

      {/* Desktop Actions */}
      <div className="hidden md:flex flex-1 items-center justify-end gap-3">
        <ThemeToggle />
        {user ? (
          <Link to="/app">
            <Button className="bg-gradient-to-r from-indigo-500 to-violet-600 text-white hover:shadow-lg hover:shadow-indigo-500/20 text-sm font-medium transition-all">
              Dashboard
            </Button>
          </Link>
        ) : (
          <Link to="/login">
            <Button className="bg-gradient-to-r from-indigo-500 to-violet-600 text-white hover:shadow-lg hover:shadow-indigo-500/20 text-sm font-medium transition-all">
              Get Started
            </Button>
          </Link>
        )}
      </div>

      {/* Mobile Menu Button */}
      <div className="flex md:hidden flex-1 justify-end items-center gap-2">
        <ThemeToggle />
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg focus:outline-none transition-colors"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 top-16 z-40 bg-white dark:bg-[#0B0E14] border-t border-slate-200 dark:border-slate-800 md:hidden flex flex-col pb-6 px-4 pt-4 shadow-xl overflow-y-auto">
          <nav className="flex flex-col gap-2 p-2">
            <Link 
              to="/" 
              className={cn(
                "text-lg font-medium px-4 py-3 rounded-xl transition-colors",
                location.pathname === '/'
                ? "text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10"
                : "text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50"
              )}
            >
              Home
            </Link>
            <Link 
              to="/docs" 
              className={cn(
                "text-lg font-medium px-4 py-3 rounded-xl transition-colors",
                location.pathname.startsWith('/docs')
                ? "text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10"
                : "text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50"
              )}
            >
              Docs
            </Link>
            {/* <Link 
              to="/pricing" 
              className={cn(
                "text-lg font-medium px-4 py-3 rounded-xl transition-colors",
                location.pathname === '/pricing'
                ? "text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10"
                : "text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50"
              )}
            >
              Pricing
            </Link> */}
            
            <hr className="border-slate-200 dark:border-slate-800 my-4" />
            
            {user ? (
              <Link to="/app" className="w-full mt-2">
                <Button className="w-full justify-center h-14 text-md bg-gradient-to-r from-indigo-500 to-violet-600 hover:shadow-xl hover:shadow-indigo-500/20 text-white rounded-xl">
                  Dashboard
                </Button>
              </Link>
            ) : (
              <Link to="/login" className="w-full mt-2">
                <Button className="w-full justify-center h-14 text-md bg-gradient-to-r from-indigo-500 to-violet-600 hover:shadow-xl hover:shadow-indigo-500/20 text-white rounded-xl">
                  Get Started
                </Button>
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
