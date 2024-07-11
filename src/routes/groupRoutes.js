const express = require("express");

const {
  getAllGroups,
  createGroup,
  getGroup,
  updateGroup,
  deleteGroup,
  addContactsToGroup,
  removeContactsFromGroup,
} = require("../controllers/groupController");

const router = express.Router();

// Country codes

router.get("/all", getAllGroups);
router.get("/:id", getGroup);
router.post("/create", createGroup);
router.put("/:id", updateGroup);
router.delete("/:id", deleteGroup);
router.post("/:id/contacts", addContactsToGroup);
router.post("/:id/remove-contact", removeContactsFromGroup);

module.exports = router;
