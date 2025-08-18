import { body, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

// Handle validation results
export const handleValidationErrors = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      error: 'Validation failed',
      details: errors.array().map(error => ({
        field: error.type === 'field' ? (error as any).path : 'unknown',
        message: error.msg
      }))
    });
  }
  next();
};

// Registration validation
export const validateRegistration = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters')
    .escape(),
  
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one lowercase letter, one uppercase letter, and one number'),
  
  body('date_of_birth')
    .optional()
    .isDate()
    .withMessage('Please provide a valid date of birth'),
  
  body('daily_calorie_goal')
    .optional()
    .isInt({ min: 500, max: 10000 })
    .withMessage('Daily calorie goal must be between 500 and 10,000'),
  
  body('daily_protein_goal')
    .optional()
    .isInt({ min: 10, max: 1000 })
    .withMessage('Daily protein goal must be between 10 and 1,000 grams'),
  
  handleValidationErrors
];

// Login validation
export const validateLogin = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
  
  handleValidationErrors
];

// Food validation
export const validateFood = [
  body('name')
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage('Food name must be between 1 and 200 characters')
    .escape(),
  
  body('calories')
    .isFloat({ min: 0, max: 10000 })
    .withMessage('Calories must be between 0 and 10,000'),
  
  body('protein')
    .isFloat({ min: 0, max: 1000 })
    .withMessage('Protein must be between 0 and 1,000 grams'),
  
  body('carbs')
    .optional()
    .isFloat({ min: 0, max: 1000 })
    .withMessage('Carbs must be between 0 and 1,000 grams'),
  
  body('fat')
    .optional()
    .isFloat({ min: 0, max: 1000 })
    .withMessage('Fat must be between 0 and 1,000 grams'),
  
  body('serving_size')
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Serving size must be between 1 and 100 characters')
    .escape(),
  
  body('serving_count')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Serving count must be between 1 and 100'),
  
  handleValidationErrors
];

// Meal validation
export const validateMeal = [
  body('meal_name')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Meal name must be between 1 and 100 characters')
    .escape(),
  
  body('user_id')
    .isInt({ min: 1 })
    .withMessage('Valid user ID is required'),
  
  body('date')
    .isDate()
    .withMessage('Please provide a valid date'),
  
  handleValidationErrors
];

// User preferences validation
export const validateUserPreferences = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters')
    .escape(),
  
  body('email')
    .optional()
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  
  body('date_of_birth')
    .optional()
    .isDate()
    .withMessage('Please provide a valid date of birth'),
  
  body('daily_calorie_goal')
    .optional()
    .isInt({ min: 500, max: 10000 })
    .withMessage('Daily calorie goal must be between 500 and 10,000'),
  
  body('daily_protein_goal')
    .optional()
    .isInt({ min: 10, max: 1000 })
    .withMessage('Daily protein goal must be between 10 and 1,000 grams'),
  
  handleValidationErrors
];

// Password reset validation
export const validatePasswordReset = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  
  handleValidationErrors
];

export const validateNewPassword = [
  body('token')
    .notEmpty()
    .withMessage('Reset token is required'),
  
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one lowercase letter, one uppercase letter, and one number'),
  
  handleValidationErrors
];