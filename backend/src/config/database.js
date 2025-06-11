const mongoose = require('mongoose');

class DatabaseConfig {
    constructor() {
        this.connectionString = process.env.MONGODB_URI || 'mongodb://localhost:27017/exchange_platform';
        this.options = {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            maxPoolSize: 10,
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
        };
    }

    async connect() {
        try {
            await mongoose.connect(this.connectionString, this.options);
            console.log('✅ MongoDB connected successfully');
            
            // Multi-tenant database setup
            this.setupTenantDatabases();
            
        } catch (error) {
            console.error('❌ MongoDB connection failed:', error);
            process.exit(1);
        }
    }

    setupTenantDatabases() {
        // هر tenant دیتابیس جدا دارد
        mongoose.connection.on('connected', () => {
            console.log('🏢 Multi-tenant database structure ready');
        });
    }

    getTenantConnection(tenantId) {
        const tenantDbName = `exchange_${tenantId}`;
        return mongoose.connection.useDb(tenantDbName);
    }
}

module.exports = new DatabaseConfig();