const CountryCode = require("../models/countryCode");

const getAllCountryCodes = (req, res) => {
  CountryCode.find()
    .then((result) => {
      console.log("Returning all acceptable country codes");
      return res.json({
        status: "success",
        message: "Acceptable country codes list",
        result: result,
      });
    })
    .catch((error) => {
      console.log(err);
      return res.json({
        status: "fail",
        message: "Country code list failure",
        error: error.message,
      });
    });
};

async function createCountryCode(req, res) {
  const countryCodeData = req.body;
  console.log("Country code data ", countryCodeData);
  //check if data is not empty

  const countyCodeCheck = await CountryCode.find({
    country_code: countryCodeData.country_code,
  });

  if (countyCodeCheck.length) {
    return res.json({
      status: "fail",
      message: "country code already exists",
    });
  }

  const countryCodeEntry = new CountryCode({
    ...countryCodeData,
  });
  try {
    await countryCodeEntry.save().then((result) => {
      console.log("saving country code");
      console.log(result);

      return res.json({
        status: "success",
        message: "country code saved",
        result: result,
      });
    });
  } catch (error) {
    console.log("error saving country code");
    console.log(error);
    return res.json({
      status: "fail",
      message: "country code save failure",
      error: error.message,
    });
  }
}

async function getCountryCode(req, res) {
  const id = req.params.id;

  try {
    const countryCode = await CountryCode.findById(id);
    if (!countryCode) {
      return res.json({
        status: "fail",
        message: "country code not found",
      });
    }
    return res.json({
      status: "success",
      message: "country code found",
      result: countryCode,
    });
  } catch (error) {
    return res.json({
      status: "fail",
      message: "country code find failure",
      error: error.message,
    });
  }
}

async function updateCountryCode(req, res) {
  const id = req.params.id;
  const countryCodeData = req.body;

  try {
    const countryCodeFind = await CountryCode.findById(id);
    if (!countryCodeFind) {
      return res.json({
        status: "fail",
        message: "Country Code does not exist.",
      });
    }

    const updatedCountryCode = await CountryCode.findByIdAndUpdate(
      id,
      countryCodeData,
      {
        new: true,
      }
    );

    return res.json({
      status: "success",
      message: "CountryCode updated",
      result: updatedCountryCode,
    });
  } catch (error) {
    return res.json({
      status: "fail",
      message: "CountryCode update failure",
      error: error.message,
    });
  }
}

async function deleteCountryCode(req, res) {
  //TODO: a check for id check if less than desired number or string?
  const id = req.params.id;
  try {
    const countryCode = await CountryCode.findById(id);

    if (!countryCode) {
      return res.json({
        status: "fail",
        message: "CountryCode does not exist",
      });
    }

    const deletedCountryCode = await CountryCode.deleteOne({ _id: id });

    return res.json({
      status: "success",
      message: "CountryCode deleted",
      result: deletedCountryCode,
    });
  } catch (error) {
    return res.json({
      status: "fail",
      message: "CountryCode delete failure",
      error: error.message,
    });
  }
}

module.exports = {
  getAllCountryCodes,
  getCountryCode,
  createCountryCode,
  updateCountryCode,
  deleteCountryCode,
};
