const programRequirementModel = require("../database/models/programRequirementModel");
const {
  serviceResponse,
  programRequirementMessage,
} = require("../constants/message");
const dbHelper = require("../helpers/dbHelper");
const _ = require("lodash");
const logFile = require("../helpers/logFile");

// create
module.exports.create = async (serviceData) => {
  const response = _.cloneDeep(serviceResponse);
  try {
    // Check title is already exist or not
    const isExist = await programRequirementModel.findOne({
      title: serviceData.title,
    });

    // already exists
    if (isExist) {
      response.errors = {
        title: programRequirementMessage.ALREADY_EXISTS,
      };
      response.message = programRequirementMessage.ALREADY_EXISTS;
      return response;
    }

    const newData = new programRequirementModel(serviceData);
    const result = await newData.save();

    if (result) {
      response.body = dbHelper.formatMongoData(result);
      response.isOkay = true;
      response.message = programRequirementMessage.CREATED;
    } else {
      response.message = programRequirementMessage.NOT_CREATED;
      response.errors.error = programRequirementMessage.NOT_CREATED;
    }
  } catch (error) {
    logFile.write(
      `Service : programRequirementService: create, Error : ${error}`
    );
    throw new Error(error.message);
  }
  return response;
};

// findById
module.exports.findById = async (serviceData) => {
  const response = _.cloneDeep(serviceResponse);
  try {
    const result = await programRequirementModel.findById({
      _id: serviceData.id,
    });
    if (result) {
      response.body = dbHelper.formatMongoData(result);
      response.message = programRequirementMessage.FETCHED;
      response.isOkay = true;
    } else {
      response.errors.id = programRequirementMessage.NOT_AVAILABLE;
      response.message = programRequirementMessage.NOT_AVAILABLE;
    }
    return response;
  } catch (error) {
    logFile.write(
      `Service : programRequirementService: findById, Error : ${error}`
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
    const totalRecords = await programRequirementModel.countDocuments(
      conditions
    );
    // Calculate the total number of pages
    const totalPages = Math.ceil(totalRecords / parseInt(limit));

    const result = await programRequirementModel
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
      response.message = programRequirementMessage.FETCHED;
    } else {
      response.message = programRequirementMessage.NOT_FETCHED;
    }
  } catch (error) {
    logFile.write(
      `Service : programRequirementService: findAll, Error : ${error}`
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

    const result = await programRequirementModel.findByIdAndUpdate(id, body, {
      new: true,
    });

    if (result) {
      response.body = dbHelper.formatMongoData(result);
      response.message = programRequirementMessage.UPDATED;
      response.isOkay = true;
    } else {
      response.message = programRequirementMessage.NOT_UPDATED;
      response.errors.id = programRequirementMessage.INVALID_ID;
    }
  } catch (error) {
    logFile.write(
      `Service : programRequirementService: update, Error : ${error}`
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
    // const result = await programRequirementModel.findByIdAndUpdate(id, {
    //   isDeleted: true,
    //   status: false,
    // });

    const result = await programRequirementModel.findByIdAndDelete(id, {
      new: true,
    });

    if (result) {
      response.message = programRequirementMessage.DELETED;
      response.isOkay = true;
    } else {
      response.message = programRequirementMessage.NOT_DELETED;
      response.errors.id = programRequirementMessage.INVALID_ID;
    }
  } catch (error) {
    logFile.write(
      `Service : programRequirementService: delete, Error : ${error}`
    );
    throw new Error(error);
  }

  return response;
};

// deleteMultiple
module.exports.deleteMultiple = async (serviceData) => {
  const response = _.cloneDeep(serviceResponse);
  try {
    // const result = await programRequirementModel.findByIdAndUpdate(id, {
    //   isDeleted: true,
    //   status: false,
    // });

    // console.log(serviceData);

    const result = await programRequirementModel.deleteMany({
      _id: { $in: serviceData.ids },
    });

    if (result) {
      response.message = `${result.deletedCount} ${programRequirementMessage.DELETED}`;
      response.isOkay = true;
    } else {
      response.message = programRequirementMessage.NOT_DELETED;
      response.errors.id = programRequirementMessage.INVALID_ID;
    }
  } catch (error) {
    logFile.write(
      `Service : programRequirementService: deleteMultiple, Error : ${error}`
    );
    throw new Error(error);
  }

  return response;
};
