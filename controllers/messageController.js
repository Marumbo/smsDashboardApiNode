const Message = require("../models/message");
const Sms = require("../models/sms");
require("dotenv").config();
const AfricasTalking = require("africastalking");

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
  //console.log("request body", req.body);

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
    });

    smsEntry
      .save()
      .then((result) => {
        console.log("saving sms");
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
        res.json({
          status: "fail",
          message: "message save failure",
          error: err.message,
        });
      });
  } else {
    res.json({
      status: "fail",
      message: "message sending failure",
      error: result.message,
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

      res.json({
        status: "success",
        message: "message saved",
        result: result,
      });
    })
    .catch((err) => {
      console.log("error saving message");
      console.log(err);
      res.json({
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
