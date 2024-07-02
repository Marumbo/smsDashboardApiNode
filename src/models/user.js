const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    full_name: { type: String, required: true },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    organisation_id: {
      type: String,
    },
    user_type: {
      type: String,
      default: "user",
    },
    phone_number: {
      type: String,
      required: true,
      unique: true,
    },
    balance: {
      type: Number,
      default: 5000,
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
