import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, AlertTriangle, Bell } from 'lucide-react';

import { useProjectDetail } from '../../hooks/useProjectDetail';
import { StatCard } from '../../components/dashboard/StatCard';
import { TrendChart } from '../../components/dashboard/TrendChart';
import { ProjectSettingsModal } from '../../components/project/ProjectSettingsModal';
import { Button } from '../../components/ui/button';
import { Skeleton } from '../../components/ui/skeleton';
import { Badge } from '../../components/ui/badge';
import { cn } from '../../lib/utils';

type DateRange = '7d' | '30d';

export default function ProjectDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [dateRange, setDateRange] = useState<DateRange>('7d');

  const { project, todayUsage, trend, trial, isLoading, isError } = useProjectDetail(id);

  const formatCurrency = (val: number) => {
    return `$${(val / 100).toFixed(2)}`;
  };

  const getBudgetVariant = (percent: number) => {
    if (percent >= 90) return 'critical';
    if (percent >= 70) return 'warning';
    return 'default';
  };

  const getTrialVariant = (daysRemaining: number) => {
    if (daysRemaining === 0) return 'critical';
    if (daysRemaining <= 3) return 'warning';
    return 'default';
  };

  // ─── Loading State ─────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-40" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Skeleton className="h-24 rounded-xl" />
          <Skeleton className="h-24 rounded-xl" />
          <Skeleton className="h-24 rounded-xl" />
        </div>
        <Skeleton className="h-[280px] rounded-xl" />
      </div>
    );
  }

  // ─── Error State ───────────────────────────────────────────────────
  if (isError || !project) {
    return (
      <div className="flex flex-col items-center justify-center py-24 space-y-4">
        <AlertTriangle className="h-10 w-10 text-slate-400" />
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Project not found.
        </p>
        <Link to="/app/projects">
          <Button variant="outline" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Projects
          </Button>
        </Link>
      </div>
    );
  }

  const formattedDate = new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(project.createdAt));

  return (
    <div className="space-y-6">
      {/* ─── Back Link ──────────────────────────────────────────────── */}
      <Link
        to="/app/projects"
        className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="mr-1 h-4 w-4" /> Projects
      </Link>

      {/* ─── Section 1: Project Header ──────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">{project.name}</h1>
          <div className="flex items-center space-x-3 text-sm text-muted-foreground">
            <code className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-xs font-mono">
              {project.keyPrefix}...
            </code>
            <span>Created {formattedDate}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* ── Date Range Toggle ── */}
          <div className="flex items-center rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 p-0.5 gap-0.5">
            {(['7d', '30d'] as DateRange[]).map((range) => (
              <button
                key={range}
                onClick={() => setDateRange(range)}
                className={cn(
                  'px-3 py-1.5 text-xs font-semibold rounded-md transition-all duration-150',
                  dateRange === range
                    ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm border border-slate-200 dark:border-slate-700'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                )}
              >
                {range === '7d' ? 'Last 7 days' : 'Last 30 days'}
              </button>
            ))}
          </div>

          <Button variant="outline" size="sm" onClick={() => navigate(`/app/projects/${id}/alerts`)}>
            <Bell className="mr-2 h-4 w-4" /> View Alerts
          </Button>
          <ProjectSettingsModal project={project} />
        </div>
      </div>

      {/* ─── Trial Warning Banner ───────────────────────────────────── */}
      {trial && trial.isExpired && (
        <div className="flex items-center space-x-2 p-3 text-sm font-medium rounded-md bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-900/50">
          <AlertTriangle className="h-4 w-4 flex-shrink-0" />
          <span>Your trial has expired. Upgrade your plan to continue creating projects.</span>
        </div>
      )}
      {trial && !trial.isExpired && trial.daysRemaining <= 3 && (
        <div className="flex items-center space-x-2 p-3 text-sm font-medium rounded-md bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-900/50">
          <AlertTriangle className="h-4 w-4 flex-shrink-0" />
          <span>Your trial expires in {trial.daysRemaining} day{trial.daysRemaining !== 1 ? 's' : ''}. Consider upgrading.</span>
        </div>
      )}

      {/* ─── Section 2: Stats Grid ──────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard
          label="Today's Cost"
          value={todayUsage ? formatCurrency(todayUsage.cost) : '$0.00'}
        />
        <StatCard
          label="Daily Budget Used"
          value={todayUsage ? `${todayUsage.budgetPercent}` : '0'}
          suffix="%"
          variant={todayUsage ? getBudgetVariant(todayUsage.budgetPercent) : 'default'}
        />
        <StatCard
          label="Trial Days Remaining"
          value={trial ? trial.daysRemaining : 0}
          suffix={trial?.isExpired ? '' : 'days'}
          variant={trial ? getTrialVariant(trial.daysRemaining) : 'default'}
        />
      </div>

      {/* ─── Section 3: Cost Trend Chart (respects dateRange) ────────── */}
      <TrendChart data={trend} days={dateRange === '7d' ? 7 : 30} />

      {/* ─── Section 4: Trial Status Footer ─────────────────────────── */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-4 flex items-center justify-between">
        <div className="space-y-0.5">
          <p className="text-sm font-medium">Subscription Status</p>
          <p className="text-xs text-muted-foreground">
            {trial?.isExpired
              ? 'Your free trial has ended.'
              : `Your trial expires in ${trial?.daysRemaining ?? 0} days.`}
          </p>
        </div>
        {trial?.isExpired ? (
          <Badge variant="destructive">Trial Expired</Badge>
        ) : (
          <Badge variant="success">Active Trial</Badge>
        )}
      </div>
    </div>
  );
}
