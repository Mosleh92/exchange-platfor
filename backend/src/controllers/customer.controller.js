// backend/src/controllers/customer.controller.js
// کد قبلی شما + اضافه کردن فارسی‌سازی

const { getTenantConnection } = require('../config/database');
const logger = require('../utils/logger');
const PersianUtils = require('../utils/persian');

class CustomerController {
  async createCustomer(req, res) {
    try {
      const tenantDB = req.tenant.db;
      const {
        name,
        phone,
        email = '',
        national_id = '',
        address = ''
      } = req.body;

      // اعتبارسنجی شماره تلفن ایرانی
      if (!PersianUtils.validatePhoneNumber(phone)) {
        return res.status(400).json({
          success: false,
          error: 'شماره تلفن نامعتبر است',
          code: 'INVALID_PHONE'
        });
      }

      // اعتبارسنجی کد ملی
      if (national_id && !PersianUtils.validateNationalId(national_id)) {
        return res.status(400).json({
          success: false,
          error: 'کد ملی نامعتبر است',
          code: 'INVALID_NATIONAL_ID'
        });
      }

      const customer = {
        customer_code: generateCustomerCode(),
        name: name.trim(),
        phone: PersianUtils.formatPhoneNumber(phone),
        email: email.toLowerCase().trim(),
        national_id: PersianUtils.toEnglishNumbers(national_id),
        address,
        
        // تاریخ‌های فارسی
        persian_created_date: PersianUtils.toJalaliDate(new Date()),
        
        // اطلاعات پایه
        status: 'active',
        created_by: req.user.userId,
        created_by_name: req.user.name,
        created_at: new Date()
      };

      const result = await tenantDB.collection('customers').insertOne(customer);

      logger.info(`Customer created: ${customer.name}`, {
        tenantId: req.tenant.id,
        customerId: result.insertedId
      });

      res.status(201).json({
        success: true,
        message: 'مشتری با موفقیت ایجاد شد',
        data: {
          customer_id: result.insertedId,
          customer_code: customer.customer_code,
          name: customer.name,
          phone: customer.phone,
          persian_created_date: customer.persian_created_date
        }
      });

    } catch (error) {
      logger.error('Create customer error:', error);
      res.status(500).json({
        success: false,
        error: 'خطا در ایجاد مشتری',
        code: 'CUSTOMER_CREATE_ERROR'
      });
    }
  }

  // باقی کدهای شما...
}

module.exports = new CustomerController();