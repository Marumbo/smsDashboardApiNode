const Group = require("../models/group");

const getAllGroups = async (req, res) => {
  await Group.find()
    .then((result) => {
      console.log("Returning all group");
      return res.json({
        status: "success",
        message: "group list",
        result: result,
      });
    })
    .catch((error) => {
      console.log(err);
      return res.json({
        status: "fail",
        message: "group list failure",
        error: error.message,
      });
    });
};

async function createGroup(req, res) {
  const groupData = req.body;
  console.log("group data ", groupData);
  //check if data is not empty

  const groupCheck = await Group.find({
    name: groupData.name,
  });

  if (groupCheck) {
    return res.json({
      status: "fail",
      message: "group already exists",
    });
  }

  const groupEntry = new Group({
    ...groupData,
  });

  await groupEntry
    .save()
    .then((result) => {
      console.log("saving group");
      console.log(result);

      return res.json({
        status: "success",
        message: "group saved",
        result: result,
      });
    })
    .catch((error) => {
      console.log("error saving group");
      console.log(error);
      return res.json({
        status: "fail",
        message: "group save failure",
        error: error.message,
      });
    });
}

async function getGroup(req, res) {
  const id = req.params.id;

  try {
    const group = await Group.findById(id);
    if (!group) {
      return res.json({
        status: "fail",
        message: "group not found",
      });
    }
    return res.json({
      status: "success",
      message: "group found",
      result: group,
    });
  } catch (error) {
    return res.json({
      status: "fail",
      message: "group find failure",
      error: error.message,
    });
  }
}

async function updateGroup(req, res) {
  const id = req.params.id;
  const groupData = req.body;

  const groupFind = await Group.findById(id);
  if (!groupFind) {
    return res.json({
      status: "fail",
      message: "group does not exist.",
    });
  }

  try {
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
  const id = req.params.id;
  const group = await Group.findById(id);

  if (!group) {
    return res.json({
      status: "fail",
      message: "group does not exist",
    });
  }
  try {
    const deletedGroup = await Group.deleteOne({ _id: id });

    return res.json({
      status: "success",
      message: "Group deleted",
      result: deletedGroup,
    });
  } catch (error) {
    return res.json({
      status: "fail",
      message: "Group delete failure",
      error: error.message,
    });
  }
}

module.exports = {
  getAllGroups,
  getGroup,
  createGroup,
  updateGroup,
  deleteGroup,
};
