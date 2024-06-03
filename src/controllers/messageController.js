require("dotenv").config();
const AfricasTalking = require("africastalking");

const Message = require("../models/message");
const Sms = require("../models/sms");
const User = require("../models/user");

const africastalking = AfricasTalking({
  apiKey: process.env.apiKey || "",
  username: process.env.username || "sandbox",
});

// Get the SMS service
const sms = africastalking.SMS;

async function sendMessage(numbers, message, from) {
  const options = {
    to: numbers,
    message: message,
    from: from,
  };
  try {
    await sms.send(options);
    return {
      isSuccess: true,
      message: "message sent",
    };
  } catch (e) {
    return {
      isSuccess: false,
      message: e.toString(),
    };
  }
}

const send_sms = async (req, res) => {
  const { numbers, message, from, isGroup } = req.body;

  const result = await sendMessage(numbers, message, from);

  if (result.isSuccess) {
    const smsEntry = new Sms({
      smsSenderId: from,
      message: message,
      number: numbers,
      price: "15",
      countryCode: "+250",
      isGroup: isGroup,
      status: "sent",
    });

    try {
      const user = await User.findOne({ phone_number: from });
      if (!user) {
        return res.json({
          status: "fail",
          message: "user not found",
        });
      }
      await User.updateOne(
        { phone_number: from },
        { balance: user.balance - 15 }
      );
      const newSms = await smsEntry.save();
      return res.json({
        status: "success",
        message: "message saved",
        result: newSms,
      });
    } catch (error) {
      return res.json({
        status: "fail",
        message: "message save failure",
        error: error.message,
      });
    }
  } else {
    const smsEntry = new Sms({
      smsSenderId: from,
      message: message,
      number: numbers,
      price: "15",
      countryCode: "+250",
      isGroup: isGroup,
      status: "failed",
    });
    await smsEntry.save();
    return res.json({
      status: "fail",
      message: "message sending failure",
      result: result.message,
    });
  }
};

async function message_index(req, res) {
  await Message.find()
    .then((result) => {
      console.log("Returning all messages");

      return res.json({
        status: "success",
        message: "message list",
        result: result,
      });
    })
    .catch((err) => {
      console.log(err);
      return res.json({
        status: "fail",
        message: " message list failure",
        error: err.message,
      });
    });
}

const message_create_post = async (req, res) => {
  console.log(req.body);
  const { name, email, messageBody, target } = req.body;

  const messageEntry = new Message({
    name: name,
    email: email,
    messageBody: messageBody,
    target: target,
  });

  await messageEntry
    .save()
    .then((result) => {
      console.log("saving message");
      console.log(result);

      return res.json({
        status: "success",
        message: "message saved",
        result: result,
      });
    })
    .catch((err) => {
      console.log("error saving message");
      console.log(err);
      return res.json({
        status: "fail",
        message: "message save failure",
        error: err.message,
      });
    });
};

module.exports = {
  message_index,
  message_create_post,
  send_sms,
};
