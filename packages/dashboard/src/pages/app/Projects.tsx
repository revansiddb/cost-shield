import { Link } from 'react-router-dom';
import { AlertTriangle, Loader2 } from 'lucide-react';
import { useProjects } from '../../hooks/useProjects';
import { CreateProjectDialog } from '../../components/projects/CreateProjectDialog';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../components/ui/table';
import { Badge } from '../../components/ui/badge';

export default function Projects() {
  const { projects, isLoading, isError, error } = useProjects();
  
  // Format Date compactly
  const formatDate = (isoString: string) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(new Date(isoString));
  };
  
  // Format currency cleanly
  const formatCurrency = (val: number | null) => {
    if (val === null || val === undefined) return '—';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(val);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Projects</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Manage your API cost tracking boundaries.</p>
        </div>
        <CreateProjectDialog />
      </div>

      {isError && (
        <div className="flex items-center space-x-2 p-3 text-sm font-medium rounded-md bg-destructive/10 text-destructive border border-destructive/20">
          <AlertTriangle className="h-4 w-4" />
          <span>Failed to load projects. {(error as any)?.message}</span>
        </div>
      )}

      <div className="rounded-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50 dark:bg-slate-900">
            <TableRow>
              <TableHead className="w-[250px]">Name</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Daily Budget</TableHead>
              <TableHead>Wait Threshold</TableHead>
              <TableHead>Key Prefix</TableHead>
              <TableHead className="text-right">Created At</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  <div className="flex items-center justify-center text-slate-500">
                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                    Loading projects...
                  </div>
                </TableCell>
              </TableRow>
            ) : projects.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-[200px] text-center">
                  <span className="text-sm text-slate-500 dark:text-slate-400">No projects yet. Create one to get started.</span>
                </TableCell>
              </TableRow>
            ) : (
              projects.map((project) => (
                <TableRow key={project.id} className="group cursor-pointer">
                  <TableCell className="font-medium text-slate-900 dark:text-slate-100">
                    <Link
                      to={`/app/projects/${project.id}`}
                      className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                    >
                      {project.name}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Badge variant={project.status === 'active' ? 'success' : 'secondary'} className="capitalize">
                      {project.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-slate-600 dark:text-slate-300">
                    {formatCurrency(project.dailyBudget)}
                  </TableCell>
                  <TableCell className="text-slate-600 dark:text-slate-300">
                    {project.alertThreshold}%
                  </TableCell>
                  <TableCell>
                    <code className="px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 text-xs font-mono text-slate-600 dark:text-slate-400">
                      {project.keyPrefix}...
                    </code>
                  </TableCell>
                  <TableCell className="text-right text-slate-500 dark:text-slate-400">
                    {formatDate(project.createdAt)}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
