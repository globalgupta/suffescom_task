const mongoose = require('mongoose');

const walletSchema = mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    amount: {
        type: mongoose.Schema.Types.Decimal128,
        required: true
    },
    destination: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ['pending', 'processing', 'success', 'failed'],
        default: 'pending'
    },
    reference_id: {
        type: String,
        required: true,
        unique: true
    },
    idempotency_key: {
        type: String,
        required: true
    },
}, { timestamps: true });

walletSchema.index({ user_id: 1, idempotency_key: 1 }, { unique: true });

module.exports = mongoose.model('Withdrawal', walletSchema);
