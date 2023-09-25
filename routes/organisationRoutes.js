const express = require("express");

const {
  getAllOrganisations,
  createOrganisation,
  getOrganisaion,
  updateOrganisation,
  deleteOrganisation,
} = require("../controllers/organisationController");

const router = express.Router();

// get all organisation

router.get("/all", getAllOrganisations);
router.get("/:id", getOrganisaion);
// add organisation

router.post("/create", createOrganisation);
router.put("/:id", updateOrganisation);
router.delete("/:id", deleteOrganisation);

module.exports = router;
