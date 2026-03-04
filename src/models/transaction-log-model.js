const mongoose = require('mongoose');

const transactionLogSchema = mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    transaction_type: {
        type: String, enum: ['withdrawal', 'deposit', 'transfer'],
        required: true
    },
    amount: {
        type: mongoose.Schema.Types.Decimal128,
        required: true
    },
    before_balance: {
        type: mongoose.Schema.Types.Decimal128,
        required: true
    },
    after_balance: {
        type: mongoose.Schema.Types.Decimal128,
        required: true
    },
    status: {
        type: String,
        enum: ['success', 'failed'],
        required: true
    },
    reference_id: {
        type: String,
        required: true,
        unique: true
    },
}, { timestamps: true });

module.exports = mongoose.model('TransactionLog', transactionLogSchema);

