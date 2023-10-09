const SmsPriceSettings = require("../models/smsPriceSettings");
const CountryCode = require("../models/countryCode");
const Organisation = require("../models/organisation");

async function getAllSmsPriceSettings(req, res) {
  await SmsPriceSettings.find()
    .then((result) => {
      // console.log("Returning all Sms Price Settings");
      res.json({
        status: "success",
        message: "Sms Price Settings list",
        result: result,
      });
    })
    .catch((error) => {
      console.log(err);
      res.json({
        status: "fail",
        message: "Sms Price Settings list failure",
        error: error.message,
      });
    });
}

async function createSmsPriceSettings(req, res) {
  const smsPriceSettingsData = req.body;
  console.log("Sms Price Settings ", smsPriceSettingsData);
  //check if data is not empty
  try {
    const organisationCheck = await Organisation.findById(
      smsPriceSettingsData.organisation_id
    );
    console.log(organisationCheck);
    if (!organisationCheck) {
      return res.json({
        status: "fail",
        message: "Organisation does not exists check id",
      });
    }

    const countyCodeCheck = await CountryCode.find({
      country_code: smsPriceSettingsData.country_code,
    });

    if (!countyCodeCheck) {
      return res.json({
        status: "fail",
        message: "country code  doest not exist",
      });
    }

    const smsPriceSettingsCheck = SmsPriceSettings.findOne({
      organisation_id: smsPriceSettingsData.organisation_id,
      country_code: smsPriceSettingsData.country_code,
    });

    if (smsPriceSettingsCheck) {
      return res.json({
        status: "fail",
        message: "Price for the country code and organisation already exists",
      });
    }

    const smsPriceSettingsEntry = new SmsPriceSettings({
      ...smsPriceSettingsData,
    });

    smsPriceSettingsEntry.save().then((result) => {
      return res.json({
        status: "success",
        message: "Sms Price Settings saved",
        result: result,
      });
    });
  } catch (error) {
    return res.json({
      status: "fail",
      message: "Sms Price Settings save failure",
      error: error.message,
    });
  }
}

async function getSmsPriceSettings(req, res) {
  const id = req.params.id;

  try {
    const smsPriceSettings = await SmsPriceSettings.findById(id);
    if (!smsPriceSettings) {
      return res.json({
        status: "fail",
        message: "SmsPriceSettings not found",
      });
    }
    return res.json({
      status: "success",
      message: "SmsPriceSettings found",
      result: smsPriceSettings,
    });
  } catch (error) {
    return res.json({
      status: "fail",
      message: "SmsPriceSettingsfind failure",
      error: error.message,
    });
  }
}

async function updateSmsPriceSettings(req, res) {
  const id = req.params.id;
  const smsPriceSettingsData = req.body;

  try {
    const smsPriceSettingsFind = await SmsPriceSettings.findById(id);
    if (!smsPriceSettingsFind) {
      return res.json({
        status: "fail",
        message: "Sms Price Settings does not exist.",
      });
    }

    const updatedSmsPriceSettingsData =
      await SmsPriceSettings.findByIdAndUpdate(id, smsPriceSettingsData, {
        new: true,
      });

    return res.json({
      status: "success",
      message: "Sms Price Settings updated",
      result: updatedSmsPriceSettingsData,
    });
  } catch (error) {
    return res.json({
      status: "fail",
      message: "Sms Price Settings update failure",
      error: error.message,
    });
  }
}

async function deleteSmsPriceSettings(req, res) {
  //TODO: a check for id check if less than desired number or string?
  const id = req.params.id;

  try {
    const smsPriceSettings = await SmsPriceSettings.findById(id);

    if (!smsPriceSettings) {
      return res.json({
        status: "fail",
        message: "Sms Price Settings does not exist",
      });
    }

    const deletedSmsPriceSettings = await SmsPriceSettings.deleteOne({
      _id: id,
    });

    return res.json({
      status: "success",
      message: "SmsPriceSettings deleted",
      result: deletedSmsPriceSettings,
    });
  } catch (error) {
    return res.json({
      status: "fail",
      message: "Sms Price Settings delete failure",
      error: error.message,
    });
  }
}

module.exports = {
  getAllSmsPriceSettings,
  getSmsPriceSettings,
  createSmsPriceSettings,
  updateSmsPriceSettings,
  deleteSmsPriceSettings,
};
