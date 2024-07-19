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
  console.log(numbers, message, from);

  if (!Array.isArray(numbers)) {
    return {
      isSuccess: false,
      message: "Numbers should be an array",
    };
  }

  const results = await Promise.all(
    numbers.map(async (number) => {
      const options = {
        to: number,
        message: message,
        from: from,
      };
      try {
        await sms.send(options);
        return {
          number: number,
          isSuccess: true,
          message: "message sent",
        };
      } catch (e) {
        return {
          number: number,
          isSuccess: false,
          message: e.toString(),
        };
      }
    })
  );

  return results;
}


const send_sms = async (req, res) => {
  const { numbers, message, from, isGroup } = req.body;

  // Check user account balance 
  const user = await User.findOne({ phone_number: from });
  if (!user) {
    return res.json({
      status: "fail",
      message: "user not found",
    });
  }
  if (user.balance < 15 * numbers.length) {
    return res.json({
      status: "fail",
      message: "insufficient balance",
    });
  }

  const result = await sendMessage(numbers, message, from);
  console.log("result", result);

  if (result.some((r) => r.isSuccess)) {
    const smsEntry = new Sms({
      smsSenderId: from,
      message: message,
      number: numbers,
      price: "15",
      countryCode: "+250",
      isGroup: isGroup,
      status: "sent",
      user: req.user.id,
    });

    try {
      await User.updateOne(
        { phone_number: from },
        { balance: user.balance - 15 * numbers.length }
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
      user: req.user.id,
    });
    await smsEntry.save();
    return res.json({
      status: "fail",
      message: "message sending failure",
      result: result.message,
    });
  }
};

async function get_sms_messages(req, res) {
  try {
    const messages = await Sms.find().populate("user", "full_name phone_number email");

    return res.json({
      status: "success",
      message: "message list",
      result: messages,
    });
  } catch (error) {
    console.log(error);
    return res.json({
      status: "fail",
      message: " message list failure",
      error: error.message,
    });
  }
}

const delete_sms_message = async (req, res) => {
  const { id } = req.params;
  try {
    await Sms.findByIdAndDelete(id);
    return res.json({
      status: "success",
      message: "message deleted",
    });
  } catch (error) {
    return res.json({
      status: "fail",
      message: "message delete failure",
      error: error.message,
    });
  }

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
  send_sms,
  get_sms_messages,
  delete_sms_message,
  message_create_post,
};
