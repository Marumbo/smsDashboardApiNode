const express = require("express");

const {
  getAllGroups,
  createGroup,
  getGroup,
  updateGroup,
  deleteGroup,
} = require("../controllers/groupController");

const router = express.Router();

// Country codes

router.get("/all", getAllGroups);
router.get("/:id", getGroup);
router.post("/create", createGroup);
router.put("/:id", updateGroup);
router.delete("/:id", deleteGroup);

module.exports = router;
