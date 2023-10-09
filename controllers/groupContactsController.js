const GroupContact = require("../models/groupContact");
const Group = require("../models/group");
const Contact = require("../models/contact");
const { ObjectId } = require("mongodb");
const mongoose = require("mongoose");

const getAllGroupContacts = (req, res) => {
  GroupContact.find()
    .then((result) => {
      console.log("Returning all group contacts lists");
      return res.json({
        status: "success",
        message: "group contact lists",
        result: result,
      });
    })
    .catch((error) => {
      console.log(err);
      return res.json({
        status: "fail",
        message: "group contact list failure",
        error: error.message,
      });
    });
};

async function createGroupContacts(req, res) {
  const groupContactData = req.body;
  console.log("group contact data ", groupContactData);
  //check if data is not empty
  try {
    const groupCheck = Group.findById(groupContactData.group_id);

    if (!groupCheck) {
      return res.json({
        status: "fail",
        message: "group id does not exist",
      });
    }

    let contacts = [];

    for (const id in groupContactData.contact_ids) {
      const contactIdCheck = await Contact.findById(
        groupContactData.contact_ids[id]
      );
      console.log("contactIdcheck", contactIdCheck);
      if (contactIdCheck != null) {
        contacts.push(groupContactData.contact_ids[id]);
      }
    }

    const groupContactCheck = await GroupContact.find({
      group_id: groupContactData.group_id,
    });

    console.log("group contact", groupContactCheck);
    if (groupContactCheck.length) {
      return res.json({
        status: "fail",
        message: "group contact id exists already",
      });
    }
    const groupContactEntry = new GroupContact({
      group_id: groupContactData.group_id,
      contact_ids: contacts,
    });

    groupContactEntry.save().then((result) => {
      console.log("saving group contact");
      console.log(result);

      return res.json({
        status: "success",
        message: "group contact saved",
        result: result,
      });
    });
  } catch (error) {
    console.log("error saving group contact");
    console.log(error);
    return res.json({
      status: "fail",
      message: "group contact save failure",
      error: error.message,
    });
  }
}

async function getGroupContact(req, res) {
  const id = req.params.id;

  try {
    const groupContact = await GroupContact.findById(id);
    if (!groupContact) {
      return res.json({
        status: "fail",
        message: "group contact not found",
      });
    }
    return res.json({
      status: "success",
      message: "group contact found",
      result: groupContact,
    });
  } catch (error) {
    return res.json({
      status: "fail",
      message: "group find failure",
      error: error.message,
    });
  }
}

async function addContactToGroup(req, res) {
  const id = req.params.id;
  const groupContactData = req.body;

  try {
    const groupContactFind = await GroupContact.findById(id);
    if (!groupContactFind) {
      return res.json({
        status: "fail",
        message: "group does not exist.",
      });
    }

    const groupCheck = Group.findById(groupContactData.group_id);

    if (!groupCheck) {
      return res.json({
        status: "fail",
        message: "group id does not exist",
      });
    }

    let contacts = [];

    for (const id in groupContactData.contact_ids) {
      const contactIdCheck = await Contact.findById(
        groupContactData.contact_ids[id]
      );
      console.log("contactIdcheck", contactIdCheck);

      const contactFind = await GroupContact.find({
        contact_ids: { $in: [groupContactData.contact_ids[id]] },
      });

      if (contactIdCheck != null && !contactFind) {
        contacts.push(groupContactData.contact_ids[id]);
      }
    }

    const groupContactCheck = await GroupContact.findById(id);

    console.log("group contact", groupContactCheck);
    if (groupContactCheck.length) {
      return res.json({
        status: "fail",
        message: "group contact id exists already",
      });
    }

    const updatedGroupContact = await GroupContact.findByIdAndUpdate(
      { _id: id },
      {
        group_id: groupContactData.group_id,
        $push: { contact_ids: contacts },
      },
      {
        new: true,
      }
    );

    return res.json({
      status: "success",
      message: "Group contact updated with new contacts",
      result: updatedGroupContact,
    });
  } catch (error) {
    return res.json({
      status: "fail",
      message: "Group update add contact failure",
      error: error.message,
    });
  }
}

async function removeContactFromGroup(req, res) {
  const id = req.params.id;
  const groupContactData = req.body;

  try {
    const groupContactFind = await GroupContact.findById(id);
    if (!groupContactFind) {
      return res.json({
        status: "fail",
        message: "group does not exist.",
      });
    }

    const groupCheck = Group.findById(groupContactData.group_id);

    if (!groupCheck) {
      return res.json({
        status: "fail",
        message: "group id does not exist",
      });
    }
    const updatedGroupContact = await GroupContact.findByIdAndUpdate(
      { _id: id },
      {
        group_id: groupContactData.group_id,
        $pull: { contacts: groupContactData.contacts },
      },
      {
        new: true,
      }
    );

    return res.json({
      status: "success",
      message: "Group contact updated with new contacts",
      result: updatedGroupContact,
    });
  } catch (error) {
    return res.json({
      status: "fail",
      message: "Group update add contact failure",
      error: error.message,
    });
  }
}

async function deleteGroupContact(req, res) {
  //TODO: a check for id check if less than desired number or string?
  const id = req.params.id;
  const groupContact = await GroupContact.findById(id);

  if (!groupContact) {
    return res.json({
      status: "fail",
      message: "group does not exist",
    });
  }
  try {
    const deletedGroupContact = await GroupContact.deleteOne({ _id: id });

    return res.json({
      status: "success",
      message: "Group contact deleted",
      result: deletedGroupContact,
    });
  } catch (error) {
    return res.json({
      status: "fail",
      message: "Group Contact delete failure",
      error: error.message,
    });
  }
}

module.exports = {
  getAllGroupContacts,
  getGroupContact,
  createGroupContacts,
  addContactToGroup,
  removeContactFromGroup,
  deleteGroupContact,
};
