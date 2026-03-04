const helper = require('../helpers/api-response');
const mongoose = require('mongoose');
const { body, header } = require('express-validator');
const commonFunction = require('../helpers/common-function');
const { validationMessage, commonStatus, transactionType } = require('../helpers/constant');
const WALLET = require('../models/wallet-model');
const TRANSACTION_LOG = require('../models/transaction-log-model');
const WITHDRAWAL = require('../models/withdrawal-model');


exports.addFundsToWallet = [
    body('amount').notEmpty().withMessage(validationMessage.AMOUNT_REQUIRED)
        .isFloat({ gt: 0 }).withMessage(validationMessage.INVALID_AMOUNT),
    commonFunction.validateRequest,
    async (req, res) => {
        try {
            const { amount } = req.body;
            const userId = req.currentUser._id;

            let walletData = await WALLET.findOne({ user_id: userId });
            const beforeBalance = walletData ? Number(walletData.balance.toString()) : 0;
            const afterBalance = beforeBalance + amount;

            if (!walletData) {
                walletData = await WALLET.create({ user_id: userId, balance: afterBalance });
            }
            else {
                walletData.balance = afterBalance;
                await walletData.save();
            }

            await TRANSACTION_LOG.create({
                user_id: userId,
                transaction_type: transactionType.DEPOSIT,
                amount: amount,
                before_balance: beforeBalance,
                after_balance: afterBalance,
                status: commonStatus.SUCCESS,
                reference_id: `DEP-${Date.now()}`
            });

            return helper.successResponseWithData(res, validationMessage.FUNDS_ADDED_SUCCESS, { walletData });
        }
        catch (err) {
            console.log('catch block error ===>>>>', err);
            return helper.catchedErrorResponse(res, validationMessage.INTERNAL_SERVER_ERROR, err.message);
        }
    }
];


exports.makePayment = [
    body('amount').notEmpty().withMessage(validationMessage.AMOUNT_REQUIRED)
        .isFloat({ gt: 0 }).withMessage(validationMessage.INVALID_AMOUNT),
    body('destination').trim().isString().notEmpty().withMessage(validationMessage.DESTINATION_REQUIRED),
    header('user-idempotency-key').trim().isString().notEmpty().withMessage(validationMessage.IDEMPOTENCY_KEY_REQUIRED),
    commonFunction.validateRequest,
    async (req, res) => {
        const session = await mongoose.startSession();
        try {
            const { amount, destination } = req.body;
            const amountDecimal = mongoose.Types.Decimal128.fromString(amount.toString());
            const userId = req.currentUser._id;
            const idempotencyKey = req.headers['user-idempotency-key'];

            const existingPayment = await WITHDRAWAL.findOne({ user_id: userId, idempotency_key: idempotencyKey });
            if (existingPayment) {
                return helper.successResponseWithData(res, validationMessage.PAYMENT_SUCCESS, {
                    reference_id: existingPayment.reference_id,
                    status: existingPayment.status,
                    idempotent_replay: true
                });
            }

            let responseData = null;

            await session.withTransaction(async () => {
                const existingPaymentInTxn = await WITHDRAWAL.findOne({ user_id: userId, idempotency_key: idempotencyKey }).session(session);
                if (existingPaymentInTxn) {
                    responseData = {
                        reference_id: existingPaymentInTxn.reference_id,
                        status: existingPaymentInTxn.status,
                        idempotent_replay: true
                    };
                    return;
                }

                const walletBeforeUpdate = await WALLET.findOneAndUpdate(
                    { user_id: userId, balance: { $gte: amountDecimal } },
                    { $inc: { balance: -amount } },
                    { session }
                );

                if (!walletBeforeUpdate) {
                    throw new Error('INSUFFICIENT_BALANCE');
                }

                const beforeBalance = Number(walletBeforeUpdate.balance.toString());
                const afterBalance = beforeBalance - amount;
                const referenceId = `PAY-${Date.now()}`;

                await WITHDRAWAL.create([{
                    user_id: userId,
                    amount: amount,
                    destination: destination,
                    status: commonStatus.SUCCESS,
                    reference_id: referenceId,
                    idempotency_key: idempotencyKey
                }], { session });

                await TRANSACTION_LOG.create([{
                    user_id: userId,
                    transaction_type: transactionType.TRANSFER,
                    amount: amount,
                    before_balance: beforeBalance,
                    after_balance: afterBalance,
                    status: commonStatus.SUCCESS,
                    reference_id: referenceId
                }], { session });

                responseData = {
                    reference_id: referenceId,
                    before_balance: beforeBalance,
                    after_balance: afterBalance,
                    idempotent_replay: false
                };
            });

            return helper.successResponseWithData(res, validationMessage.PAYMENT_SUCCESS, responseData);
        }
        catch (err) {
            if (err.message === 'INSUFFICIENT_BALANCE') {
                return helper.errorResponse(res, validationMessage.INSUFFICIENT_BALANCE);
            }

            if (err.code === 11000) {
                const existingPayment = await WITHDRAWAL.findOne({ user_id: req.currentUser._id, idempotency_key: req.headers['user-idempotency-key'] });
                if (existingPayment) {
                    return helper.successResponseWithData(res, validationMessage.PAYMENT_SUCCESS, {
                        reference_id: existingPayment.reference_id,
                        status: existingPayment.status,
                        idempotent_replay: true
                    });
                }
            }

            console.log('catch block error ===>>>>', err);
            return helper.catchedErrorResponse(res, validationMessage.INTERNAL_SERVER_ERROR, err.message);
        }
        finally {
            await session.endSession();
        }
    }
];
