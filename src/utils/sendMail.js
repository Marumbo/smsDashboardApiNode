const nodemailer = require("nodemailer");

function createTransporter() {
  return nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false,
    auth: {
      user: "maddison53@ethereal.email",
      pass: "jn7jnAPss4f63QBp6D",
    },
  });
}
async function sendEmail(mailOptions) {
  try {
    const transporter = createTransporter();
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.log(error, "Something went wrong when sending the email");
  }
}

module.exports = { sendEmail };
