import { body } from 'express-validator';

export const trackValidator = [
  body('apiKey')
    .exists({ checkFalsy: true }).withMessage('API key is required')
    .isString().withMessage('API key must be a string')
    .isLength({ min: 10 }).withMessage('API key is too short'),
  
  body('cost')
    .exists({ checkNull: true }).withMessage('Cost is required')
    .isInt({ min: 0 }).withMessage('Cost must be an integer strictly greater than or equal to 0'),
    
  body('featureId')
    .optional()
    .isString().withMessage('featureId must be a string'),

  body('userId')
    .optional()
    .isString().withMessage('userId must be a string'),
];
