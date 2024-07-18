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

const { accessResource } = require("./src/middlewares/accessResource.js");

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

mongoose.set("strictQuery", false);
mongoose
  .connect(process.env.dbURI)
  .then((result) => {
    console.log("connected to db!");
  })
  .catch((err) => console.log(err));

const port = process.env.PORT || 4242;
app.listen(port, () => {
  console.log("Server started on port " + port);
}
);

app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  console.log("infotext api");
  res.send("Welcome to Infotext api Home Route :: 🚀🚀🚀");
});

app.get("/public-key", (req, res) => {
  console.log("request for public key");
  res.send({
    "public-key": process.env.public_key,
  });
});

app.use("/auth", authRoutes);
app.use("/messages" ,messageRouter);

app.use("/purchase", purchaseRouter);
app.use("/organisations", organisationRouter);

app.use("/users", userRouter);
app.use("/countryCodes", countryCodeRouter);
app.use("/smsPriceSettings", smsPriceSettingsRouter);
app.use("/contacts", contactRouter);
app.use("/groups", groupRouter);
