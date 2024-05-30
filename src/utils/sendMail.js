const nodemailer = require("nodemailer");

async function sendEmail(userEmail) {
    try {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD,
            },
        });
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: userEmail,
            subject: "Email Verification",
            text: `Click on the link to verify your email ${process.env.CLIENT_URL}/verifyEmail/${req.body.emailToken}`,
        };
        await transporter.sendMail(mailOptions);
        res.status(200).send({ status: "success", message: "email sent" });
    } catch (error) {
        res.status(500).send({ status: "fail", message: error.message });
    }
}

module.exports = { sendEmail }