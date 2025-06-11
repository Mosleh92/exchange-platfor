const User = require('../models/User');
const authConfig = require('../config/auth');
const { validationResult } = require('express-validator');

class AuthController {
    async login(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    success: false,
                    message: 'اطلاعات ورودی نامعتبر',
                    errors: errors.array()
                });
            }

            const { tenantId, username, password } = req.body;

            // جستجوی کاربر در tenant مربوطه
            const user = await User.findOne({ 
                tenantId: tenantId,
                username: username,
                isActive: true 
            });

            if (!user) {
                return res.status(401).json({
                    success: false,
                    message: 'نام کاربری یا رمز عبور اشتباه است'
                });
            }

            // بررسی رمز عبور
            const isPasswordValid = await authConfig.comparePassword(password, user.password);
            if (!isPasswordValid) {
                return res.status(401).json({
                    success: false,
                    message: 'نام کاربری یا رمز عبور اشتباه است'
                });
            }

            // تولید توکن
            const token = authConfig.generateToken({
                userId: user._id,
                tenantId: user.tenantId,
                role: user.role
            });

            // بروزرسانی آخرین ورود
            user.lastLogin = new Date();
            await user.save();

            // ارسال پاسخ (بدون رمز عبور)
            const userResponse = {
                id: user._id,
                tenantId: user.tenantId,
                username: user.username,
                role: user.role,
                name: user.name,
                email: user.email,
                permissions: user.permissions
            };

            res.json({
                success: true,
                token: token,
                user: userResponse
            });

        } catch (error) {
            console.error('Login error:', error);
            res.status(500).json({
                success: false,
                message: 'خطا در سرور'
            });
        }
    }

    async logout(req, res) {
        try {
            // در اینجا می‌توان توکن را در blacklist قرار داد
            res.json({
                success: true,
                message: 'خروج موفقیت‌آمیز'
            });
        } catch (error) {
            console.error('Logout error:', error);
            res.status(500).json({
                success: false,
                message: 'خطا در خروج'
            });
        }
    }

    async validateToken(req, res) {
        try {
            // middleware قبلاً token را validate کرده
            const user = await User.findById(req.user.userId)
                .select('-password');

            if (!user || !user.isActive) {
                return res.status(401).json({
                    success: false,
                    message: 'کاربر نامعتبر'
                });
            }

            res.json({
                success: true,
                user: {
                    id: user._id,
                    tenantId: user.tenantId,
                    username: user.username,
                    role: user.role,
                    name: user.name,
                    email: user.email,
                    permissions: user.permissions
                }
            });

        } catch (error) {
            console.error('Token validation error:', error);
            res.status(500).json({
                success: false,
                message: 'خطا در اعتبارسنجی'
            });
        }
    }
}

module.exports = new AuthController();