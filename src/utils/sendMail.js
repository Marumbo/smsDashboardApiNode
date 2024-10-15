const nodemailer = require("nodemailer");

async function sendEmail(mailOptions) {
  try {
    const transporter = nodemailer.createTransport({
      // service: "gmail",
      // auth: {
      //   user: process.env.EMAIL_USER,
      //   pass: process.env.EMAIL_PASSWORD,
      // },
      host: "smtp.ethereal.email",
      port: 587,
      secure: false, // true for port 465, false for other ports
      auth: {
        user: "maddison53@ethereal.email",
        pass: "jn7jnAPss4f63QBp6D",
      },
    });
    const info = await transporter.sendMail(mailOptions);
  } catch (error) {
    console.log(error, "Something went wrong when sending the email");
  }
}

module.exports = { sendEmail };
