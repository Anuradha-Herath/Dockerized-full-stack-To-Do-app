const { body, validationResult } = require('express-validator');

// Validation rules
const registerValidation = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),
  body('name')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters')
];

const loginValidation = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
];

const taskValidation = [
  body('title')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Task title must be between 1 and 100 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description must not exceed 500 characters'),
  body('priority')
    .optional()
    .isIn(['low', 'medium', 'high'])
    .withMessage('Priority must be low, medium, or high'),
  body('dueDate')
    .optional()
    .isISO8601()
    .withMessage('Due date must be a valid date'),
  body('category')
    .optional({ nullable: true, checkFalsy: true })
    .custom((value) => {
      // Allow empty/null/undefined values
      if (!value) return true;
      
      // Allow MongoDB ObjectId strings (24 hex characters)
      if (/^[0-9a-fA-F]{24}$/.test(value)) {
        return true;
      }
      // Allow predefined category types
      if (['all', 'personal', 'work', 'important', 'today'].includes(value)) {
        return true;
      }
      throw new Error('Category must be a valid category ID or one of: all, personal, work, important, today');
    })
];

const updateTaskValidation = [
  body('title')
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Task title must be between 1 and 100 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description must not exceed 500 characters'),
  body('priority')
    .optional()
    .isIn(['low', 'medium', 'high'])
    .withMessage('Priority must be low, medium, or high'),
  body('completed')
    .optional()
    .isBoolean()
    .withMessage('Completed must be a boolean value'),
  body('dueDate')
    .optional()
    .isISO8601()
    .withMessage('Due date must be a valid date'),
  body('category')
    .optional({ nullable: true, checkFalsy: true })
    .custom((value) => {
      // Allow empty/null/undefined values
      if (!value) return true;
      
      // Allow MongoDB ObjectId strings (24 hex characters)
      if (/^[0-9a-fA-F]{24}$/.test(value)) {
        return true;
      }
      // Allow predefined category types
      if (['all', 'personal', 'work', 'important', 'today'].includes(value)) {
        return true;
      }
      throw new Error('Category must be a valid category ID or one of: all, personal, work, important, today');
    })
];

const passwordChangeValidation = [
  body('currentPassword')
    .notEmpty()
    .withMessage('Current password is required'),
  body('newPassword')
    .isLength({ min: 6 })
    .withMessage('New password must be at least 6 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('New password must contain at least one uppercase letter, one lowercase letter, and one number')
];

// Middleware to handle validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'Validation failed',
      details: errors.array()
    });
  }
  next();
};

module.exports = {
  registerValidation,
  loginValidation,
  taskValidation,
  updateTaskValidation,
  passwordChangeValidation,
  handleValidationErrors
};
