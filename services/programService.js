const programModel = require("../database/models/programModel");
const { serviceResponse, programMessage } = require("../constants/message");
const dbHelper = require("../helpers/dbHelper");
const _ = require("lodash");
const logFile = require("../helpers/logFile");

// create
module.exports.create = async (serviceData) => {
  const response = _.cloneDeep(serviceResponse);
  try {
    // Check program is already exist or not
    const isExist = await programModel.findOne({
      $or: [{ name: serviceData.name }, { slug: serviceData.slug }],
    });

    // already exists
    if (isExist) {
      response.errors = {
        name: programMessage.ALREADY_EXISTS,
      };
      response.message = programMessage.ALREADY_EXISTS;
      return response;
    }

    const newData = new programModel(serviceData);
    const result = await newData.save();

    if (result) {
      response.body = dbHelper.formatMongoData(result);
      response.isOkay = true;
      response.message = programMessage.CREATED;
    } else {
      response.message = programMessage.NOT_CREATED;
      response.errors.error = programMessage.NOT_CREATED;
    }
  } catch (error) {
    logFile.write(`Service : programService: create, Error : ${error}`);
    throw new Error(error.message);
  }
  return response;
};

// findById
module.exports.findById = async (serviceData) => {
  const response = _.cloneDeep(serviceResponse);
  try {
    const result = await programModel
      .findById({ _id: serviceData.id })
      .populate({ path: "category" })
      .populate({ path: "requirements" });
    if (result) {
      response.body = dbHelper.formatMongoData(result);
      response.message = programMessage.FETCHED;
      response.isOkay = true;
    } else {
      response.errors.error = programMessage.NOT_AVAILABLE;
      response.message = programMessage.NOT_AVAILABLE;
    }
    return response;
  } catch (error) {
    logFile.write(`Service : programService: findById, Error : ${error}`);
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
      status = true,
      isDeleted = false,
    } = serviceData;

    // SearchQuery
    if (searchQuery) {
      conditions = {
        $or: [
          { name: { $regex: searchQuery, $options: "i" } },
          { slug: { $regex: searchQuery, $options: "i" } },
        ],
      };
    }

    // Status
    if (status == "All") {
      delete conditions.status;
    } else {
      conditions.status = status;
    }

    // DeletedAccount
    conditions.isDeleted = isDeleted;

    // count record
    const totalRecords = await programModel.countDocuments(conditions);
    // Calculate the total number of pages
    const totalPages = Math.ceil(totalRecords / parseInt(limit));

    const result = await programModel
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
      response.message = programMessage.FETCHED;
    } else {
      response.message = programMessage.NOT_FETCHED;
    }
  } catch (error) {
    logFile.write(`Service : programService: findAll, Error : ${error}`);

    throw new Error(error);
  }

  return response;
};

// update
module.exports.update = async (serviceData) => {
  const response = _.cloneDeep(serviceResponse);
  try {
    const { id, body } = serviceData;

    const result = await programModel.findByIdAndUpdate(id, body, {
      new: true,
    });

    if (result) {
      response.body = dbHelper.formatMongoData(result);
      response.message = programMessage.UPDATED;
      response.isOkay = true;
    } else {
      response.message = programMessage.NOT_UPDATED;
      response.errors.id = programMessage.INVALID_ID;
    }
  } catch (error) {
    logFile.write(`Service : programService: update, Error : ${error}`);
    throw new Error(error);
  }
  return response;
};

// delete
module.exports.delete = async (serviceData) => {
  const response = _.cloneDeep(serviceResponse);
  try {
    const { id } = serviceData;
    // const result = await programModel.findByIdAndUpdate(id, {
    //   isDeleted: true,
    //   status: false,
    // });

    const result = await programModel.findByIdAndDelete(id, {
      new: true,
    });

    if (result) {
      response.message = programMessage.DELETED;
      response.isOkay = true;
    } else {
      response.message = programMessage.NOT_DELETED;
      response.errors.id = programMessage.INVALID_ID;
    }
  } catch (error) {
    logFile.write(`Service : programService: delete, Error : ${error}`);
    throw new Error(error);
  }

  return response;
};

// deleteMultiple
module.exports.deleteMultiple = async (serviceData) => {
  const response = _.cloneDeep(serviceResponse);
  try {
    // const result = await programModel.findByIdAndUpdate(id, {
    //   isDeleted: true,
    //   status: false,
    // });

    // console.log(serviceData);

    const result = await programModel.deleteMany({
      _id: { $in: serviceData.ids },
    });

    if (result) {
      response.message = `${result.deletedCount} ${programMessage.DELETED}`;
      response.isOkay = true;
    } else {
      response.message = programMessage.NOT_DELETED;
      response.errors.id = programMessage.INVALID_ID;
    }
  } catch (error) {
    logFile.write(`Service : programService: deleteMultiple, Error : ${error}`);
    throw new Error(error);
  }

  return response;
};
