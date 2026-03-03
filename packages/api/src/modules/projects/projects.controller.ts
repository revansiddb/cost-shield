import { Request, Response } from 'express';

import { logger } from '../../utils/logger';

import { projectsService, CreateProjectDTO } from './projects.service';

export const projectsController = {
  /**
   * POST /api/v1/projects
   */
  async createProject(req: Request<{}, {}, CreateProjectDTO>, res: Response): Promise<void> {
    try {
      const userId = req.user!.id; // Safely asserted because of auth middleware
      const { name, dailyBudget, monthlyBudget, alertThreshold } = req.body;

      // 1. Service execution (Validation handled by express-validator boundary)
      const { project, rawKey } = await projectsService.createProject(userId, {
        name,
        dailyBudget,
        monthlyBudget,
        alertThreshold: alertThreshold !== undefined ? alertThreshold : 80,
      });

      // 2. Render safe response
      res.status(201).json({
        success: true,
        data: {
          id: project.id,
          name: project.name,
          dailyBudget: Number(project.dailyBudget),
          alertThreshold: project.alertThreshold,
          keyPrefix: project.keyPrefix,
          rawApiKey: rawKey, // explicitly returning this once
        },
      });
    } catch (error) {
      logger.error('Failed to create project', {
        error: error instanceof Error ? error.message : String(error),
      });
      res.status(500).json({ 
        success: false, 
        error: { code: 'INTERNAL_ERROR', message: 'Internal Server Error' } 
      });
    }
  },

  /**
   * GET /api/v1/projects
   */
  async listProjects(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user!.id;
      const projects = await projectsService.listProjects(userId);

      res.status(200).json({
        success: true,
        data: projects,
      });
    } catch (error) {
      logger.error('Failed to list projects', {
        error: error instanceof Error ? error.message : String(error),
      });
      res.status(500).json({ 
        success: false, 
        error: { code: 'INTERNAL_ERROR', message: 'Internal Server Error' } 
      });
    }
  },

  /**
   * GET /api/v1/projects/:id
   */
  async getProjectById(req: Request<{ id: string }>, res: Response): Promise<void> {
    try {
      const userId = req.user!.id;
      const projectId = req.params.id;

      const project = await projectsService.getProjectById(userId, projectId);

      if (!project) {
        res.status(404).json({ 
          success: false, 
          error: { code: 'NOT_FOUND', message: 'Project not found' } 
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: project,
      });
    } catch (error) {
      logger.error('Failed to get project', {
        error: error instanceof Error ? error.message : String(error),
      });
      res.status(500).json({ 
        success: false, 
        error: { code: 'INTERNAL_ERROR', message: 'Internal Server Error' } 
      });
    }
  },
};
