// backend/src/routes/auth.routes.js
const express = require('express');
const { body } = require('express-validator');
const authController = require('../controllers/auth.controller');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// ورود
router.post('/login', [
  body('tenant_id')
    .notEmpty()
    .withMessage('شناسه صرافی الزامی است')
    .isLength({ min: 3, max: 50 })
    .withMessage('شناسه صرافی باید بین 3 تا 50 کاراکتر باشد'),
  
  body('email')
    .isEmail()
    .withMessage('فرمت ایمیل صحیح نیست')
    .normalizeEmail(),
    
  body('password')
    .isLength({ min: 6 })
    .withMessage('رمز عبور باید حداقل 6 کاراکتر باشد')
], authController.login);

// اعتبارسنجی token
router.get('/validate', authMiddleware, authController.validate);

module.exports = router;