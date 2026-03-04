const mongoose = require('mongoose');

const walletSchema = mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    balance: {
        type: mongoose.Schema.Types.Decimal128,
        required: true,
        default: 0
    }
}, { timestamps: true });

walletSchema.index({ user_id: 1 }, { unique: true });

module.exports = mongoose.model('Wallet', walletSchema);
