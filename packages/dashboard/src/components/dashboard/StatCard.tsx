import { cn } from '../../lib/utils';

interface StatCardProps {
  label: string;
  value: string | number;
  suffix?: string;
  variant?: 'default' | 'warning' | 'critical' | 'success';
}

const variantStyles = {
  default: 'text-slate-900 dark:text-slate-50',
  warning: 'text-amber-600 dark:text-amber-500',
  critical: 'text-red-600 dark:text-red-500',
  success: 'text-emerald-600 dark:text-emerald-500',
};

export function StatCard({ label, value, suffix, variant = 'default' }: StatCardProps) {
  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-4">
      <p className="text-sm text-muted-foreground">{label}</p>
      <div className="mt-1 flex items-baseline space-x-1">
        <span className={cn('text-3xl font-semibold tracking-tight', variantStyles[variant])}>
          {value}
        </span>
        {suffix && (
          <span className="text-sm text-muted-foreground">{suffix}</span>
        )}
      </div>
    </div>
  );
}
