const Purchase = require("../models/purchase");

const purchase_index = (req, res) => {
  Purchase.find()
    .then((result) => {
      //console.log("Returning all Purchases");

      return res.json({
        status: "success",
        message: "purchase list",
        result: result,
      });
    })
    .catch((err) => {
      //console.log(err);
      return res.json({
        status: "fail",
        message: "Purchse list failure",
        error: err.message,
      });
    });
};

const purchase_create_post = (req, res) => {
  console.log(req.body);
  const { email, transId } = req.body;

  const purchaseEntry = new Purchase({
    email: email,
    transId: transId,
  });

  purchaseEntry
    .save()
    .then((result) => {
      console.log("saving purchase");
      console.log(result);

      res.json({
        status: "success",
        message: "purchase saved",
        result: result,
      });
    })
    .catch((err) => {
      console.log("error saving purchase");
      console.log(err);
      res.json({
        status: "fail",
        message: "purchase save failure",
        error: err.message,
      });
    });
};

module.exports = {
  purchase_index,
  purchase_create_post,
};
