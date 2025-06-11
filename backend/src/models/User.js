const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    tenantId: {
        type: String,
        required: true,
        index: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['admin', 'partner', 'customer', 'system'],
        required: true
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: String,
    nationalId: String,
    isActive: {
        type: Boolean,
        default: true
    },
    permissions: [{
        type: String
    }],
    lastLogin: Date,
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Index برای multi-tenant
userSchema.index({ tenantId: 1, username: 1 }, { unique: true });

module.exports = mongoose.model('User', userSchema);