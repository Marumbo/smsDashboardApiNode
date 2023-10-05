const express = require("express");

const {
  getAllGroupContacts,
  createGroupContacts,
  getGroupContact,
  addContactToGroup,
  removeContactFromGroup,
  deleteGroupContact,
} = require("../controllers/groupContactsController");

const router = express.Router();

// Country codes

router.get("/all", getAllGroupContacts);
router.get("/:id", getGroupContact);
router.post("/create", createGroupContacts);
router.put("/:id", addContactToGroup);
router.put("/:id", removeContactFromGroup);
router.delete("/:id", deleteGroupContact);

module.exports = router;
