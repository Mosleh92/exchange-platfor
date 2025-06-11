const { body } = require('express-validator');

class ValidationRules {
    static loginValidation() {
        return [
            body('tenantId')
                .notEmpty()
                .withMessage('شناسه صرافی الزامی است')
                .isLength({ min: 3, max: 20 })
                .withMessage('شناسه صرافی باید بین 3 تا 20 کاراکتر باشد'),
            
            body('username')
                .notEmpty()
                .withMessage('نام کاربری الزامی است')
                .isLength({ min: 3, max: 50 })
                .withMessage('نام کاربری باید بین 3 تا 50 کاراکتر باشد'),
            
            body('password')
                .notEmpty()
                .withMessage('رمز عبور الزامی است')
                .isLength({ min: 6 })
                .withMessage('رمز عبور باید حداقل 6 کاراکتر باشد')
        ];
    }

    static partnerValidation() {
        return [
            body('name')
                .notEmpty()
                .withMessage('نام همکار الزامی است'),
            
            body('email')
                .isEmail()
                .withMessage('ایمیل معتبر وارد کنید'),
            
            body('commissionRate')
                .isFloat({ min: 0, max: 10 })
                .withMessage('نرخ کمیسیون باید بین 0 تا 10 درصد باشد'),
            
            body('discountRate')
                .isFloat({ min: 0, max: 10 })
                .withMessage('نرخ تخفیف باید بین 0 تا 10 درصد باشد'),
            
            body('maxLimit')
                .isInt({ min: 100 })
                .withMessage('حد مجاز معامله باید حداقل 100 باشد')
        ];
    }
}

module.exports = ValidationRules;