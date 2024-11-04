const trainerSpecialityModel = require("../database/models/trainerSpecialityModel");
const {
  serviceResponse,
  trainerSpecialityMessage,
} = require("../constants/message");
const dbHelper = require("../helpers/dbHelper");
const _ = require("lodash");
const logFile = require("../helpers/logFile");

// create
module.exports.create = async (serviceData) => {
  const response = _.cloneDeep(serviceResponse);
  try {
    // Check title is already exist or not
    const isExist = await trainerSpecialityModel.findOne({
      title: serviceData.title,
    });

    // already exists
    if (isExist) {
      response.errors = {
        title: trainerSpecialityMessage.ALREADY_EXISTS,
      };
      response.message = trainerSpecialityMessage.ALREADY_EXISTS;
      return response;
    }

    const newData = new trainerSpecialityModel(serviceData);
    const result = await newData.save();

    if (result) {
      response.body = dbHelper.formatMongoData(result);
      response.isOkay = true;
      response.message = trainerSpecialityMessage.CREATED;
    } else {
      response.message = trainerSpecialityMessage.NOT_CREATED;
      response.errors.error = trainerSpecialityMessage.NOT_CREATED;
    }
  } catch (error) {
    logFile.write(
      `Service : trainerSpecialityService: create, Error : ${error}`
    );
    throw new Error(error.message);
  }
  return response;
};

// findById
module.exports.findById = async (serviceData) => {
  const response = _.cloneDeep(serviceResponse);
  try {
    const result = await trainerSpecialityModel.findById({
      _id: serviceData.id,
    });
    if (result) {
      response.body = dbHelper.formatMongoData(result);
      response.message = trainerSpecialityMessage.FETCHED;
      response.isOkay = true;
    } else {
      response.errors.id = trainerSpecialityMessage.NOT_AVAILABLE;
      response.message = trainerSpecialityMessage.NOT_AVAILABLE;
    }
    return response;
  } catch (error) {
    logFile.write(
      `Service : trainerSpecialityService: findById, Error : ${error}`
    );
    throw new Error(error);
  }
};

// findAll
module.exports.findAll = async (serviceData) => {
  const response = _.cloneDeep(serviceResponse);
  try {
    let conditions = {};
    const {
      limit = 10,
      page = 1,
      searchQuery,
      status = "ALL",
      isDeleted = false,
    } = serviceData;

    // SearchQuery
    if (searchQuery) {
      conditions = {
        $or: [{ title: { $regex: searchQuery, $options: "i" } }],
      };
    }

    // status
    if (status == "ALL") {
      delete conditions.status;
    } else {
      conditions.status = status;
    }

    // DeletedAccount
    conditions.isDeleted = isDeleted;

    // count record
    const totalRecords = await trainerSpecialityModel.countDocuments(
      conditions
    );
    // Calculate the total number of pages
    const totalPages = Math.ceil(totalRecords / parseInt(limit));

    const result = await trainerSpecialityModel
      .find(conditions)
      .skip((parseInt(page) - 1) * parseInt(limit))
      .sort({ updatedAt: -1 })
      .limit(parseInt(limit));

    if (result) {
      response.body = dbHelper.formatMongoData(result);
      response.isOkay = true;
      response.page = parseInt(page);
      response.totalPages = totalPages;
      response.totalRecords = totalRecords;
      response.message = trainerSpecialityMessage.FETCHED;
    } else {
      response.message = trainerSpecialityMessage.NOT_FETCHED;
    }
  } catch (error) {
    logFile.write(
      `Service : trainerSpecialityService: findAll, Error : ${error}`
    );

    throw new Error(error);
  }

  return response;
};

// update
module.exports.update = async (serviceData) => {
  const response = _.cloneDeep(serviceResponse);
  try {
    const { id, body } = serviceData;

    const result = await trainerSpecialityModel.findByIdAndUpdate(id, body, {
      new: true,
    });

    if (result) {
      response.body = dbHelper.formatMongoData(result);
      response.message = trainerSpecialityMessage.UPDATED;
      response.isOkay = true;
    } else {
      response.message = trainerSpecialityMessage.NOT_UPDATED;
      response.errors.id = trainerSpecialityMessage.INVALID_ID;
    }
  } catch (error) {
    logFile.write(
      `Service : trainerSpecialityService: update, Error : ${error}`
    );
    throw new Error(error);
  }
  return response;
};

// delete
module.exports.delete = async (serviceData) => {
  const response = _.cloneDeep(serviceResponse);
  try {
    const { id } = serviceData;
    // const result = await trainerSpecialityModel.findByIdAndUpdate(id, {
    //   isDeleted: true,
    //   status: false,
    // });

    const result = await trainerSpecialityModel.findByIdAndDelete(id, {
      new: true,
    });

    if (result) {
      response.message = trainerSpecialityMessage.DELETED;
      response.isOkay = true;
    } else {
      response.message = trainerSpecialityMessage.NOT_DELETED;
      response.errors.id = trainerSpecialityMessage.INVALID_ID;
    }
  } catch (error) {
    logFile.write(
      `Service : trainerSpecialityService: delete, Error : ${error}`
    );
    throw new Error(error);
  }

  return response;
};

// deleteMultiple
module.exports.deleteMultiple = async (serviceData) => {
  const response = _.cloneDeep(serviceResponse);
  try {
    // const result = await trainerSpecialityModel.findByIdAndUpdate(id, {
    //   isDeleted: true,
    //   status: false,
    // });

    // console.log(serviceData);

    const result = await trainerSpecialityModel.deleteMany({
      _id: { $in: serviceData.ids },
    });

    if (result) {
      response.message = `${result.deletedCount} ${trainerSpecialityMessage.DELETED}`;
      response.isOkay = true;
    } else {
      response.message = trainerSpecialityMessage.NOT_DELETED;
      response.errors.id = trainerSpecialityMessage.INVALID_ID;
    }
  } catch (error) {
    logFile.write(
      `Service : trainerSpecialityService: deleteMultiple, Error : ${error}`
    );
    throw new Error(error);
  }

  return response;
};
