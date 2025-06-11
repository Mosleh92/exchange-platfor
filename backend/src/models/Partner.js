const mongoose = require('mongoose');

const partnerSchema = new mongoose.Schema({
    tenantId: {
        type: String,
        required: true,
        index: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    partnerId: {
        type: String,
        required: true,
        unique: true
    },
    commissionRate: {
        type: Number,
        required: true,
        min: 0,
        max: 10
    },
    discountRate: {
        type: Number,
        required: true,
        min: 0,
        max: 10
    },
    maxLimit: {
        type: Number,
        required: true,
        min: 0
    },
    bankAccount: String,
    currencies: [{
        type: String
    }],
    tier: {
        type: String,
        enum: ['bronze', 'silver', 'gold', 'platinum'],
        default: 'bronze'
    },
    monthlyVolume: {
        type: Number,
        default: 0
    },
    monthlyTransactions: {
        type: Number,
        default: 0
    },
    totalVolume: {
        type: Number,
        default: 0
    },
    totalTransactions: {
        type: Number,
        default: 0
    },
    status: {
        type: String,
        enum: ['active', 'inactive', 'pending', 'suspended'],
        default: 'pending'
    }
}, {
    timestamps: true
});

partnerSchema.index({ tenantId: 1, partnerId: 1 }, { unique: true });

module.exports = mongoose.model('Partner', partnerSchema);