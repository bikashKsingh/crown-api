const productModel = require("../database/models/productModel");
const { serviceResponse, productMessage } = require("../constants/message");
const dbHelper = require("../helpers/dbHelper");
const _ = require("lodash");
const logFile = require("../helpers/logFile");

// create
module.exports.create = async (serviceData) => {
  const response = _.cloneDeep(serviceResponse);
  try {
    // Check program is already exist or not
    const isExist = await productModel.findOne({
      $or: [{ name: serviceData.name }, { slug: serviceData.slug }],
    });

    // already exists
    if (isExist) {
      response.errors = {
        name: productMessage.ALREADY_EXISTS,
      };
      response.message = productMessage.ALREADY_EXISTS;
      return response;
    }

    const newData = new productModel(serviceData);
    const result = await newData.save();

    if (result) {
      response.body = dbHelper.formatMongoData(result);
      response.isOkay = true;
      response.message = productMessage.CREATED;
    } else {
      response.message = productMessage.NOT_CREATED;
      response.errors.error = productMessage.NOT_CREATED;
    }
  } catch (error) {
    logFile.write(`Service : productService: create, Error : ${error}`);
    throw new Error(error.message);
  }
  return response;
};

// findById
module.exports.findById = async (serviceData) => {
  const response = _.cloneDeep(serviceResponse);
  try {
    const result = await productModel
      .findById({ _id: serviceData.id })
      .populate({ path: "category" })
      .populate({ path: "subCategory" })
      .populate({ path: "type" })
      .populate({ path: "sizes" });
    if (result) {
      response.body = dbHelper.formatMongoData(result);
      response.message = productMessage.FETCHED;
      response.isOkay = true;
    } else {
      response.errors.error = productMessage.NOT_AVAILABLE;
      response.message = productMessage.NOT_AVAILABLE;
    }
    return response;
  } catch (error) {
    logFile.write(`Service : productService: findById, Error : ${error}`);
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
    const totalRecords = await productModel.countDocuments(conditions);
    // Calculate the total number of pages
    const totalPages = Math.ceil(totalRecords / parseInt(limit));

    const result = await productModel
      .find(conditions)
      .populate({ path: "category" })
      .populate({ path: "type" })
      .populate({ path: "sizes" })
      .skip((parseInt(page) - 1) * parseInt(limit))
      .sort({ updatedAt: -1 })
      .limit(parseInt(limit));

    if (result) {
      response.body = dbHelper.formatMongoData(result);
      response.isOkay = true;
      response.page = parseInt(page);
      response.totalPages = totalPages;
      response.totalRecords = totalRecords;
      response.message = productMessage.FETCHED;
    } else {
      response.message = productMessage.NOT_FETCHED;
    }
  } catch (error) {
    logFile.write(`Service : productService: findAll, Error : ${error}`);

    throw new Error(error);
  }

  return response;
};

// update
module.exports.update = async (serviceData) => {
  const response = _.cloneDeep(serviceResponse);
  try {
    const { id, body } = serviceData;

    const result = await productModel.findByIdAndUpdate(id, body, {
      new: true,
    });

    if (result) {
      response.body = dbHelper.formatMongoData(result);
      response.message = productMessage.UPDATED;
      response.isOkay = true;
    } else {
      response.message = productMessage.NOT_UPDATED;
      response.errors.id = productMessage.INVALID_ID;
    }
  } catch (error) {
    logFile.write(`Service : productService: update, Error : ${error}`);
    throw new Error(error);
  }
  return response;
};

// delete
module.exports.delete = async (serviceData) => {
  const response = _.cloneDeep(serviceResponse);
  try {
    const { id } = serviceData;
    // const result = await productModel.findByIdAndUpdate(id, {
    //   isDeleted: true,
    //   status: false,
    // });

    const result = await productModel.findByIdAndDelete(id, {
      new: true,
    });

    if (result) {
      response.message = productMessage.DELETED;
      response.isOkay = true;
    } else {
      response.message = productMessage.NOT_DELETED;
      response.errors.id = productMessage.INVALID_ID;
    }
  } catch (error) {
    logFile.write(`Service : productService: delete, Error : ${error}`);
    throw new Error(error);
  }

  return response;
};

// deleteMultiple
module.exports.deleteMultiple = async (serviceData) => {
  const response = _.cloneDeep(serviceResponse);
  try {
    // const result = await productModel.findByIdAndUpdate(id, {
    //   isDeleted: true,
    //   status: false,
    // });

    // console.log(serviceData);

    const result = await productModel.deleteMany({
      _id: { $in: serviceData.ids },
    });

    if (result) {
      response.message = `${result.deletedCount} ${productMessage.DELETED}`;
      response.isOkay = true;
    } else {
      response.message = productMessage.NOT_DELETED;
      response.errors.id = productMessage.INVALID_ID;
    }
  } catch (error) {
    logFile.write(`Service : productService: deleteMultiple, Error : ${error}`);
    throw new Error(error);
  }

  return response;
};