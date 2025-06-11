const Partner = require('../models/Partner');
const User = require('../models/User');
const { validationResult } = require('express-validator');

class PartnerController {
    async getAllPartners(req, res) {
        try {
            const partners = await Partner.find({ 
                tenantId: req.user.tenantId 
            }).populate('userId', 'name email phone');

            res.json({
                success: true,
                partners: partners
            });

        } catch (error) {
            console.error('Get partners error:', error);
            res.status(500).json({
                success: false,
                message: 'خطا در دریافت لیست همکاران'
            });
        }
    }

    async createPartner(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    success: false,
                    message: 'اطلاعات ورودی نامعتبر',
                    errors: errors.array()
                });
            }

            const {
                name, email, phone, nationalId,
                commissionRate, discountRate, maxLimit,
                bankAccount, currencies
            } = req.body;

            // ایجاد کاربر جدید برای همکار
            const user = new User({
                tenantId: req.user.tenantId,
                username: `partner_${Date.now()}`, // موقتی
                password: 'temp_password', // باید hash شود
                role: 'partner',
                name: name,
                email: email,
                phone: phone,
                nationalId: nationalId,
                permissions: ['calculator', 'transactions', 'reports']
            });

            await user.save();

            // ایجاد رکورد همکار
            const partner = new Partner({
                tenantId: req.user.tenantId,
                userId: user._id,
                partnerId: `PART${Date.now()}`,
                commissionRate: commissionRate,
                discountRate: discountRate,
                maxLimit: maxLimit,
                bankAccount: bankAccount,
                currencies: currencies || ['AED', 'USD', 'IRR']
            });

            await partner.save();

            res.status(201).json({
                success: true,
                message: 'همکار جدید با موفقیت اضافه شد',
                partner: partner
            });

        } catch (error) {
            console.error('Create partner error:', error);
            res.status(500).json({
                success: false,
                message: 'خطا در ایجاد همکار جدید'
            });
        }
    }

    async updatePartner(req, res) {
        try {
            const { partnerId } = req.params;
            const updates = req.body;

            const partner = await Partner.findOneAndUpdate(
                { 
                    tenantId: req.user.tenantId,
                    partnerId: partnerId 
                },
                updates,
                { new: true }
            ).populate('userId', 'name email phone');

            if (!partner) {
                return res.status(404).json({
                    success: false,
                    message: 'همکار یافت نشد'
                });
            }

            res.json({
                success: true,
                message: 'اطلاعات همکار بروزرسانی شد',
                partner: partner
            });

        } catch (error) {
            console.error('Update partner error:', error);
            res.status(500).json({
                success: false,
                message: 'خطا در بروزرسانی همکار'
            });
        }
    }
}

module.exports = new PartnerController();