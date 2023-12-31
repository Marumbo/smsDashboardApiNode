const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const GroupContactsSchema = new Schema(
  {
    group_id: {
      type: String,
      required: true,
    },
    contact_ids: {
      type: [String],
      required: true,
    },
  },
  { timestamps: true }
);

const GroupContacts = mongoose.model("GroupContacts", GroupContactsSchema);

module.exports = GroupContacts;
