const nodemailer = require("nodemailer");

async function sendEmail(mailOptions) {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return res
          .status(500)
          .json({ error: `Error sending email: ${error.message}` });
      }
      res
        .status(200)
        .json({ status: "success", message: "Email sent successfully", info });
    });
  } catch (error) {
    res.status(500).send({ status: "fail", message: error.message });
  }
}

module.exports = { sendEmail };
