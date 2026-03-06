import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Settings, Loader2 } from 'lucide-react';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';

import { updateProject } from '../../api/projects.api';
import type { UpdateProjectPayload, ProjectDetailMeta } from '../../api/projects.api';
import { useToast } from '../../hooks/use-toast';

interface FormValues {
  name: string;
  dailyBudget: string;
  alertThreshold: string;
}

interface ProjectSettingsModalProps {
  project: ProjectDetailMeta;
}

export function ProjectSettingsModal({ project }: ProjectSettingsModalProps) {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      name: project.name,
      dailyBudget: String(project.dailyBudget / 100),
      alertThreshold: String(project.alertThreshold),
    },
  });

  useEffect(() => {
    if (open) {
      reset({
        name: project.name,
        dailyBudget: String(project.dailyBudget / 100),
        alertThreshold: String(project.alertThreshold),
      });
    }
  }, [open, project, reset]);

  const mutation = useMutation({
    mutationKey: ['update-project', project.id],
    mutationFn: (payload: UpdateProjectPayload) =>
      updateProject(project.id, payload),
    onSuccess: (response) => {
      if (!response.success && response.error) {
        if (response.error.code === 'VALIDATION_ERROR' && response.error.details) {
          response.error.details.forEach((err) => {
            const field = err.field as keyof FormValues;
            if (field in errors || ['name', 'dailyBudget', 'alertThreshold'].includes(field)) {
              setError(field, { message: err.message });
            }
          });
        } else {
          toast({
            title: 'Update failed',
            description: response.error.message || 'An unexpected error occurred.',
            variant: 'destructive',
          });
        }
        return;
      }

      queryClient.invalidateQueries({ queryKey: ['project-detail', project.id] });
      toast({ title: 'Project settings updated' });
      setOpen(false);
    },
    onError: () => {
      toast({
        title: 'Update failed',
        description: 'Could not save settings. Please try again.',
        variant: 'destructive',
      });
    },
  });

  const onSubmit = (values: FormValues) => {
    const payload: UpdateProjectPayload = {
      name: values.name.trim(),
      dailyBudget: parseFloat(values.dailyBudget),
      alertThreshold: parseInt(values.alertThreshold, 10),
    };
    mutation.mutate(payload);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
        <Settings className="mr-2 h-4 w-4" /> Settings
      </Button>

      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Project Settings</DialogTitle>
          <DialogDescription>
            Update configuration for <span className="font-semibold text-foreground">{project.name}</span>.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-2">
          {/* ─── Project Name ──────────────────────────────────────── */}
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="settings-name">
              Project Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="settings-name"
              placeholder="e.g. Production Core"
              disabled={mutation.isPending}
              className={errors.name ? 'border-destructive focus-visible:ring-destructive' : ''}
              {...register('name', {
                required: 'Project name is required',
                minLength: { value: 2, message: 'Name must be at least 2 characters' },
              })}
            />
            {errors.name && (
              <p className="text-xs text-destructive">{errors.name.message}</p>
            )}
          </div>

          {/* ─── Daily Budget ──────────────────────────────────────── */}
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="settings-dailyBudget">
              Daily Budget ($) <span className="text-destructive">*</span>
            </Label>
            <Input
              id="settings-dailyBudget"
              type="number"
              step="0.01"
              disabled={mutation.isPending}
              className={errors.dailyBudget ? 'border-destructive focus-visible:ring-destructive' : ''}
              {...register('dailyBudget', {
                required: 'Daily budget is required',
                validate: (v) => parseFloat(v) > 0 || 'Must be greater than 0',
              })}
            />
            <p className="text-xs text-muted-foreground">
              Daily budget used for cost alerts and spike detection.
            </p>
            {errors.dailyBudget && (
              <p className="text-xs text-destructive">{errors.dailyBudget.message}</p>
            )}
          </div>

          {/* ─── Alert Threshold ───────────────────────────────────── */}
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="settings-alertThreshold">
              Alert Threshold (%) <span className="text-destructive">*</span>
            </Label>
            <Input
              id="settings-alertThreshold"
              type="number"
              min="1"
              max="100"
              disabled={mutation.isPending}
              className={errors.alertThreshold ? 'border-destructive focus-visible:ring-destructive' : ''}
              {...register('alertThreshold', {
                required: 'Alert threshold is required',
                validate: (v) => {
                  const n = parseInt(v, 10);
                  if (n < 1 || n > 100) return 'Must be between 1 and 100';
                  return true;
                },
              })}
            />
            {errors.alertThreshold && (
              <p className="text-xs text-destructive">{errors.alertThreshold.message}</p>
            )}
          </div>

          {/* ─── Footer ────────────────────────────────────────────── */}
          <DialogFooter className="pt-4 mt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={mutation.isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving…
                </>
              ) : (
                'Save Changes'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
