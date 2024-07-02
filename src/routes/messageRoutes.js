const express = require("express");

const {
  send_sms,
  get_sms_messages,
  delete_sms_message,
  message_create_post,
} = require("../controllers/messageController");
const { accessResource } = require("../middlewares/accessResource");

const router = express.Router();

// get all messages

router.get("/all", get_sms_messages);

// add message

router.post("/create", message_create_post);

router.post("/sendSMS",accessResource, send_sms);

// delete message
router.delete("/delete/:id", delete_sms_message);

module.exports = router;
