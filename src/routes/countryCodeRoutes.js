const express = require("express");

const {
  getAllCountryCodes,
  createCountryCode,
  getCountryCode,
  updateCountryCode,
  deleteCountryCode,
} = require("../controllers/countryCodeController");

const router = express.Router();

// Country codes

router.get("/all", getAllCountryCodes);
router.get("/:id", getCountryCode);
router.post("/create", createCountryCode);
router.put("/:id", updateCountryCode);
router.delete("/:id", deleteCountryCode);

module.exports = router;
