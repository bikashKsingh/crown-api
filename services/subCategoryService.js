const subCategoryModel = require("../database/models/subCategoryModel");
const { serviceResponse, subCategoryMessage } = require("../constants/message");
const dbHelper = require("../helpers/dbHelper");
const _ = require("lodash");
const logFile = require("../helpers/logFile");

// create
module.exports.create = async (serviceData) => {
  const response = _.cloneDeep(serviceResponse);
  try {
    // Check name is already exist or not
    const isExist = await subCategoryModel.findOne({
      name: serviceData.name,
    });

    // already exists
    if (isExist) {
      response.errors = {
        name: subCategoryMessage.ALREADY_EXISTS,
      };
      response.message = subCategoryMessage.ALREADY_EXISTS;
      return response;
    }

    const newData = new subCategoryModel(serviceData);
    const result = await newData.save();

    if (result) {
      response.body = dbHelper.formatMongoData(result);
      response.isOkay = true;
      response.message = subCategoryMessage.CREATED;
    } else {
      response.message = subCategoryMessage.NOT_CREATED;
      response.errors.error = subCategoryMessage.NOT_CREATED;
    }
  } catch (error) {
    logFile.write(`Service : subCategoryService: create, Error : ${error}`);
    throw new Error(error.message);
  }
  return response;
};

// findById
module.exports.findById = async (serviceData) => {
  const response = _.cloneDeep(serviceResponse);
  try {
    const result = await subCategoryModel
      .findById({ _id: serviceData.id })
      .populate({ path: "categories" });
    if (result) {
      response.body = dbHelper.formatMongoData(result);
      response.message = subCategoryMessage.FETCHED;
      response.isOkay = true;
    } else {
      response.errors.error = subCategoryMessage.NOT_AVAILABLE;
      response.message = subCategoryMessage.NOT_AVAILABLE;
    }
    return response;
  } catch (error) {
    logFile.write(`Service : subCategoryService: findById, Error : ${error}`);
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
      categories = [],
      status = true,
      isDeleted = false,
      isApplication = false,
      isAddedToNavigation = false,
      priority = "",
      slug = "",
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

    if (category) conditions.categories = category;
    if (categories.length)
      conditions.categories = {
        $in: categories,
      };

    // DeletedAccount
    conditions.isDeleted = isDeleted;

    if (slug) conditions.slug = slug;

    if (priority) {
      sortCondition = {
        priority: priority == "ASC" ? 1 : -1,
      };
    }

    // count record
    const totalRecords = await subCategoryModel.countDocuments(conditions);
    // Calculate the total number of pages
    const totalPages = Math.ceil(totalRecords / parseInt(limit));

    const result = await subCategoryModel
      .find(conditions)
      .populate({ path: "categories" })
      .skip((parseInt(page) - 1) * parseInt(limit))
      .sort(sortCondition)
      .limit(parseInt(limit));

    if (result) {
      response.body = dbHelper.formatMongoData(result);
      response.isOkay = true;
      response.page = parseInt(page);
      response.totalPages = totalPages;
      response.totalRecords = totalRecords;
      response.message = subCategoryMessage.FETCHED;
    } else {
      response.message = subCategoryMessage.NOT_FETCHED;
    }
  } catch (error) {
    logFile.write(`Service : subCategoryService: findAll, Error : ${error}`);

    throw new Error(error);
  }

  return response;
};

// update
module.exports.update = async (serviceData) => {
  const response = _.cloneDeep(serviceResponse);
  try {
    const { id, body } = serviceData;

    const result = await subCategoryModel.findByIdAndUpdate(id, body, {
      new: true,
    });

    if (result) {
      response.body = dbHelper.formatMongoData(result);
      response.message = subCategoryMessage.UPDATED;
      response.isOkay = true;
    } else {
      response.message = subCategoryMessage.NOT_UPDATED;
      response.errors.id = subCategoryMessage.INVALID_ID;
    }
  } catch (error) {
    logFile.write(`Service : subCategoryService: update, Error : ${error}`);
    throw new Error(error);
  }
  return response;
};

// delete
module.exports.delete = async (serviceData) => {
  const response = _.cloneDeep(serviceResponse);
  try {
    const { id } = serviceData;
    // const result = await subCategoryModel.findByIdAndUpdate(id, {
    //   isDeleted: true,
    //   status: false,
    // });

    const result = await subCategoryModel.findByIdAndDelete(id, {
      new: true,
    });

    if (result) {
      response.message = subCategoryMessage.DELETED;
      response.isOkay = true;
    } else {
      response.message = subCategoryMessage.NOT_DELETED;
      response.errors.id = subCategoryMessage.INVALID_ID;
    }
  } catch (error) {
    logFile.write(`Service : subCategoryService: delete, Error : ${error}`);
    throw new Error(error);
  }

  return response;
};

// deleteMultiple
module.exports.deleteMultiple = async (serviceData) => {
  const response = _.cloneDeep(serviceResponse);
  try {
    // const result = await subCategoryModel.findByIdAndUpdate(id, {
    //   isDeleted: true,
    //   status: false,
    // });

    // console.log(serviceData);

    const result = await subCategoryModel.deleteMany({
      _id: { $in: serviceData.ids },
    });

    if (result) {
      response.message = `${result.deletedCount} ${subCategoryMessage.DELETED}`;
      response.isOkay = true;
    } else {
      response.message = subCategoryMessage.NOT_DELETED;
      response.errors.id = subCategoryMessage.INVALID_ID;
    }
  } catch (error) {
    logFile.write(
      `Service : subCategoryService: deleteMultiple, Error : ${error}`
    );
    throw new Error(error);
  }

  return response;
};
