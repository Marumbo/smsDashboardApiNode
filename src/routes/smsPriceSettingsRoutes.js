const express = require("express");

const {
  getAllSmsPriceSettings,
  createSmsPriceSettings,
  getSmsPriceSettings,
  updateSmsPriceSettings,
  deleteSmsPriceSettings,
} = require("../controllers/smsPriceSettingsController");

const router = express.Router();

// Country codes

router.get("/all", getAllSmsPriceSettings);
router.get("/:id", getSmsPriceSettings);
router.post("/create", createSmsPriceSettings);
router.put("/:id", updateSmsPriceSettings);
router.delete("/:id", deleteSmsPriceSettings);

module.exports = router;
