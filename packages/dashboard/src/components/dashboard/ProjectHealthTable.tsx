import { useNavigate } from 'react-router-dom';
import type { DashboardProjectSummary } from '@costshield/shared';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import { Badge } from '../ui/badge';

interface ProjectHealthTableProps {
  projects: DashboardProjectSummary[];
}

export function ProjectHealthTable({ projects }: ProjectHealthTableProps) {
  const navigate = useNavigate();

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val / 100);

  if (!projects || projects.length === 0) {
    return (
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 flex flex-col items-center justify-center p-8 text-center">
        <p className="text-sm text-muted-foreground">No projects found. Create one to start tracking costs.</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
            <TableRow>
              <TableHead className="w-[200px]">Project</TableHead>
              <TableHead>Today's Cost</TableHead>
              <TableHead>Daily Budget</TableHead>
              <TableHead>Usage %</TableHead>
              <TableHead className="text-right">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {projects.map((p) => (
              <TableRow
                key={p.id}
                onClick={() => navigate(`/app/projects/${p.id}`)}
                className="cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors"
              >
                <TableCell className="font-medium text-slate-900 dark:text-slate-100">
                  <span className="hover:text-indigo-600 dark:hover:text-indigo-400">
                    {p.name}
                  </span>
                </TableCell>
                <TableCell className="text-slate-600 dark:text-slate-300">
                  {formatCurrency(p.todayCost)}
                </TableCell>
                <TableCell className="text-slate-600 dark:text-slate-300">
                  {formatCurrency(p.dailyBudget)}
                </TableCell>
                <TableCell className="text-slate-600 dark:text-slate-300">
                  {p.budgetPercent}%
                </TableCell>
                <TableCell className="text-right">
                  <Badge variant={p.status === 'critical' ? 'destructive' : p.status === 'warning' ? 'default' : 'success'} className={
                    p.status === 'warning' ? 'bg-amber-500 hover:bg-amber-600 text-white border-transparent' : ''
                  }>
                    {p.status.charAt(0).toUpperCase() + p.status.slice(1)}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
