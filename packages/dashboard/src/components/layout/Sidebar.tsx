import { NavLink } from 'react-router-dom';
import { Home, FolderGit2, Settings, ShieldAlert, Bell } from 'lucide-react';
import { cn } from '../../lib/utils';

export function Sidebar() {
  const navItems = [
    { label: 'Overview', path: '/app', icon: Home, exact: true },
    { label: 'Projects', path: '/app/projects', icon: FolderGit2, exact: false },
    { label: 'Alerts', path: '/app/alerts', icon: Bell, exact: false },
    { label: 'Settings', path: '/app/settings', icon: Settings, exact: false },
  ];

  return (
    <aside className="w-64 flex-shrink-0 border-r border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950 flex flex-col hidden md:flex min-h-screen">
      <div className="h-14 flex items-center px-6 border-b border-slate-200 dark:border-slate-800">
        <ShieldAlert className="text-indigo-600 dark:text-indigo-500 mr-2" size={24} />
        <span className="font-semibold text-lg tracking-tight text-slate-900 dark:text-slate-50">CostShield</span>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.exact}
            className={({ isActive }) =>
              cn(
                'group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors',
                isActive
                  ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-300'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/50 dark:hover:text-slate-50'
              )
            }
          >
            <item.icon
              className="mr-3 flex-shrink-0 h-5 w-5"
              aria-hidden="true"
            />
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
