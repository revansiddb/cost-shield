import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Copy, Plus, AlertCircle, Check } from 'lucide-react';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
  DialogFooter,
} from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';

import { createProject } from '../../api/projects.api';
import type { CreateProjectPayload } from '../../api/projects.api';

export function CreateProjectDialog() {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [dailyBudget, setDailyBudget] = useState('');
  const [monthlyBudget, setMonthlyBudget] = useState('');
  const [alertThreshold, setAlertThreshold] = useState('80');

  // Success / Error States
  const [errorMsg, setErrorMsg] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [rawKey, setRawKey] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleReset = () => {
    setName('');
    setDailyBudget('');
    setMonthlyBudget('');
    setAlertThreshold('80');
    setErrorMsg('');
    setFieldErrors({});
    setRawKey(null);
    setCopied(false);
  };

  const onOpenChange = (newOpen: boolean) => {
    // If closing while key is shown, reset on close
    if (!newOpen) handleReset();
    setOpen(newOpen);
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    setFieldErrors({});

    const payload: CreateProjectPayload = {
      name,
      dailyBudget: dailyBudget ? parseFloat(dailyBudget) : undefined,
      monthlyBudget: monthlyBudget ? parseFloat(monthlyBudget) : undefined,
      alertThreshold: alertThreshold ? parseInt(alertThreshold, 10) : undefined,
    };

    try {
      const response = await createProject(payload);

      if (!response.success && response.error) {
        if (response.error.code === 'VALIDATION_ERROR' && response.error.details) {
          const newErrors: Record<string, string> = {};
          response.error.details.forEach((err) => {
            newErrors[err.field] = err.message;
          });
          setFieldErrors(newErrors);
        } else {
          setErrorMsg(response.error.message || 'An unexpected error occurred.');
        }
      } else if (response.success && response.data) {
        setRawKey(response.data.rawApiKey);
        // Refresh project list perfectly behind the dialog
        queryClient.invalidateQueries({ queryKey: ['projects'] });
      }
    } catch (err: any) {
      setErrorMsg('Failed to create project. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (rawKey) {
      navigator.clipboard.writeText(rawKey);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // 1) Render key successfully shown
  if (rawKey) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Project Created Successully</DialogTitle>
            <DialogDescription>
              Your new project <span className="font-semibold text-slate-900 dark:text-slate-50">{name}</span> is live.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col space-y-4 py-4">
            <div className="flex flex-col space-y-2 rounded-md bg-emerald-50 dark:bg-emerald-950/30 p-4 border border-emerald-200 dark:border-emerald-900/50">
              <div className="flex items-center space-x-2 text-emerald-600 dark:text-emerald-500 font-medium">
                <AlertCircle className="w-4 h-4" />
                <span className="text-sm">Store this API key safely</span>
              </div>
              <p className="text-sm text-emerald-700/80 dark:text-emerald-500/80">
                This is the only time the full API key will be shown. You cannot recover it later.
              </p>
            </div>

            <div className="flex items-center space-x-2 mt-4 relative">
              <Input
                readOnly
                value={rawKey}
                className="font-mono text-xs pr-12 bg-slate-50 dark:bg-slate-900"
              />
              <Button
                size="sm"
                variant="outline"
                className="absolute right-1 top-1 h-8 px-2"
                onClick={handleCopy}
              >
                {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4 text-slate-500" />}
              </Button>
            </div>
          </div>

          <DialogFooter>
            <Button onClick={() => setOpen(false)}>Done</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  // 2) Normal Form Render
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button className="h-9 px-4">
          <Plus className="mr-2 h-4 w-4" /> Create Project
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Project</DialogTitle>
          <DialogDescription>
            Define a clear boundary for monitoring cost data.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={onSubmit} className="space-y-4 py-4">
          {errorMsg && (
            <div className="text-sm font-medium text-destructive bg-destructive/10 p-3 rounded-md">
              {errorMsg}
            </div>
          )}

          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="name">Project Name <span className="text-destructive">*</span></Label>
            <Input
              id="name"
              placeholder="e.g. Production Core"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={loading}
              className={fieldErrors.name ? "border-destructive focus-visible:ring-destructive" : ""}
            />
            {fieldErrors.name && (
              <p className="text-xs text-destructive">{fieldErrors.name}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="dailyBudget">Daily Budget ($)</Label>
              <Input
                id="dailyBudget"
                type="number"
                step="0.01"
                placeholder="Optional"
                value={dailyBudget}
                onChange={(e) => setDailyBudget(e.target.value)}
                disabled={loading}
              />
              {fieldErrors.dailyBudget && (
                <p className="text-xs text-destructive">{fieldErrors.dailyBudget}</p>
              )}
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="monthlyBudget">Monthly Budget ($)</Label>
              <Input
                id="monthlyBudget"
                type="number"
                step="0.01"
                placeholder="Optional"
                value={monthlyBudget}
                onChange={(e) => setMonthlyBudget(e.target.value)}
                disabled={loading}
              />
              {fieldErrors.monthlyBudget && (
                <p className="text-xs text-destructive">{fieldErrors.monthlyBudget}</p>
              )}
            </div>
          </div>

          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="alertThreshold">Alert Threshold (%)</Label>
            <Input
              id="alertThreshold"
              type="number"
              min="1"
              max="100"
              placeholder="80"
              value={alertThreshold}
              onChange={(e) => setAlertThreshold(e.target.value)}
              disabled={loading}
            />
            <p className="text-xs text-slate-500 dark:text-slate-400">
              When spend reaches this % of your budget, we trigger an alert.
            </p>
          </div>

          <DialogFooter className="pt-4 mt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create Project"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
