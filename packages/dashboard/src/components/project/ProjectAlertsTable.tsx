import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from '../ui/table';
import { Badge } from '../ui/badge';
import { Skeleton } from '../ui/skeleton';

import type { ProjectAlert } from '../../api/projects.api';

interface ProjectAlertsTableProps {
  alerts: ProjectAlert[];
  isLoading: boolean;
}

const formatCurrency = (cents: number) => `$${(cents / 100).toFixed(2)}`;

const formatDate = (dateStr: string) =>
  new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(dateStr));

const formatTime = (isoStr: string) =>
  new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).format(new Date(isoStr));

export function ProjectAlertsTable({ alerts, isLoading }: ProjectAlertsTableProps) {
  if (isLoading) {
    return (
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Alert Type</TableHead>
              <TableHead>Cost / Budget</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Triggered At</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 5 }).map((_, i) => (
              <TableRow key={i}>
                <TableCell><Skeleton className="h-5 w-16 rounded-full" /></TableCell>
                <TableCell><Skeleton className="h-4 w-28" /></TableCell>
                <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                <TableCell><Skeleton className="h-4 w-36" /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Alert Type</TableHead>
            <TableHead>Cost / Budget</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Triggered At</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {alerts.map((alert) => (
            <TableRow key={alert.id}>
              <TableCell>
                {alert.type === 'critical' ? (
                  <Badge variant="destructive">Critical</Badge>
                ) : (
                  <Badge className="border-transparent bg-amber-500 text-white hover:bg-amber-600">
                    Warning
                  </Badge>
                )}
              </TableCell>
              <TableCell>
                <span className="font-medium tabular-nums">
                  {formatCurrency(alert.cost)}
                </span>
                <span className="text-muted-foreground">
                  {' / '}{formatCurrency(alert.budget)}
                </span>
              </TableCell>
              <TableCell className="text-muted-foreground">
                {formatDate(alert.date)}
              </TableCell>
              <TableCell className="text-muted-foreground">
                {formatTime(alert.sentAt)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
