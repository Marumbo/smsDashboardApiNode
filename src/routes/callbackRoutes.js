const express = require("express");
const { verifyWebhookSignature } = require("../middlewares/webhookSignature");
const { accessResource } = require("../middlewares/accessResource");
const router = express.Router();

// Callback URL for Payouts
router.post('/webhook/payout-status',  (req, res) => {
    const { status, transactionId, details } = req.body;
    console.log('Payout Status:', status, 'Transaction ID:', transactionId, 'Details:', details);
    // Update your database or trigger relevant actions
    res.status(200).send('Payout status received');
});

// Callback URL for Deposits
router.post('/webhook/deposit-status',  (req, res) => {
    const { status, transactionId, details } = req.body;
    console.log('Deposit Status:', status, 'Transaction ID:', transactionId, 'Details:', details);
    // Update your database or trigger relevant actions
    res.status(200).send('Deposit status received');
});

// Callback URL for Refunds
router.post('/webhook/refund-status',  (req, res) => {
    const { status, transactionId, details } = req.body;
    console.log('Refund Status:', status, 'Transaction ID:', transactionId, 'Details:', details);
    // Update your database or trigger relevant actions
    res.status(200).send('Refund status received');
});


module.exports = router;
