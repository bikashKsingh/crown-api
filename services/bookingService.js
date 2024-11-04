const bookingModel = require("../database/models/bookingModel");
const { serviceResponse, bookingMessage } = require("../constants/message");
const dbHelper = require("../helpers/dbHelper");
const _ = require("lodash");
const logFile = require("../helpers/logFile");
const programPlanModel = require("../database/models/programPlanModel");

// create
module.exports.create = async (serviceData) => {
  const response = _.cloneDeep(serviceResponse);
  try {
    // find some details
    const programPlanDetails = await programPlanModel.findOne({
      _id: serviceData.programPlan,
    });

    serviceData.program = programPlanDetails.program;
    serviceData.plan = programPlanDetails.plan;

    const newData = new bookingModel(serviceData);
    const result = await newData.save();

    if (result) {
      response.body = dbHelper.formatMongoData(result);
      response.isOkay = true;
      response.message = bookingMessage.BOOKED;
    } else {
      response.message = bookingMessage.NOT_BOOKED;
      response.errors.error = bookingMessage.NOT_BOOKED;
    }
  } catch (error) {
    logFile.write(`Service : bookingService: create, Error : ${error}`);
    throw new Error(error.message);
  }
  return response;
};

// findById
module.exports.findById = async (serviceData) => {
  const response = _.cloneDeep(serviceResponse);
  try {
    const result = await bookingModel
      .findById({ _id: serviceData.id })
      .populate({ path: "program" })
      .populate({ path: "plan" })
      .populate({ path: "programPlan" })
      .populate({ path: "category" })
      .populate({ path: "user" });
    if (result) {
      response.body = dbHelper.formatMongoData(result);
      response.message = bookingMessage.FETCHED;
      response.isOkay = true;
    } else {
      response.errors.error = bookingMessage.NOT_AVAILABLE;
      response.message = bookingMessage.NOT_AVAILABLE;
    }
    return response;
  } catch (error) {
    logFile.write(`Service : bookingService: findById, Error : ${error}`);
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
      program,
      status = true,
      isDeleted = false,
    } = serviceData;

    // SearchQuery
    // if (searchQuery) {
    //   conditions = {
    //     $or: [
    //       { title: { $regex: searchQuery, $options: "i" } },
    //       { slug: { $regex: searchQuery, $options: "i" } },
    //     ],
    //   };
    // }

    // Status
    if (status == "All") {
      delete conditions.status;
    } else {
      conditions.status = status;
    }

    if (program) conditions.program = program;

    // DeletedAccount
    conditions.isDeleted = isDeleted;

    // count record
    const totalRecords = await bookingModel.countDocuments(conditions);
    // Calculate the total number of pages
    const totalPages = Math.ceil(totalRecords / parseInt(limit));

    const result = await bookingModel
      .find(conditions)
      .populate({ path: "program" })
      .populate({ path: "plan" })
      .populate({ path: "programPlan" })
      .populate({ path: "category" })
      .populate({ path: "user" })
      .skip((parseInt(page) - 1) * parseInt(limit))
      .sort({ updatedAt: -1 })
      .limit(parseInt(limit));

    if (result) {
      response.body = dbHelper.formatMongoData(result);
      response.isOkay = true;
      response.page = parseInt(page);
      response.totalPages = totalPages;
      response.totalRecords = totalRecords;
      response.message = bookingMessage.FETCHED;
    } else {
      response.message = bookingMessage.NOT_FETCHED;
    }
  } catch (error) {
    logFile.write(`Service : bookingService: findAll, Error : ${error}`);

    throw new Error(error);
  }

  return response;
};

// update
module.exports.update = async (serviceData) => {
  const response = _.cloneDeep(serviceResponse);
  try {
    const { id, body } = serviceData;

    const result = await bookingModel.findByIdAndUpdate(id, body, {
      new: true,
    });

    if (result) {
      response.body = dbHelper.formatMongoData(result);
      response.message = bookingMessage.UPDATED;
      response.isOkay = true;
    } else {
      response.message = bookingMessage.NOT_UPDATED;
      response.errors.id = bookingMessage.INVALID_ID;
    }
  } catch (error) {
    logFile.write(`Service : bookingService: update, Error : ${error}`);
    throw new Error(error);
  }
  return response;
};

// delete
module.exports.delete = async (serviceData) => {
  const response = _.cloneDeep(serviceResponse);
  try {
    const { id } = serviceData;
    // const result = await bookingModel.findByIdAndUpdate(id, {
    //   isDeleted: true,
    //   status: false,
    // });

    const result = await bookingModel.findByIdAndDelete(id, {
      new: true,
    });

    if (result) {
      response.message = bookingMessage.DELETED;
      response.isOkay = true;
    } else {
      response.message = bookingMessage.NOT_DELETED;
      response.errors.id = bookingMessage.INVALID_ID;
    }
  } catch (error) {
    logFile.write(`Service : bookingService: delete, Error : ${error}`);
    throw new Error(error);
  }

  return response;
};

// deleteMultiple
module.exports.deleteMultiple = async (serviceData) => {
  const response = _.cloneDeep(serviceResponse);
  try {
    // const result = await bookingModel.findByIdAndUpdate(id, {
    //   isDeleted: true,
    //   status: false,
    // });

    // console.log(serviceData);

    const result = await bookingModel.deleteMany({
      _id: { $in: serviceData.ids },
    });

    if (result) {
      response.message = `${result.deletedCount} ${bookingMessage.DELETED}`;
      response.isOkay = true;
    } else {
      response.message = bookingMessage.NOT_DELETED;
      response.errors.id = bookingMessage.INVALID_ID;
    }
  } catch (error) {
    logFile.write(`Service : bookingService: deleteMultiple, Error : ${error}`);
    throw new Error(error);
  }

  return response;
};
