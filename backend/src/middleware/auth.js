const authConfig = require('../config/auth');
const User = require('../models/User');

class AuthMiddleware {
    async authenticate(req, res, next) {
        try {
            const authHeader = req.headers.authorization;
            
            if (!authHeader || !authHeader.startsWith('Bearer ')) {
                return res.status(401).json({
                    success: false,
                    message: 'توکن احراز هویت یافت نشد'
                });
            }

            const token = authHeader.substring(7);
            const decoded = authConfig.verifyToken(token);

            // بررسی وجود کاربر
            const user = await User.findById(decoded.userId);
            if (!user || !user.isActive) {
                return res.status(401).json({
                    success: false,
                    message: 'کاربر نامعتبر'
                });
            }

            req.user = {
                userId: user._id,
                tenantId: user.tenantId,
                role: user.role,
                permissions: user.permissions
            };

            next();

        } catch (error) {
            console.error('Auth middleware error:', error);
            return res.status(401).json({
                success: false,
                message: 'توکن نامعتبر'
            });
        }
    }

    authorize(roles = []) {
        return (req, res, next) => {
            if (!req.user) {
                return res.status(401).json({
                    success: false,
                    message: 'احراز هویت نشده'
                });
            }

            if (roles.length > 0 && !roles.includes(req.user.role)) {
                return res.status(403).json({
                    success: false,
                    message: 'دسترسی غیرمجاز'
                });
            }

            next();
        };
    }

    tenantIsolation(req, res, next) {
        // اطمینان از جداسازی داده‌های tenant
        if (!req.user.tenantId) {
            return res.status(400).json({
                success: false,
                message: 'شناسه صرافی یافت نشد'
            });
        }
        next();
    }
}

module.exports = new AuthMiddleware();