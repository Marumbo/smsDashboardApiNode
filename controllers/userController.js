const User = require("../models/user");
const Organisation = require("../models/organisation");
var mongoose = require("mongoose");
var ObjectId = mongoose.Types.ObjectId;

const getAllUsers = (req, res) => {
  User.find()
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
};

async function createUser(req, res) {
  //TODO: hash password
  //TODO: Check for required values
  const userData = req.body;
  console.log(userData);

  const organisation = await Organisation.findById(
    ObjectId(userData.organisation_id)
  );
  if (!organisation) {
    res.json({
      status: "fail",
      message: "organisation doesnt exist, cannot create user",
    });
  }
  const userCheck = User.find({
    email: userData.email,
  });

  if (userCheck) {
    res.json({
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

      res.json({
        status: "success",
        message: "user saved",
        result: result,
      });
    })
    .catch((error) => {
      console.log("error saving user");
      console.log(error);
      res.json({
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
      res.json({
        status: "fail",
        message: "user not found",
      });
    }
    res.json({
      status: "success",
      message: "user found",
      result: user,
    });
  } catch (error) {
    res.json({
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
    res.json({
      status: "fail",
      message: "organisation does not exist, cannot update user",
    });
  }
  const userFind = await User.findById(id);
  if (!userFind) {
    res.json({
      status: "fail",
      message: "User does not exist.",
    });
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(id, userData, {
      new: true,
    });

    res.json({
      status: "success",
      message: "User updated",
      result: updatedUser,
    });
  } catch (error) {
    res.json({
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
    res.json({
      status: "fail",
      message: "user does not exist",
    });
  }
  try {
    const deletedUser = await User.deleteOne({ _id: id });

    res.json({
      status: "success",
      message: "User deleted",
      result: deletedUser,
    });
  } catch (error) {
    res.json({
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
