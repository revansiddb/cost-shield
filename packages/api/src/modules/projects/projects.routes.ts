import { Router } from 'express';

import { requireAuth } from '../../middlewares/auth';
import { validateRequest } from '../../middlewares/validateRequest';

import { createProjectValidator } from './projects.validator';
import { projectsController } from './projects.controller';

const router = Router();

// All project routes require authentication
router.use(requireAuth);

router.post('/', createProjectValidator, validateRequest, projectsController.createProject.bind(projectsController));
router.get('/', projectsController.listProjects.bind(projectsController));
router.get('/:id', projectsController.getProjectById.bind(projectsController));

export { router as projectsRoutes };
