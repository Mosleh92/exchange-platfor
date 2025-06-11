const mongoose = require('mongoose');
const User = require('../src/models/User');
const Partner = require('../src/models/Partner');
const authConfig = require('../src/config/auth');
require('dotenv').config();

async function seedDatabase() {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/exchange_platform');
        console.log('📦 Connected to database for seeding...');

        // پاک کردن داده‌های قبلی
        await User.deleteMany({});
        await Partner.deleteMany({});

        // ایجاد کاربر مدیر سیستم
        const systemAdmin = new User({
            tenantId: 'system',
            username: 'sysadmin',
            password: await authConfig.hashPassword('admin123'),
            role: 'system',
            name: 'مدیر سیستم',
            email: 'admin@exchangeplatform.com',
            permissions: ['all'],
            isActive: true
        });
        await systemAdmin.save();

        // ایجاد صرافی نمونه
        const sampleExchangeAdmin = new User({
            tenantId: 'sarrafi001',
            username: 'admin',
            password: await authConfig.hashPassword('admin123'),
            role: 'admin',
            name: 'مدیر صرافی نمونه',
            email: 'admin@sarrafi001.com',
            permissions: ['all'],
            isActive: true
        });
        await sampleExchangeAdmin.save();

        console.log('✅ Database seeded successfully!');
        console.log('👤 System Admin: sysadmin / admin123');
        console.log('🏢 Sample Exchange Admin: admin / admin123 (tenant: sarrafi001)');
        
        process.exit(0);

    } catch (error) {
        console.error('❌ Seeding failed:', error);
        process.exit(1);
    }
}

seedDatabase();