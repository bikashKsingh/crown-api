const certificateModel = require("../database/models/certificateModel");
const { serviceResponse, certificateMessage } = require("../constants/message");
const dbHelper = require("../helpers/dbHelper");
const _ = require("lodash");
const logFile = require("../helpers/logFile");

// create
module.exports.create = async (serviceData) => {
  const response = _.cloneDeep(serviceResponse);
  try {
    // Check name is already exist or not
    const isExist = await certificateModel.findOne({
      name: serviceData.name,
    });

    // already exists
    if (isExist) {
      response.errors = {
        name: certificateMessage.ALREADY_EXISTS,
      };
      response.message = certificateMessage.ALREADY_EXISTS;
      return response;
    }

    const newData = new certificateModel(serviceData);
    const result = await newData.save();

    if (result) {
      response.body = dbHelper.formatMongoData(result);
      response.isOkay = true;
      response.message = certificateMessage.CREATED;
    } else {
      response.message = certificateMessage.NOT_CREATED;
      response.errors.error = certificateMessage.NOT_CREATED;
    }
  } catch (error) {
    logFile.write(`Service : certificateService: create, Error : ${error}`);
    throw new Error(error.message);
  }
  return response;
};

// findById
module.exports.findById = async (serviceData) => {
  const response = _.cloneDeep(serviceResponse);
  try {
    const result = await certificateModel.findById({ _id: serviceData.id });
    if (result) {
      response.body = dbHelper.formatMongoData(result);
      response.message = certificateMessage.FETCHED;
      response.isOkay = true;
    } else {
      response.errors.error = certificateMessage.NOT_AVAILABLE;
      response.message = certificateMessage.NOT_AVAILABLE;
    }
    return response;
  } catch (error) {
    logFile.write(`Service : certificateService: findById, Error : ${error}`);
    throw new Error(error);
  }
};

// findAll
module.exports.findAll = async (serviceData) => {
  const response = _.cloneDeep(serviceResponse);
  try {
    let conditions = {};
    let sortCondition = { createdAt: -1 };
    const {
      limit = 10,
      page = 1,
      searchQuery,
      category,
      status = true,
      isDeleted = false,
      priority = "",
      slug = "",
    } = serviceData;

    // SearchQuery
    if (searchQuery) {
      conditions = {
        $or: [{ name: { $regex: searchQuery, $options: "i" } }],
      };
    }

    // Status
    if (status == "All") {
      delete conditions.status;
    } else {
      conditions.status = status;
    }

    if (category) conditions.category = category;

    // DeletedAccount
    conditions.isDeleted = isDeleted;

    if (slug) conditions.slug = slug;

    if (priority) {
      sortCondition = {
        priority: priority == "ASC" ? 1 : -1,
      };
    }

    // count record
    const totalRecords = await certificateModel.countDocuments(conditions);
    // Calculate the total number of pages
    const totalPages = Math.ceil(totalRecords / parseInt(limit));

    const result = await certificateModel
      .find(conditions)
      .skip((parseInt(page) - 1) * parseInt(limit))
      .sort(sortCondition)
      .limit(parseInt(limit));

    if (result) {
      response.body = dbHelper.formatMongoData(result);
      response.isOkay = true;
      response.page = parseInt(page);
      response.totalPages = totalPages;
      response.totalRecords = totalRecords;
      response.message = certificateMessage.FETCHED;
    } else {
      response.message = certificateMessage.NOT_FETCHED;
    }
  } catch (error) {
    logFile.write(`Service : certificateService: findAll, Error : ${error}`);

    throw new Error(error);
  }

  return response;
};

// update
module.exports.update = async (serviceData) => {
  const response = _.cloneDeep(serviceResponse);
  try {
    const { id, body } = serviceData;

    const result = await certificateModel.findByIdAndUpdate(id, body, {
      new: true,
    });

    if (result) {
      response.body = dbHelper.formatMongoData(result);
      response.message = certificateMessage.UPDATED;
      response.isOkay = true;
    } else {
      response.message = certificateMessage.NOT_UPDATED;
      response.errors.id = certificateMessage.INVALID_ID;
    }
  } catch (error) {
    logFile.write(`Service : certificateService: update, Error : ${error}`);
    throw new Error(error);
  }
  return response;
};

// delete
module.exports.delete = async (serviceData) => {
  const response = _.cloneDeep(serviceResponse);
  try {
    const { id } = serviceData;
    // const result = await certificateModel.findByIdAndUpdate(id, {
    //   isDeleted: true,
    //   status: false,
    // });

    const result = await certificateModel.findByIdAndDelete(id, {
      new: true,
    });

    if (result) {
      response.message = certificateMessage.DELETED;
      response.isOkay = true;
    } else {
      response.message = certificateMessage.NOT_DELETED;
      response.errors.id = certificateMessage.INVALID_ID;
    }
  } catch (error) {
    logFile.write(`Service : certificateService: delete, Error : ${error}`);
    throw new Error(error);
  }

  return response;
};

// deleteMultiple
module.exports.deleteMultiple = async (serviceData) => {
  const response = _.cloneDeep(serviceResponse);
  try {
    // const result = await certificateModel.findByIdAndUpdate(id, {
    //   isDeleted: true,
    //   status: false,
    // });

    // console.log(serviceData);

    const result = await certificateModel.deleteMany({
      _id: { $in: serviceData.ids },
    });

    if (result) {
      response.message = `${result.deletedCount} ${certificateMessage.DELETED}`;
      response.isOkay = true;
    } else {
      response.message = certificateMessage.NOT_DELETED;
      response.errors.id = certificateMessage.INVALID_ID;
    }
  } catch (error) {
    logFile.write(
      `Service : certificateService: deleteMultiple, Error : ${error}`
    );
    throw new Error(error);
  }

  return response;
};
