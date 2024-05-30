const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const smsPriceSettingschema = new Schema(
  {
    organisation_id: {
      type: String,
      required: true,
    },
    country_code: {
      type: String,
      required: true,
    },
    price: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const SmsPriceSettings = mongoose.model(
  "SmsPriceSettings",
  smsPriceSettingschema
);

module.exports = SmsPriceSettings;
