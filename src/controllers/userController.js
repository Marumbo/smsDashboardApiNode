const User = require("../models/user");
const Organisation = require("../models/organisation");
var mongoose = require("mongoose");
var ObjectId = mongoose.Types.ObjectId;

async function getAllUsers(req, res) {
  await User.find()
    .then((result) => {
      console.log("Returning all users");
      res.json({
        status: "success",
        message: "user list",
        result: result,
      });
    })
    .catch((error) => {
      console.log(err);
      res.json({
        status: "fail",
        message: "User list failure",
        error: error.message,
      });
    });
}

async function createUser(req, res) {
  //TODO: hash password
  //TODO: Check for required values
  const userData = req.body;

  const organisation = await Organisation.findById(
    ObjectId(userData.organisation_id)
  );
  if (!organisation) {
    return res.json({
      status: "fail",
      message: "organisation doesnt exist, cannot create user",
    });
  }
  const userCheck = User.find({
    email: userData.email,
  });

  if (userCheck) {
    return res.json({
      status: "faile",
      message: "user with that email already exists",
      result: result,
    });
  }

  const userEntry = new User({
    ...userData,
  });

  userEntry
    .save()
    .then((result) => {
      console.log("saving user");
      console.log(result);

      return res.json({
        status: "success",
        message: "user saved",
        result: result,
      });
    })
    .catch((error) => {
      console.log("error saving user");
      console.log(error);
      return res.json({
        status: "fail",
        message: "user save failure",
        error: error.message,
      });
    });
}

async function getUser(req, res) {
  const id = req.params.id;

  try {
    const user = await User.findById(id);
    if (!user) {
      return res.json({
        status: "fail",
        message: "user not found",
      });
    }
    return res.json({
      status: "success",
      message: "user found",
      result: user,
    });
  } catch (error) {
    return res.json({
      status: "fail",
      message: "user find failure",
      error: error.message,
    });
  }
}

async function updateUser(req, res) {
  const id = req.params.id;
  const userData = req.body;
  const organisation = await Organisation.findById(
    ObjectId(userData.organisation_id)
  );

  if (!organisation) {
    return res.json({
      status: "fail",
      message: "organisation does not exist, cannot update user",
    });
  }
  const userFind = await User.findById(id);
  if (!userFind) {
    return res.json({
      status: "fail",
      message: "User does not exist.",
    });
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(id, userData, {
      new: true,
    });

    return res.json({
      status: "success",
      message: "User updated",
      result: updatedUser,
    });
  } catch (error) {
    return res.json({
      status: "fail",
      message: "User update failure",
      error: error.message,
    });
  }
}

async function deleteUser(req, res) {
  const id = req.params.id;
  const user = await User.findById(id);

  if (!user) {
    return res.json({
      status: "fail",
      message: "user does not exist",
    });
  }
  try {
    const deletedUser = await User.deleteOne({ _id: id });

    return res.json({
      status: "success",
      message: "User deleted",
      result: deletedUser,
    });
  } catch (error) {
    return res.json({
      status: "fail",
      message: "User delete failure",
      error: error.message,
    });
  }
}

module.exports = {
  getAllUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
};
