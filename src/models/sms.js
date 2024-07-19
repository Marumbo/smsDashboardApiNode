const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const smsSchema = new Schema(
  {
    smsSenderId: {
      type: String,
      required: true,
    },

    message: {
      type: String,
      required: true,
    },

    numbers: {
      type: [String],
      required: true,
    },
    price: {
      type: String,
      required: true,
    },
    countryCode: {
      type: String,
      required: true,
    },
    status: {
      type: String,
    },
    isGroup: {
      type: Boolean,
      default: false,
      // required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

const Sms = mongoose.model("sms", smsSchema);

module.exports = Sms;
