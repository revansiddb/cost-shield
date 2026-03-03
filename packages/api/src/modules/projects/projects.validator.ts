import { body } from 'express-validator';

export const createProjectValidator = [
  body('name')
    .exists({ checkFalsy: true }).withMessage('Project name is required')
    .isString().withMessage('Project name must be a string')
    .isLength({ min: 2, max: 255 }).withMessage('Name must be between 2 and 255 characters'),
    
  body('dailyBudget')
    .exists({ checkNull: true }).withMessage('dailyBudget is required')
    // We expect it as an integer because the schema requires limits to be absolute bigint smallest units (e.g. cents)
    .isInt({ min: 0 }).withMessage('dailyBudget must be a non-negative integer'),

  body('monthlyBudget')
    .optional()
    .isInt({ min: 0 }).withMessage('monthlyBudget must be a non-negative integer'),

  body('alertThreshold')
    .optional()
    .isInt({ min: 0, max: 100 }).withMessage('alertThreshold must be an integer between 0 and 100'),
];
