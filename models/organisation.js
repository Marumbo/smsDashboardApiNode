const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const organisationSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: false,
    },
    sender_id: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Organisation = mongoose.model("organisation", organisationSchema);

module.exports = Organisation;
