import { Link } from 'react-router-dom';
import { ShieldAlert } from 'lucide-react';

export function PublicFooter() {
  return (
    <footer className="w-full border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 py-12 md:py-16">
      <div className="max-w-[1200px] mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
        <div className="col-span-2 md:col-span-1 flex flex-col gap-4">
          <Link to="/" className="flex items-center gap-2 font-bold text-lg text-slate-900 dark:text-white">
            <ShieldAlert className="w-6 h-6 text-indigo-600" />
            <span>CostShield</span>
          </Link>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 max-w-xs">
            We track cost metadata, not your data.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <h4 className="font-semibold text-slate-900 dark:text-white">Product</h4>
          <Link to="/docs" className="text-sm text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
            Docs
          </Link>
          <Link to="/pricing" className="text-sm text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
            Pricing
          </Link>
        </div>

        <div className="flex flex-col gap-3">
          <h4 className="font-semibold text-slate-900 dark:text-white">Company</h4>
          <Link to="/about" className="text-sm text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
            About
          </Link>
          <Link to="/contact" className="text-sm text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
            Contact
          </Link>
        </div>

        <div className="flex flex-col gap-3">
          <h4 className="font-semibold text-slate-900 dark:text-white">Legal</h4>
          <Link to="/terms" className="text-sm text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
            Terms
          </Link>
          <Link to="/privacy" className="text-sm text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
            Privacy
          </Link>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-6 mt-16 pt-8 border-t border-slate-200 dark:border-slate-800 flex justify-between items-center text-sm text-slate-500 dark:text-slate-400">
        <p>&copy; {new Date().getFullYear()} CostShield</p>
      </div>
    </footer>
  );
}
