const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const countryCodeSchema = new Schema(
  {
    country_code: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const CountryCode = mongoose.model("CountryCode", countryCodeSchema);

module.exports = CountryCode;
