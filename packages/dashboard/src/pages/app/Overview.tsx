import { useState } from 'react';
import { AlertTriangle, CheckCircle2 } from 'lucide-react';

import { useDashboard } from '../../hooks/useDashboard';
import { useProjects } from '../../hooks/useProjects';
import { StatCard } from '../../components/dashboard/StatCard';
import { TrendChart } from '../../components/dashboard/TrendChart';
import { ProjectHealthTable } from '../../components/dashboard/ProjectHealthTable';
import { Skeleton } from '../../components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';

type RangeOption = '7d' | '30d';

export default function Overview() {
  const [range, setRange] = useState<RangeOption>('7d');
  const [projectId, setProjectId] = useState<string>('all');

  const { data: dashboard, isLoading: isDashboardLoading, isError: isDashboardError } = useDashboard({
    range,
    projectId,
  });

  const { projects: userProjects, isLoading: isProjectsLoading } = useProjects();

  const formatCurrency = (val: number) => {
    return `$${(val / 100).toFixed(2)}`;
  };

  const getTrialVariant = (daysRemaining: number, isExpired: boolean) => {
    if (isExpired) return 'critical';
    if (daysRemaining <= 3) return 'warning';
    return 'default';
  };

  if (isDashboardError) {
    return (
      <div className="flex flex-col items-center justify-center py-24 space-y-4">
        <AlertTriangle className="h-10 w-10 text-slate-400" />
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Unable to load dashboard data.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* ─── Header & Filters ────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Overview</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            High-level view of your connected infrastructure.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          {/* Project Filter */}
          <Select value={projectId} onValueChange={setProjectId} disabled={isProjectsLoading}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Projects" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Projects</SelectItem>
              {userProjects?.map((p) => (
                <SelectItem key={p.id} value={p.id}>
                  {p.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Range Filter */}
          <Select value={range} onValueChange={(val) => setRange(val as RangeOption)}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="7 days" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* ─── Spike Indicator ─────────────────────────────────────────── */}
      {!isDashboardLoading && dashboard?.spike.detected && (
        <div className="flex items-start space-x-3 p-4 text-sm font-medium rounded-xl bg-amber-50 dark:bg-amber-950/30 text-amber-800 dark:text-amber-400 border border-amber-200 dark:border-amber-900/50">
          <AlertTriangle className="h-5 w-5 flex-shrink-0 mt-0.5" />
          <div className="flex flex-col">
            <span className="font-semibold mb-1">⚡ Cost spike detected in {dashboard.spike.projectName}</span>
            <span className="text-amber-700/80 dark:text-amber-400/80">
              A cost of {formatCurrency(dashboard.spike.cost ?? 0)} was tracked at {new Date(dashboard.spike.time ?? '').toLocaleTimeString()}.
            </span>
          </div>
        </div>
      )}

      {!isDashboardLoading && !dashboard?.spike.detected && (
        <div className="flex items-center space-x-2 text-sm text-slate-500 dark:text-slate-400">
          <CheckCircle2 className="h-4 w-4 text-emerald-500" />
          <span>No unusual cost spikes detected today.</span>
        </div>
      )}

      {/* ─── Stats Grid ──────────────────────────────────────────────── */}
      {isDashboardLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-[104px] rounded-xl" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            label="Today's Cost"
            value={formatCurrency(dashboard?.todayCost ?? 0)}
          />
          <StatCard
            label="Cost This Month"
            value={formatCurrency(dashboard?.monthCost ?? 0)}
          />
          <StatCard
            label="Active Projects"
            value={dashboard?.activeProjects ?? 0}
          />
          <StatCard
            label="Trial Remaining"
            value={dashboard?.trial?.daysRemaining ?? 0}
            suffix={dashboard?.trial?.isExpired ? '' : 'days'}
            variant={dashboard?.trial ? getTrialVariant(dashboard.trial.daysRemaining, dashboard.trial.isExpired) : 'default'}
          />
        </div>
      )}

      {/* ─── Trend Chart ─────────────────────────────────────────────── */}
      {isDashboardLoading ? (
        <Skeleton className="h-[280px] w-full rounded-xl" />
      ) : (
        <TrendChart data={dashboard?.trend ?? []} />
      )}

      {/* ─── Project Health Table ────────────────────────────────────── */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold tracking-tight">Project Health</h2>
        {isDashboardLoading ? (
          <Skeleton className="h-[200px] w-full rounded-xl" />
        ) : (
          <ProjectHealthTable projects={dashboard?.projectsSummary ?? []} />
        )}
      </div>
    </div>
  );
}
