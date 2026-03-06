import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, AlertTriangle, Bell } from 'lucide-react';

import { useProjectAlerts } from '../../hooks/useProjectAlerts';
import { ProjectAlertsTable } from '../../components/project/ProjectAlertsTable';
import { Button } from '../../components/ui/button';

export default function ProjectAlerts() {
  const { id } = useParams<{ id: string }>();
  const { alerts, isLoading, isError } = useProjectAlerts(id);

  const hasCritical = alerts.some((a) => a.type === 'critical');

  return (
    <div className="space-y-6">
      {/* ─── Back Link ────────────────────────────────────────────────── */}
      <Link
        to={`/app/projects/${id}`}
        className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="mr-1 h-4 w-4" /> Back to Project
      </Link>

      {/* ─── Page Header ──────────────────────────────────────────────── */}
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">Alert History</h1>
        <p className="text-sm text-muted-foreground">
          See when your project approached or exceeded its cost budget.
        </p>
      </div>

      {/* ─── Critical Banner ──────────────────────────────────────────── */}
      {!isLoading && hasCritical && (
        <div className="flex items-center space-x-2 p-3 text-sm font-medium rounded-md bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-900/50">
          <AlertTriangle className="h-4 w-4 flex-shrink-0" />
          <span>Critical budget alerts have occurred for this project.</span>
        </div>
      )}

      {/* ─── Error State ──────────────────────────────────────────────── */}
      {isError && (
        <div className="flex flex-col items-center justify-center py-16 space-y-4">
          <AlertTriangle className="h-10 w-10 text-slate-400" />
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Failed to load alerts.
          </p>
          <Link to={`/app/projects/${id}`}>
            <Button variant="outline" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Project
            </Button>
          </Link>
        </div>
      )}

      {/* ─── Table or Empty State ─────────────────────────────────────── */}
      {!isError && alerts.length === 0 && !isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 space-y-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
          <Bell className="h-10 w-10 text-slate-300 dark:text-slate-600" />
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
            No alerts have been triggered yet.
          </p>
          <p className="text-xs text-slate-400 dark:text-slate-500 max-w-xs text-center">
            Alerts appear here when your project approaches or exceeds its budget.
          </p>
        </div>
      ) : !isError ? (
        <ProjectAlertsTable alerts={alerts} isLoading={isLoading} />
      ) : null}
    </div>
  );
}
