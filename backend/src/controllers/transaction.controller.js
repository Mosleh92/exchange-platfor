// backend/src/controllers/transaction.controller.js
// کد قبلی شما + اصلاحات فارسی:

const { getTenantConnection } = require('../config/database');
const logger = require('../utils/logger');
const { generateTransactionCode, calculateCommission } = require('../utils/helpers');
const { broadcastToTenant } = require('../config/socket');
const PersianUtils = require('../utils/persian');

class TransactionController {
  async createTransaction(req, res) {
    try {
      const tenantDB = req.tenant.db;
      const {
        customer_id,
        type, // 'buy' | 'sell' | 'exchange'
        currency_from,
        currency_to,
        amount_from,
        rate,
        notes = ''
      } = req.body;

      // محاسبات مالی
      const amount_to = parseFloat(amount_from) * parseFloat(rate);
      const commission = calculateCommission(amount_from, type, req.tenant.settings);
      const net_amount = type === 'buy' ? amount_to - commission : amount_to + commission;

      // ایجاد تراکنش
      const transaction = {
        transaction_code: generateTransactionCode(),
        customer_id: new mongoose.Types.ObjectId(customer_id),
        type,
        currency_from,
        currency_to,
        amount_from: parseFloat(amount_from),
        amount_to: parseFloat(amount_to),
        rate: parseFloat(rate),
        commission: parseFloat(commission),
        net_amount: parseFloat(net_amount),
        status: 'completed', // یا 'pending'
        notes,
        
        // اطلاعات فارسی
        persian_date: PersianUtils.toJalaliDate(new Date()),
        persian_time: PersianUtils.toJalaliDateTime(new Date()),
        
        // اطلاعات ثبت‌کننده
        created_by: req.user.userId,
        created_by_name: req.user.name,
        created_at: new Date(),
        
        // اطلاعات اضافی
        metadata: {
          ip_address: req.ip,
          user_agent: req.get('User-Agent'),
          session_id: req.sessionID
        }
      };

      // ذخیره تراکنش
      const result = await tenantDB.collection('transactions').insertOne(transaction);

      // به‌روزرسانی موجودی مشتری
      await this.updateCustomerBalance(tenantDB, customer_id, amount_to, type);

      // ارسال اطلاع‌رسانی real-time
      broadcastToTenant(req.tenant.id, 'transaction_created', {
        transaction_id: result.insertedId,
        transaction_code: transaction.transaction_code,
        customer_name: transaction.customer_name,
        type,
        amount: amount_from,
        currency: currency_from,
        persian_amount: PersianUtils.formatCurrency(amount_from, currency_from)
      });

      logger.info(`Transaction created: ${transaction.transaction_code}`, {
        tenantId: req.tenant.id,
        transactionId: result.insertedId,
        type,
        amount: amount_from,
        currency: currency_from
      });

      res.status(201).json({
        success: true,
        message: 'معامله با موفقیت ثبت شد',
        data: {
          transaction_id: result.insertedId,
          transaction_code: transaction.transaction_code,
          amount_from: parseFloat(amount_from),
          amount_to: parseFloat(amount_to),
          commission: parseFloat(commission),
          net_amount: parseFloat(net_amount),
          persian_amount: PersianUtils.formatCurrency(amount_from, currency_from),
          persian_date: transaction.persian_date
        }
      });

    } catch (error) {
      logger.error('Create transaction error:', error);
      res.status(500).json({
        success: false,
        error: 'خطا در ثبت معامله',
        code: 'TRANSACTION_CREATE_ERROR'
      });
    }
  }

  // باقی کدهای شما...
}

module.exports = new TransactionController();