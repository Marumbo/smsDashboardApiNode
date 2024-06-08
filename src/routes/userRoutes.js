const express = require("express");

const {
  getAllUsers,
  createUser,
  getUser,
  updateUser,
  deleteUser,
} = require("../controllers/userController");

const router = express.Router();

router.get("/all", getAllUsers);
router.get("/:id", getUser);
router.post("/create", createUser);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

module.exports = router;