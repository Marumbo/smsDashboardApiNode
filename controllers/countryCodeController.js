const CountryCode = require("../models/countryCode");

const getAllCountryCodes = (req, res) => {
  CountryCode.find()
    .then((result) => {
      console.log("Returning all acceptable country codes");
      res.json({
        status: "success",
        message: "Acceptable country codes list",
        result: result,
      });
    })
    .catch((error) => {
      console.log(err);
      res.json({
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

  const countyCodeCheck = CountryCode.find({
    country_code: countryCodeData.country_code,
  });

  console.log(countyCodeCheck);

  if (countyCodeCheck) {
    res.json({
      status: "fail",
      message: "country code already exists",
    });
  }
  res.json({
    status: "success",
    message: "country code doesnt exists",
  });

  const countryCodeEntry = new CountryCode({
    ...countryCodeData,
  });

  countryCodeEntry
    .save()
    .then((result) => {
      console.log("saving country code");
      console.log(result);

      res.json({
        status: "success",
        message: "country code saved",
        result: result,
      });
    })
    .catch((error) => {
      console.log("error saving country code");
      console.log(error);
      res.json({
        status: "fail",
        message: "country code save failure",
        error: error.message,
      });
    });
}

async function getCountryCode(req, res) {
  const id = req.params.id;

  try {
    const countryCode = await CountryCode.findById(id);
    if (!countryCode) {
      res.json({
        status: "fail",
        message: "country code not found",
      });
    }
    res.json({
      status: "success",
      message: "country code found",
      result: countryCode,
    });
  } catch (error) {
    res.json({
      status: "fail",
      message: "country code find failure",
      error: error.message,
    });
  }
}

async function updateCountryCode(req, res) {
  const id = req.params.id;
  const countryCodeData = req.body;

  const countryCodeFind = await CountryCode.findById(id);
  if (!countryCodeFind) {
    res.json({
      status: "fail",
      message: "Country Code does not exist.",
    });
  }

  try {
    const updatedCountryCode = await CountryCode.findByIdAndUpdate(
      id,
      countryCodeData,
      {
        new: true,
      }
    );

    res.json({
      status: "success",
      message: "CountryCode updated",
      result: updatedCountryCode,
    });
  } catch (error) {
    res.json({
      status: "fail",
      message: "CountryCode update failure",
      error: error.message,
    });
  }
}

async function deleteCountryCode(req, res) {
  //TODO: a check for id check if less than desired number or string?
  const id = req.params.id;
  const countryCode = await CountryCode.findById(id);

  if (!countryCode) {
    res.json({
      status: "fail",
      message: "CountryCode does not exist",
    });
  }
  try {
    const deletedCountryCode = await CountryCode.deleteOne({ _id: id });

    res.json({
      status: "success",
      message: "CountryCode deleted",
      result: deletedCountryCode,
    });
  } catch (error) {
    res.json({
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
