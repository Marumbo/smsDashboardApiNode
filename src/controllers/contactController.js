const Contact = require("../models/contact");
const csv = require("csvtojson");
const fs = require("fs");

async function getAllContacts(req, res) {
  await Contact.find().sort({ createdAt: -1 })
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
}

async function createContact(req, res) {
  const contactData = req.body;
  console.log("Contact data ", contactData);
  //check if data is not empty

  const contactCheck = await Contact.find({
    phone_number: contactData.phone_number,
  });

  console.log("Contact check", contactCheck);

  if (contactCheck.length) {
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

async function createContactFromCsv(req, res, next) {

  csv().fromFile(req.file.path).then(async (jsonObj) => {

    const availableContacts = await Contact.find();

    const contactsToSave = jsonObj.filter(contact => {
      const isAvailable = availableContacts.some(aContact => aContact.email === contact.email || aContact.phone_number === contact.phone_number);
      if (!isAvailable) return true;
      console.log(`Contact with ${contact.email} or ${contact.phone_number} already exists`);
      return false;
    });

    if (contactsToSave.length === 0) {
      // console.log("No contacts to save", contactsToSave);
      // clear uploads folder
      fs.unlinkSync(req.file.path);
      return res.status(200).json({
        status: "success",
        message: "No contacts to save",
      })
    } else {

      try {
        const savedContacts = await Contact.insertMany(contactsToSave, { ordered: false });
        // console.log("savedContacts", savedContacts);
        if (savedContacts.insertedCount > 0) {
          return res.status(200).json({
            status: "success",
            message: "Contacts saved successfully!",
          });
        }
      } catch (error) {
        return res.status(500).json({
          status: "fail",
          message: "Contacts save failure",
          error: error.message,
        });
      }
    }
  })

  // next()
}

async function getContact(req, res) {
  const id = req.params.id;

  try {
    const contact = await Contact.findById(id);
    console.log("Get contact, contact", contact);
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
  console.log("contact", contactFind);
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
  console.log("contact", contact);
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
      message: "Contact deleted",
      result: deletedContact,
    });
  } catch (error) {
    return res.json({
      status: "fail",
      message: "Contact delete failure",
      error: error.message,
    });
  }
}

module.exports = {
  getAllContacts,
  getContact,
  createContact,
  createContactFromCsv,
  updateContact,
  deleteContact,
};
