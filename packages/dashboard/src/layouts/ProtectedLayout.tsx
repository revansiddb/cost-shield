import { useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { Sidebar } from '../components/layout/Sidebar';
import { Topbar } from '../components/layout/Topbar';
import { useAuth } from '../hooks/useAuth';
import { Loader2 } from 'lucide-react';

export function ProtectedLayout() {
  const { user, isLoading } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Still checking user identity, don't flash login
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <Loader2 className="h-8 w-8 text-indigo-500 animate-spin" />
      </div>
    );
  }

  // Not authenticated? Bye.
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Desktop Sidebar */}
      <Sidebar />

      {/* Main Column */}
      <div className="flex flex-1 flex-col min-w-0">
        <Topbar onMobileMenuOpen={() => setMobileMenuOpen(true)} />
        
        {/* Page Content Centered */}
        <main className="flex-1 overflow-y-auto outline-none">
          <div className="max-w-[1200px] mx-auto p-4 sm:p-6 lg:p-8">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Mobile Drawer (Placeholder for simple impl) */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
          <div className="relative flex w-64 flex-col bg-white dark:bg-slate-950 p-4 pt-5 pb-4">
             {/* Just a simple inline mobile close mapping. Full shadcn sheet can be swapped if needed. */}
            <div className="flex items-center justify-between mb-6">
              <span className="font-semibold text-lg dark:text-white">CostShield</span>
              <button className="text-slate-500" onClick={() => setMobileMenuOpen(false)}>Close</button>
            </div>
            <Sidebar /> {/* For strictness, you'd usually abstract the links, but sticking to basic CSS hide/show */}
          </div>
        </div>
      )}
    </div>
  );
}
