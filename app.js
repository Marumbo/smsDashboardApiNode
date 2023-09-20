const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const messageRouter = require("./routes/messageRoutes");
const purchaseRouter = require("./routes/purchaseRoutes");

require("dotenv").config();

const app = express();

app.use(express.json());

app.use(cors());

mongoose
  .connect(process.env.dbURI)
  .then((result) => {
    console.log("connected to db!");
  })
  .catch((err) => console.log(err));

console.log("Started server on port 4242!");
app.listen(process.env.PORT || 4242);

app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  console.log("infotext api");
  res.send("infotextapi");
});

app.get("/public-key", (req, res) => {
  console.log("request for public key");
  res.send({
    "public-key": process.env.public_key,
  });
});

app.use("/messages", messageRouter);
app.use("/purchase", purchaseRouter);
