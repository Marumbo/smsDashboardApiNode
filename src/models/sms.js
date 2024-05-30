const { Timestamp } = require("bson");
const { builtinModules } = require("module");
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

    number: {
      type: String,
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
    isGroup: {
      type: Boolean,
      required: true,
    },
  },
  { timestamps: true }
);

const Sms = mongoose.model("sms", smsSchema);

module.exports = Sms;
