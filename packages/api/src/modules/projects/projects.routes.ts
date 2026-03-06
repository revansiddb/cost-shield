import { Router } from 'express';

import { requireAuth } from '../../middlewares/auth';
import { validateRequest } from '../../middlewares/validateRequest';
import { requireActiveSubscription } from '../../middlewares/subscription';

import { createProjectValidator, updateProjectSettingsValidator } from './projects.validator';
import { projectsController } from './projects.controller';

const router = Router();

// All project routes require authentication
router.use(requireAuth);

router.post(
  '/',
  requireActiveSubscription,
  createProjectValidator,
  validateRequest,
  projectsController.createProject.bind(projectsController)
);
router.get('/', projectsController.listProjects.bind(projectsController));
router.get('/:id', projectsController.getProjectById.bind(projectsController));
router.patch(
  '/:id',
  updateProjectSettingsValidator,
  validateRequest,
  projectsController.updateProjectSettings.bind(projectsController)
);

export { router as projectsRoutes };
