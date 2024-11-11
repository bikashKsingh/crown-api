const typeModel = require("../database/models/typeModel");
const { serviceResponse, typeMessage } = require("../constants/message");
const dbHelper = require("../helpers/dbHelper");
const _ = require("lodash");
const logFile = require("../helpers/logFile");

// create
module.exports.create = async (serviceData) => {
  const response = _.cloneDeep(serviceResponse);
  try {
    // Check title is already exist or not
    const isExist = await typeModel.findOne({
      title: serviceData.title,
    });

    // already exists
    if (isExist) {
      response.errors = {
        title: typeMessage.ALREADY_EXISTS,
      };
      response.message = typeMessage.ALREADY_EXISTS;
      return response;
    }

    const newData = new typeModel(serviceData);
    const result = await newData.save();

    if (result) {
      response.body = dbHelper.formatMongoData(result);
      response.isOkay = true;
      response.message = typeMessage.CREATED;
    } else {
      response.message = typeMessage.NOT_CREATED;
      response.errors.error = typeMessage.NOT_CREATED;
    }
  } catch (error) {
    logFile.write(`Service : typeService: create, Error : ${error}`);
    throw new Error(error.message);
  }
  return response;
};

// findById
module.exports.findById = async (serviceData) => {
  const response = _.cloneDeep(serviceResponse);
  try {
    const result = await typeModel.findById({
      _id: serviceData.id,
    });
    if (result) {
      response.body = dbHelper.formatMongoData(result);
      response.message = typeMessage.FETCHED;
      response.isOkay = true;
    } else {
      response.errors.id = typeMessage.NOT_AVAILABLE;
      response.message = typeMessage.NOT_AVAILABLE;
    }
    return response;
  } catch (error) {
    logFile.write(`Service : typeService: findById, Error : ${error}`);
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
    const totalRecords = await typeModel.countDocuments(conditions);
    // Calculate the total number of pages
    const totalPages = Math.ceil(totalRecords / parseInt(limit));

    const result = await typeModel
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
      response.message = typeMessage.FETCHED;
    } else {
      response.message = typeMessage.NOT_FETCHED;
    }
  } catch (error) {
    logFile.write(`Service : typeService: findAll, Error : ${error}`);

    throw new Error(error);
  }

  return response;
};

// update
module.exports.update = async (serviceData) => {
  const response = _.cloneDeep(serviceResponse);
  try {
    const { id, body } = serviceData;

    const result = await typeModel.findByIdAndUpdate(id, body, {
      new: true,
    });

    if (result) {
      response.body = dbHelper.formatMongoData(result);
      response.message = typeMessage.UPDATED;
      response.isOkay = true;
    } else {
      response.message = typeMessage.NOT_UPDATED;
      response.errors.id = typeMessage.INVALID_ID;
    }
  } catch (error) {
    logFile.write(`Service : typeService: update, Error : ${error}`);
    throw new Error(error);
  }
  return response;
};

// delete
module.exports.delete = async (serviceData) => {
  const response = _.cloneDeep(serviceResponse);
  try {
    const { id } = serviceData;
    // const result = await typeModel.findByIdAndUpdate(id, {
    //   isDeleted: true,
    //   status: false,
    // });

    const result = await typeModel.findByIdAndDelete(id, {
      new: true,
    });

    if (result) {
      response.message = typeMessage.DELETED;
      response.isOkay = true;
    } else {
      response.message = typeMessage.NOT_DELETED;
      response.errors.id = typeMessage.INVALID_ID;
    }
  } catch (error) {
    logFile.write(`Service : typeService: delete, Error : ${error}`);
    throw new Error(error);
  }

  return response;
};

// deleteMultiple
module.exports.deleteMultiple = async (serviceData) => {
  const response = _.cloneDeep(serviceResponse);
  try {
    // const result = await typeModel.findByIdAndUpdate(id, {
    //   isDeleted: true,
    //   status: false,
    // });

    // console.log(serviceData);

    const result = await typeModel.deleteMany({
      _id: { $in: serviceData.ids },
    });

    if (result) {
      response.message = `${result.deletedCount} ${typeMessage.DELETED}`;
      response.isOkay = true;
    } else {
      response.message = typeMessage.NOT_DELETED;
      response.errors.id = typeMessage.INVALID_ID;
    }
  } catch (error) {
    logFile.write(`Service : typeService: deleteMultiple, Error : ${error}`);
    throw new Error(error);
  }

  return response;
};
