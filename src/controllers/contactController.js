const Contact = require("../models/contact");
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
  const { name, email, phone_number, description } = req.body;

  const contactCheck = await Contact.find({
    $or: [ { email: email }, { phone_number: phone_number }],
  });

  if (contactCheck.length) {
    return res.status(409).json({
      status: "fail",
      message: "Contact already exists",
    });
  }

  try {
    const newContact = new Contact({
      name,
      email,
      phone_number,
      description,
    })
    await newContact.save();
    return res.status(201).json({
      status: "success",
      message: "Contact added successfully",
      result: newContact,
    })
  } catch (error) {
    return res.status(500).json({
      status: "fail",
      message: "An error occurred while creating the contact",
      error: error.message,
    })
  }
}

async function bulkContacts(req, res) {
  const { contacts } = req.body;
  
  // Check if contacts array is provided
  if (!Array.isArray(contacts) || contacts.length === 0) {
    return res.status(400).json({
      status: "fail",
      message: "No contacts provided",
    });
  }

  // const existingContacts = await Contact.find({
  //   $or: contacts.map(contact => ({
  //     phone_number: contact.phone_number,
  //     email: contact.email
  //   }))
  // });

  // if (existingContacts.length) {
  //   return res.status(409).json({
  //     status: "fail",
  //     message: "Contact already exists",
  //   });

  // }

  // Create an array of search criteria for existing contacts
  const searchCriteria = contacts.flatMap(contact => {
    const criteria = [];
    if (contact.phone_number) {
      criteria.push({ phone_number: contact.phone_number });
    }
    if (contact.email) {
      criteria.push({ email: contact.email });
    }
    return criteria;
  });

  try {
    // Find existing contacts
    const existingContacts = await Contact.find({
      $or: searchCriteria
    });

    if (existingContacts.length) {
      return res.status(409).json({
        status: "fail",
        message: "Some contacts already exist",
        existingContacts,
      });
    }

    // Create new contacts
    const newContact = await Contact.insertMany(contacts);

    return res.status(201).json({
      status: "success",
      message: "Multiple Contacts added successfully",
      result: newContact,
    })
  } catch (error) {
    return res.status(500).json({
      status: "fail",
      message: "An error occurred while creating the contact",
      error: error.message,
    })
  }
}

async function getContact(req, res) {
  const id = req.params.id;

  try {
    const contact = await Contact.findById(id);

    if (!contact) {
      return res.json({
        status: "fail",
        message: "Contact not found",
      });
    }
    return res.json({
      status: "success",
      message: "Contact found",
      result: contact,
    });
  } catch (error) {
    return res.json({
      status: "fail",
      message: "Contact find failure",
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
      message: "Contact does not exist",
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
  bulkContacts,
  updateContact,
  deleteContact,
};
