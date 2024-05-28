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

// Group Contact Routes

router.get("/all", getAllGroupContacts);
router.get("/:id", getGroupContact);
router.post("/create", createGroupContacts);
router.put("/add/:id", addContactToGroup);
router.put("/remove/:id", removeContactFromGroup);
router.delete("/:id", deleteGroupContact);

module.exports = router;
