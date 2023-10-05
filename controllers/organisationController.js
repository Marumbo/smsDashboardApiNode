const Organisation = require("../models/organisation");

async function getAllOrganisations(req, res) {
  Organisation.find()
    .then((result) => {
      console.log("Returning all organisation");

      res.json({
        status: "success",
        message: "Organisation list",
        result: result,
      });
    })
    .catch((err) => {
      console.log(err);
      res.json({
        status: "fail",
        message: "Organisation list failure",
        error: err.message,
      });
    });
}

async function createOrganisation(req, res) {
  const { email, name, sender_id } = req.body;
  //add check for values not being empty
  const organisationCheck = await Organisation.find({
    email: email,
  });

  if (organisationCheck) {
    res.json({
      status: "fail",
      message: "Organisation with email already exists",
    });
  }

  const organisationEntry = new Organisation({
    email: email,
    sender_id: sender_id,
    name: name,
  });

  organisationEntry
    .save()
    .then((result) => {
      console.log("saving organisation");
      console.log(result);

      res.json({
        status: "success",
        message: "organisation saved",
        result: result,
      });
    })
    .catch((err) => {
      console.log("error saving organisation");
      console.log(err);
      res.json({
        status: "fail",
        message: "organisation save failure",
        error: err.message,
      });
    });
}

async function getOrganisaion(req, res) {
  const id = req.params.id;

  try {
    const organisation = await Organisation.findById(id);
    if (!organisation) {
      res.json({
        status: "fail",
        message: "organisation not found",
      });
    }
    res.json({
      status: "success",
      message: "Organisation found",
      result: organisation,
    });
  } catch (error) {
    res.json({
      status: "fail",
      message: "Organisation find failure",
      error: error.message,
    });
  }
}

async function updateOrganisation(req, res) {
  const id = req.params.id;
  const organisationData = req.body;
  const organisation = await Organisation.findById(id);

  if (!organisation) {
    res.json({
      status: "fail",
      message: "Organisation does not exist",
    });
  }
  try {
    const updatedOrganisation = await Organisation.findByIdAndUpdate(
      id,
      organisationData,
      { new: true }
    );

    res.json({
      status: "success",
      message: "Organisation updated",
      result: updatedOrganisation,
    });
  } catch (error) {
    res.json({
      status: "fail",
      message: "Organisation update failure",
      error: error.message,
    });
  }
}

async function deleteOrganisation(req, res) {
  const id = req.params.id;
  const organisation = await Organisation.findById(id);

  if (!organisation) {
    res.json({
      status: "fail",
      message: "Organisation does not exist",
    });
  }
  try {
    const deletedOrganisation = await Organisation.deleteOne({ _id: id });

    res.json({
      status: "success",
      message: "Organisation deleted",
      result: deletedOrganisation,
    });
  } catch (error) {
    res.json({
      status: "fail",
      message: "Organisation delete failure",
      error: error.message,
    });
  }
}

module.exports = {
  getAllOrganisations,
  getOrganisaion,
  createOrganisation,
  updateOrganisation,
  deleteOrganisation,
};
