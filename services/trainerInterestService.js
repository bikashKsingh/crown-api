const trainerInterestsModel = require("../database/models/trainerInterestsModel");
const {
  serviceResponse,
  trainerInterestMessage,
} = require("../constants/message");
const dbHelper = require("../helpers/dbHelper");
const _ = require("lodash");
const logFile = require("../helpers/logFile");

// create
module.exports.create = async (serviceData) => {
  const response = _.cloneDeep(serviceResponse);
  try {
    // Check title is already exist or not
    const isExist = await trainerInterestsModel.findOne({
      title: serviceData.title,
    });

    // already exists
    if (isExist) {
      response.errors = {
        title: trainerInterestMessage.ALREADY_EXISTS,
      };
      response.message = trainerInterestMessage.ALREADY_EXISTS;
      return response;
    }

    const newData = new trainerInterestsModel(serviceData);
    const result = await newData.save();

    if (result) {
      response.body = dbHelper.formatMongoData(result);
      response.isOkay = true;
      response.message = trainerInterestMessage.CREATED;
    } else {
      response.message = trainerInterestMessage.NOT_CREATED;
      response.errors.error = trainerInterestMessage.NOT_CREATED;
    }
  } catch (error) {
    logFile.write(`Service : trainerInterestService: create, Error : ${error}`);
    throw new Error(error.message);
  }
  return response;
};

// findById
module.exports.findById = async (serviceData) => {
  const response = _.cloneDeep(serviceResponse);
  try {
    const result = await trainerInterestsModel.findById({
      _id: serviceData.id,
    });
    if (result) {
      response.body = dbHelper.formatMongoData(result);
      response.message = trainerInterestMessage.FETCHED;
      response.isOkay = true;
    } else {
      response.errors.id = trainerInterestMessage.NOT_AVAILABLE;
      response.message = trainerInterestMessage.NOT_AVAILABLE;
    }
    return response;
  } catch (error) {
    logFile.write(
      `Service : trainerInterestService: findById, Error : ${error}`
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
    const totalRecords = await trainerInterestsModel.countDocuments(conditions);
    // Calculate the total number of pages
    const totalPages = Math.ceil(totalRecords / parseInt(limit));

    const result = await trainerInterestsModel
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
      response.message = trainerInterestMessage.FETCHED;
    } else {
      response.message = trainerInterestMessage.NOT_FETCHED;
    }
  } catch (error) {
    logFile.write(
      `Service : trainerInterestService: findAll, Error : ${error}`
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

    const result = await trainerInterestsModel.findByIdAndUpdate(id, body, {
      new: true,
    });

    if (result) {
      response.body = dbHelper.formatMongoData(result);
      response.message = trainerInterestMessage.UPDATED;
      response.isOkay = true;
    } else {
      response.message = trainerInterestMessage.NOT_UPDATED;
      response.errors.id = trainerInterestMessage.INVALID_ID;
    }
  } catch (error) {
    logFile.write(`Service : trainerInterestService: update, Error : ${error}`);
    throw new Error(error);
  }
  return response;
};

// delete
module.exports.delete = async (serviceData) => {
  const response = _.cloneDeep(serviceResponse);
  try {
    const { id } = serviceData;
    // const result = await trainerInterestsModel.findByIdAndUpdate(id, {
    //   isDeleted: true,
    //   status: false,
    // });

    const result = await trainerInterestsModel.findByIdAndDelete(id, {
      new: true,
    });

    if (result) {
      response.message = trainerInterestMessage.DELETED;
      response.isOkay = true;
    } else {
      response.message = trainerInterestMessage.NOT_DELETED;
      response.errors.id = trainerInterestMessage.INVALID_ID;
    }
  } catch (error) {
    logFile.write(`Service : trainerInterestService: delete, Error : ${error}`);
    throw new Error(error);
  }

  return response;
};

// deleteMultiple
module.exports.deleteMultiple = async (serviceData) => {
  const response = _.cloneDeep(serviceResponse);
  try {
    // const result = await trainerInterestsModel.findByIdAndUpdate(id, {
    //   isDeleted: true,
    //   status: false,
    // });

    // console.log(serviceData);

    const result = await trainerInterestsModel.deleteMany({
      _id: { $in: serviceData.ids },
    });

    if (result) {
      response.message = `${result.deletedCount} ${trainerInterestMessage.DELETED}`;
      response.isOkay = true;
    } else {
      response.message = trainerInterestMessage.NOT_DELETED;
      response.errors.id = trainerInterestMessage.INVALID_ID;
    }
  } catch (error) {
    logFile.write(
      `Service : trainerInterestService: deleteMultiple, Error : ${error}`
    );
    throw new Error(error);
  }

  return response;
};
