const express = require("express");
const multer = require("multer");
const upload = multer({dest: "uploads/"});

const {
  getAllContacts,
  createContact,
  getContact,
  updateContact,
  deleteContact,
  createContactFromCsv,
} = require("../controllers/contactController");

const router = express.Router();

// Country codes

router.get("/all", getAllContacts);
router.get("/:id", getContact);
router.post("/create", createContact);
router.post("/", upload.single("file"), createContactFromCsv);
router.put("/:id", updateContact);
router.delete("/:id", deleteContact);

module.exports = router;
