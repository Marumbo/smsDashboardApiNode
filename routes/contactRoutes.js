const express = require("express");

const {
  getAllContacts,
  createContact,
  getContact,
  updateContact,
  deleteContact,
} = require("../controllers/contactController");

const router = express.Router();

// Country codes

router.get("/all", getAllContacts);
router.get("/:id", getContact);
router.post("/create", createContact);
router.put("/:id", updateContact);
router.delete("/:id", deleteContact);

module.exports = router;
