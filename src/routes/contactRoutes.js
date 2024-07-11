const express = require("express");

const {
  getAllContacts,
  createContact,
  getContact,
  updateContact,
  deleteContact,
  bulkContacts,
} = require("../controllers/contactController");

const router = express.Router();

// Country codes

router.get("/all", getAllContacts);
router.get("/:id", getContact);
router.post("/new", createContact);
router.post("/bulk", bulkContacts);
router.put("/:id", updateContact);
router.delete("/:id", deleteContact);

module.exports = router;