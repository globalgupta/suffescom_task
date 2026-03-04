const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/payment-controller');
const { validateUser } = require('../middlewares/user-auth');

router.post('/add-funds-to-wallet', validateUser, paymentController.addFundsToWallet);
router.post('/make-payment', validateUser, paymentController.makePayment);

module.exports = router;
