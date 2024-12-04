const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const PaymentsSchema = new Schema(
  {
    paymentType: {
      type: String,
      required: true,
    },
    details: {
      type: String,
      required: true,
    },
    transactionId: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Payments = mongoose.model("Payments", PaymentsSchema);

module.exports = Payments;
