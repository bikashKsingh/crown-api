const orderModel = require("../database/models/orderModel");
const { serviceResponse, orderMessage } = require("../constants/message");
const dbHelper = require("../helpers/dbHelper");
const _ = require("lodash");
const logFile = require("../helpers/logFile");
const productModel = require("../database/models/productModel");

// create
module.exports.create = async (serviceData) => {
  const response = _.cloneDeep(serviceResponse);
  try {
    let products = [];
    let subtotalAmount = 0;
    let totalAmount = 0;

    // find some details
    for (let item of serviceData.products) {
      const productDetails = await productModel.findOne({
        _id: item.product,
      });

      let price = parseInt(item.qty) * productDetails.salePrice;

      let product = {
        product: productDetails._id,
        name: productDetails.name,
        category: productDetails.category,
        subCategory: productDetails.subCategory,
        type: productDetails.type,
        sizes: productDetails.sizes,
        salePrice: productDetails.salePrice,
        mrp: productDetails.mrp,
        finish: productDetails.finish,
        decorName: productDetails.decorName,
        decorNumber: productDetails.decorNumber,
        defaultImage: productDetails.defaultImage,
        images: productDetails.images,
      };

      products.push(product);
      subtotalAmount += price;
      totalAmount += price;
    }

    serviceData.products = products;
    serviceData.subtotalAmount = subtotalAmount;
    serviceData.totalAmount = totalAmount;

    const newData = new orderModel(serviceData);
    const result = await newData.save();

    if (result) {
      response.body = dbHelper.formatMongoData(result);
      response.isOkay = true;
      response.message = orderMessage.BOOKED;
    } else {
      response.message = orderMessage.NOT_BOOKED;
      response.errors.error = orderMessage.NOT_BOOKED;
    }
  } catch (error) {
    logFile.write(`Service : orderService: create, Error : ${error}`);
    throw new Error(error.message);
  }
  return response;
};

// findById
module.exports.findById = async (serviceData) => {
  const response = _.cloneDeep(serviceResponse);
  try {
    const result = await orderModel
      .findById({ _id: serviceData.id })
      .populate({ path: "products.product" });
    if (result) {
      response.body = dbHelper.formatMongoData(result);
      response.message = orderMessage.FETCHED;
      response.isOkay = true;
    } else {
      response.errors.error = orderMessage.NOT_AVAILABLE;
      response.message = orderMessage.NOT_AVAILABLE;
    }
    return response;
  } catch (error) {
    logFile.write(`Service : orderService: findById, Error : ${error}`);
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
      orderStatus = "All",
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
    if (orderStatus == "All") {
      delete conditions.orderStatus;
    } else {
      conditions.orderStatus = orderStatus;
    }

    // DeletedAccount
    conditions.isDeleted = isDeleted;

    // count record
    const totalRecords = await orderModel.countDocuments(conditions);
    // Calculate the total number of pages
    const totalPages = Math.ceil(totalRecords / parseInt(limit));

    const result = await orderModel
      .find(conditions)
      .populate({ path: "products.product" })
      .skip((parseInt(page) - 1) * parseInt(limit))
      .sort({ updatedAt: -1 })
      .limit(parseInt(limit));

    if (result) {
      response.body = dbHelper.formatMongoData(result);
      response.isOkay = true;
      response.page = parseInt(page);
      response.totalPages = totalPages;
      response.totalRecords = totalRecords;
      response.message = orderMessage.FETCHED;
    } else {
      response.message = orderMessage.NOT_FETCHED;
    }
  } catch (error) {
    logFile.write(`Service : orderService: findAll, Error : ${error}`);

    throw new Error(error);
  }

  return response;
};

// update
module.exports.update = async (serviceData) => {
  const response = _.cloneDeep(serviceResponse);
  try {
    const { id, body } = serviceData;

    const result = await orderModel.findByIdAndUpdate(id, body, {
      new: true,
    });

    if (result) {
      response.body = dbHelper.formatMongoData(result);
      response.message = orderMessage.UPDATED;
      response.isOkay = true;
    } else {
      response.message = orderMessage.NOT_UPDATED;
      response.errors.id = orderMessage.INVALID_ID;
    }
  } catch (error) {
    logFile.write(`Service : orderService: update, Error : ${error}`);
    throw new Error(error);
  }
  return response;
};

// delete
module.exports.delete = async (serviceData) => {
  const response = _.cloneDeep(serviceResponse);
  try {
    const { id } = serviceData;
    // const result = await orderModel.findByIdAndUpdate(id, {
    //   isDeleted: true,
    //   status: false,
    // });

    const result = await orderModel.findByIdAndDelete(id, {
      new: true,
    });

    if (result) {
      response.message = orderMessage.DELETED;
      response.isOkay = true;
    } else {
      response.message = orderMessage.NOT_DELETED;
      response.errors.id = orderMessage.INVALID_ID;
    }
  } catch (error) {
    logFile.write(`Service : orderService: delete, Error : ${error}`);
    throw new Error(error);
  }

  return response;
};

// deleteMultiple
module.exports.deleteMultiple = async (serviceData) => {
  const response = _.cloneDeep(serviceResponse);
  try {
    // const result = await orderModel.findByIdAndUpdate(id, {
    //   isDeleted: true,
    //   status: false,
    // });

    // console.log(serviceData);

    const result = await orderModel.deleteMany({
      _id: { $in: serviceData.ids },
    });

    if (result) {
      response.message = `${result.deletedCount} ${orderMessage.DELETED}`;
      response.isOkay = true;
    } else {
      response.message = orderMessage.NOT_DELETED;
      response.errors.id = orderMessage.INVALID_ID;
    }
  } catch (error) {
    logFile.write(`Service : orderService: deleteMultiple, Error : ${error}`);
    throw new Error(error);
  }

  return response;
};