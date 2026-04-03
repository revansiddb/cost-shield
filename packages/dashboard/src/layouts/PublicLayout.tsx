import { Outlet } from 'react-router-dom';
import { PublicHeader } from '../components/layout/PublicHeader';
import { PublicFooter } from '../components/layout/PublicFooter';

export function PublicLayout() {
  return (
    <div className="flex flex-col min-h-screen bg-background font-sans text-foreground relative">
      <PublicHeader />
      <main className="flex-1 flex flex-col relative w-full">
        {/* The Outlet renders the active route (Landing, Pricing, Docs, etc) */}
        {/* We do NOT enforce padding here, so pages can use top-spanning backgrounds beneath the transparent header */}
        <Outlet />
      </main>
      <PublicFooter />
    </div>
  );
}
