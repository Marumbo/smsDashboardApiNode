const Contact = require("../models/contact");

const getAllContacts = (req, res) => {
  Contact.find()
    .then((result) => {
      console.log("Returning all contact");
      return res.json({
        status: "success",
        message: "Contact list",
        result: result,
      });
    })
    .catch((error) => {
      console.log(err);
      return res.json({
        status: "fail",
        message: "Contact list failure",
        error: error.message,
      });
    });
};

async function createContact(req, res) {
  const contactData = req.body;
  console.log("Contact data ", contactData);
  //check if data is not empty

  const contactCheck = Contact.find({
    phone_number: contactData.phone_number,
  });

  if (contactCheck) {
    return res.json({
      status: "fail",
      message: "contact already exists",
    });
  }

  const contactEntry = new Contact({
    ...contactData,
  });

  contactEntry
    .save()
    .then((result) => {
      console.log("saving contact");
      console.log(result);

      return res.json({
        status: "success",
        message: "contact saved",
        result: result,
      });
    })
    .catch((error) => {
      console.log("error saving contact");
      console.log(error);
      return res.json({
        status: "fail",
        message: "contact save failure",
        error: error.message,
      });
    });
}

async function getContact(req, res) {
  const id = req.params.id;

  try {
    const contact = await Contact.findById(id);
    if (!contact) {
      return res.json({
        status: "fail",
        message: "contact not found",
      });
    }
    return res.json({
      status: "success",
      message: "contact found",
      result: contact,
    });
  } catch (error) {
    return res.json({
      status: "fail",
      message: "contact find failure",
      error: error.message,
    });
  }
}

async function updateContact(req, res) {
  const id = req.params.id;
  const contactData = req.body;

  const contactFind = await Contact.findById(id);
  if (!contactFind) {
    return res.json({
      status: "fail",
      message: "Contact does not exist.",
    });
  }

  try {
    const updatedContact = await Contact.findByIdAndUpdate(id, contactData, {
      new: true,
    });

    return res.json({
      status: "success",
      message: "Contact updated",
      result: updatedContact,
    });
  } catch (error) {
    return res.json({
      status: "fail",
      message: "Contact update failure",
      error: error.message,
    });
  }
}

async function deleteContact(req, res) {
  //TODO: a check for id check if less than desired number or string?
  const id = req.params.id;
  const contact = await Contact.findById(id);

  if (!contact) {
    return res.json({
      status: "fail",
      message: "Contact does not exist",
    });
  }
  try {
    const deletedContact = await Contact.deleteOne({ _id: id });

    return res.json({
      status: "success",
      message: "Country deleted",
      result: deletedContact,
    });
  } catch (error) {
    return res.json({
      status: "fail",
      message: "Contact failure",
      error: error.message,
    });
  }
}

module.exports = {
  getAllContacts,
  getContact,
  createContact,
  updateContact,
  deleteContact,
};
