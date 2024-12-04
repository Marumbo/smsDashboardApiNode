const express = require("express");
const router = express.Router();
const Payments = require("../models/payments");
const { verifyWebhookSignature } = require("../middlewares/webhookSignature");
const { accessResource } = require("../middlewares/accessResource");

// Callback URL for Payouts
router.post("/webhook/payout-status", async (req, res) => {
  const { paymentType, status, transactionId, details } = req.body;
  // Update your database or trigger relevant actions
  await storeTransactionStatus(paymentType, status, transactionId, details);
  res.status(200).send("Payout status received");
});

// Callback URL for Deposits
router.post("/webhook/deposit-status", async (req, res) => {
  const { paymentType, status, transactionId, details } = req.body;
  // Update your database or trigger relevant actions

  await storeTransactionStatus(paymentType, status, transactionId, details);
  res.status(200).send("Deposit status received");
});

// Callback URL for Refunds
router.post("/webhook/refund-status", async (req, res) => {
  const { paymentType, status, transactionId, details } = req.body;

  // Update your database or trigger relevant actions

  await storeTransactionStatus(paymentType, status, transactionId, details);
  res.status(200).send("Refund status received");
});

router.get("/transactions/:transactionId", getSingleTransactions);

router.get("/transactions", getAllTransactions);

async function storeTransactionStatus(
  paymentType,
  status,
  transactionId,
  details
) {
  try {
    if (!paymentType || !status || !transactionId || !details) {
      console.log("Required fields are missing");
      return;
    }
    // Update your database or trigger relevant actions

    const transactionExists = await Payments.findOne({ transactionId });
    if (transactionExists) {
      console.log("Transaction status already exists");
      return;
    }

    const newTransaction = new Payments({
      paymentType,
      transactionId,
      status,
      details,
    });
    await newTransaction.save();
    console.log("Transaction status stored successfully");
  } catch (error) {
    console.error("Error storing transaction status:", error);
    return;
  }
}

async function getSingleTransactions(req, res) {
  try {
    const { transactionId } = req.params;
    if (!transactionId) {
      return res.status(400).json({
        status: "failed",
        message: "transactionId is required",
      });
    }

    const transaction = await Payments.findOne({ transactionId });
    if (!transaction) {
      return res.status(404).json({
        status: "failed",
        message: "Transaction not found",
      });
    }
    return res.status(200).json({
      status: "success",
      message: "Transaction found",
      result: transaction,
    });
  } catch (error) {
    console.error("Error fetching transaction :", error);
    return res.status(500).json({
      status: "failed",
      message: "Error fetching transaction",
      error: error.message,
    });
  }
}

async function getAllTransactions(req, res) {
  try {
    const transactions = await Payments.find();
    return res.status(200).json({
      status: "success",
      message: "Transactions found",
      result: transactions,
    });
  } catch (error) {
    console.error("Error fetching transactiona :", error);
    return res.status(500).json({
      status: "failed",
      message: "Error fetching transaction",
      error: error.message,
    });
  }
}
module.exports = router;
