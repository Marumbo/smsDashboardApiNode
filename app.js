const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

const messageRouter = require("./src/routes/messageRoutes.js");
const purchaseRouter = require("./src/routes/purchaseRoutes.js");
const organisationRouter = require("./src/routes/organisationRoutes.js");
const userRouter = require("./src/routes/userRoutes.js");
const countryCodeRouter = require("./src/routes/countryCodeRoutes.js");
const smsPriceSettingsRouter = require("./src/routes/smsPriceSettingsRoutes.js");
const contactRouter = require("./src/routes/contactRoutes.js");
const groupRouter = require("./src/routes/groupRoutes.js");
const authRoutes = require("./src/routes/authRoutes.js");
const callbackRoutes = require("./src/routes/callbackRoutes.js");

const { accessResource } = require("./src/middlewares/accessResource.js");
const { sendEmail } = require("./src/utils/sendMail.js");

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

mongoose.set("strictQuery", false);
mongoose
  .connect(process.env.DB_URI)
  .then((result) => {
    console.log("connected to db!");
  })
  .catch((err) => console.log(err));

const port = process.env.PORT ?? 4242;
app.listen(port, () => {
  console.log("Server started on port " + port);
}
);


app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  console.log("infotext api");
  res.send("Welcome to Infotext api Home Route :: 🚀🚀🚀");
});

app.post("/contact-form", async (req, res) => {
  const { from, message, subject } = req.body

  if (!from || !message || !subject) {
    return res.status(400).json({ status: 'failed', error: 'Please provide all required fields: to, subject, message' })
  }

  const mailOptions = {
    from,
    to: process.env.EMAIL_USER,
    subject,
    text: message,
    // html: `<b>${message}</b>`, // html body
  };

  try {
    await sendEmail(mailOptions)

    return res.status(200).json({ status: "success", message: "Email sent successfully" });

  } catch (error) {
    return res.status(500).json({ error: `Error sending email: ${error.message}` });
  }
})

app.get("/public-key", (req, res) => {
  res.send({
    "public-key": process.env.PUBLIC_KEY,
  });
});
app.get("/webhook-secret", (req, res) => {
  res.send({
    "webhook-secret": process.env.WEBHOOK_SECRET,
  });
});

app.use("/auth", authRoutes);
app.use("/messages", messageRouter);

app.use("/purchase", purchaseRouter);
app.use("/organisations", organisationRouter);

app.use("/users", userRouter);
app.use("/countryCodes", countryCodeRouter);
app.use("/smsPriceSettings", smsPriceSettingsRouter);
app.use("/contacts", contactRouter);
app.use("/groups", groupRouter);
app.use("/callbacks", callbackRoutes);
