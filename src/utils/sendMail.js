const nodemailer = require("nodemailer");

async function sendEmail(mailOptions) {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false, 
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
