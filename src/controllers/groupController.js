const { isEmpty } = require("lodash");
const Group = require("../models/group");
const Contact = require("../models/contact");

const getAllGroups = async (req, res) => {
  try {
    const result = await Group.find().populate('contacts');

    return res.status(200).json({
      status: "success",
      message: "Group list",
      result: result,
    });
  } catch (error) {
    return res.status(500).json({
      status: "fail",
      message: "Group list failure",
      error: error.message,
    });
  }
};

async function createGroup(req, res) {
  const { name, description, contacts } = req.body;
  //check if data is not empty
  if (isEmpty(name) || isEmpty(description)) {
    return res.status(400).json({
      status: "fail",
      message: "Group name or description is required",
    });
  }

  const groupCheck = await Group.find({
    name: name,
  });

  if (groupCheck.length) {
    return res.status(409).json({
      status: "fail",
      message: "group already exists",
    });
  }

  try {

    const groupEntry = new Group({
      name,
      description,
      contacts
    });

    const result = await groupEntry.save()

    return res.json({
      status: "success",
      message: "group saved",
      result: result,
    });

  } catch (error) {
    console.log("error saving group");
    console.log(error);
    return res.json({
      status: "fail",
      message: "group save failure",
      error: error.message,
    });
  }
}

async function getGroup(req, res) {
  const { id } = req.params;

  if (!id) {
    return res.json({
      status: "fail",
      message: "Group id is required",
    });
  }
  try {
    const group = await Group.findById(id).populate('contacts');

    if (!group) {
      return res.status(404).json({
        status: "fail",
        message: "Group not found",
      });
    }
    return res.status(200).json({
      status: "success",
      message: "Group found",
      result: group,
    });
  } catch (error) {
    return res.status(500).json({
      status: "fail",
      message: "group find failure",
      error: error.message,
    });
  }
}

async function updateGroup(req, res) {
  const id = req.params.id;
  const groupData = req.body;

  try {
    const groupFind = await Group.findById(id);
    if (!groupFind) {
      return res.json({
        status: "fail",
        message: "group does not exist.",
      });
    }

    const updatedGroup = await Group.findByIdAndUpdate(id, groupData, {
      new: true,
    });

    return res.json({
      status: "success",
      message: "Group updated",
      result: updatedGroup,
    });
  } catch (error) {
    return res.json({
      status: "fail",
      message: "Group update failure",
      error: error.message,
    });
  }
}

async function deleteGroup(req, res) {
  //TODO: a check for id check if less than desired number or string?
  const { id } = req.params;
  const group = await Group.findById(id);

  if (!group) {
    return res.status(400).json({
      status: "fail",
      message: "group does not exist",
    });
  }

  try {
    const deletedGroup = await Group.deleteOne({ _id: id });

    return res.status(200).json({
      status: "success",
      message: "Group deleted",
      result: deletedGroup,
    });
  } catch (error) {
    return res.status(500).json({
      status: "fail",
      message: "Group delete failure",
      error: error.message,
    });
  }
}

// Add contacts to a group
const addContactsToGroup = async (req, res) => {
  const { id } = req.params;
  const { contactIds } = req.body;

  if (!id) {
    return res.status(400).json({ error: "Group ID is required" });
  }
  // Validate the provided contact IDs
  if (!Array.isArray(contactIds)) {
    return res.status(400).json({ error: "Contact IDs must be an array" });
  }

  try {
    // Validate the provided contact IDs
    const validContacts = await Contact.find({ _id: { $in: contactIds } });
    if (validContacts.length !== contactIds.length) {
      return res.status(400).json({ error: "One or more contacts are invalid" });
    }

    // Find the group and add the contacts to it
    const group = await Group.findById(id);
    if (!group) {
      return res.status(404).json({ error: "Group not found" });
    }

    // Filter out contact IDs that are already in the group
    const newContacts = contactIds.filter(contactId => !group.contacts.includes(contactId));

    if (newContacts.length === 0) {
      return res.status(400).json({ error: "All contacts are already in the group" });
    }

    group.contacts = [...new Set([...group.contacts, ...contactIds])];
    await group.save();

    return res.status(200).json({ status: "success", message: "Contacts Added", result: group });
  } catch (error) {
    return res.status(500).json({ status: "fail", message: "Group update failure", error: error.message });
  }
};

const removeContactsFromGroup = async (req, res) => {
  const { id } = req.params;
  const { contactIds } = req.body;

  if (!id) {
    return res.status(400).json({ error: "Group ID is required" });
  }

  // Validate the provided contact IDs
  if (!Array.isArray(contactIds)) {
    return res.status(400).json({ error: "Contact IDs must be an array" });
  }

  try {
    // Validate the provided contact IDs
    const validContacts = await Contact.find({ _id: { $in: contactIds } });
    if (validContacts.length !== contactIds.length) {
      return res.status(400).json({ error: "One or more contacts are invalid" });
    }

    // Find the group and remove the contacts from it
    const group = await Group.findById(id);
    if (!group) {
      return res.status(404).json({ error: "Group not found" });
    }

    // Filter out contact IDs that are in the group
    const remainingContacts = group.contacts.filter(
      contactId => !contactIds.includes(contactId.toString())
    );

    // Check if any contacts were removed
    if (remainingContacts.length === group.contacts.length) {
      return res.status(400).json({ error: "None of the specified contacts were in the group" });
    }

    group.contacts = remainingContacts;
    await group.save();

    res.status(200).json({ status: "success", message: "Contacts removed", result: group });
  } catch (error) {
    return res.status(500).json({ status: "fail", message: "Group update failure", error: error.message });
  }
};
module.exports = {
  getAllGroups,
  getGroup,
  createGroup,
  updateGroup,
  deleteGroup,
  addContactsToGroup,
  removeContactsFromGroup
};
