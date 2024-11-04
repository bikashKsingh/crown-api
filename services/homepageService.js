const homepageModel = require("../database/models/homepageModel");
const { serviceResponse, carouselMessage } = require("../constants/message");
const dbHelper = require("../helpers/dbHelper");
const _ = require("lodash");
const logFile = require("../helpers/logFile");

// create
module.exports.create = async (serviceData) => {
  const response = _.cloneDeep(serviceResponse);
  try {
    // Check data is already exist or not
    const existingData = await homepageModel.findOne();

    // already exists
    if (existingData) {
      const result = await homepageModel.findOneAndUpdate(existingData._id);
      if (result) {
        response.body = dbHelper.formatMongoData(result);
        response.isOkay = true;
        response.message = carouselMessage.UPDATED;
      } else {
        response.message = carouselMessage.NOT_UPDATED;
        response.errors.error = carouselMessage.NOT_UPDATED;
      }
    } else {
      const newData = new homepageModel(serviceData);
      const result = await newData.save();

      if (result) {
        response.body = dbHelper.formatMongoData(result);
        response.isOkay = true;
        response.message = carouselMessage.CREATED;
      } else {
        response.message = carouselMessage.NOT_CREATED;
        response.errors.error = carouselMessage.NOT_CREATED;
      }
    }
  } catch (error) {
    logFile.write(`Service : homepageService: create, Error : ${error}`);
    throw new Error(error.message);
  }
  return response;
};

// findOne
module.exports.findOne = async (serviceData) => {
  const response = _.cloneDeep(serviceResponse);
  try {
    const result = await homepageModel.findOne();
    if (result) {
      response.body = dbHelper.formatMongoData(result);
      response.message = carouselMessage.FETCHED;
      response.isOkay = true;
    } else {
      response.errors.error = carouselMessage.NOT_AVAILABLE;
      response.message = carouselMessage.NOT_AVAILABLE;
    }
    return response;
  } catch (error) {
    logFile.write(`Service : homepageService: findOne, Error : ${error}`);
    throw new Error(error);
  }
};

// delete
module.exports.delete = async (serviceData) => {
  const response = _.cloneDeep(serviceResponse);
  try {
    const result = await homepageModel.deleteMany();

    if (result) {
      response.message = carouselMessage.DELETED;
      response.isOkay = true;
    } else {
      response.message = carouselMessage.NOT_DELETED;
      response.errors.id = carouselMessage.INVALID_ID;
    }
  } catch (error) {
    logFile.write(`Service : homepageService: delete, Error : ${error}`);
    throw new Error(error);
  }

  return response;
};
