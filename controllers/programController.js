const programService = require("../services/programService");
const _ = require("lodash");
const { defaultServerResponse } = require("../constants/message");
const logFile = require("../helpers/logFile");

// create
module.exports.create = async (req, res) => {
  const response = _.cloneDeep(defaultServerResponse);
  try {
    const serviceResponse = await programService.create(req.body);
    if (serviceResponse.isOkay) {
      response.body = serviceResponse.body;
      response.status = 200;
    } else {
      response.errors = serviceResponse.errors;
    }
    response.message = serviceResponse.message;
  } catch (error) {
    logFile.write(`Controller: programController: create, Error : ${error}`);

    response.message = error.message;
  }
  res.status(response.status).send(response);
};

// findById
module.exports.findById = async (req, res) => {
  const response = _.cloneDeep(defaultServerResponse);
  try {
    const serviceResponse = await programService.findById(req.params);
    if (serviceResponse.isOkay) {
      response.body = serviceResponse.body;
      response.status = 200;
    } else {
      response.errors = serviceResponse.errors;
    }
    response.message = serviceResponse.message;
  } catch (error) {
    logFile.write(`Controller: programController: findById, Error : ${error}`);
    response.message = error.message;
  }
  res.status(response.status).send(response);
};

// findAll
module.exports.findAll = async (req, res) => {
  const response = _.cloneDeep(defaultServerResponse);

  try {
    const serviceResponse = await programService.findAll(req.query);
    if (serviceResponse.isOkay) {
      response.body = serviceResponse.body;
      response.page = serviceResponse.page;
      response.totalPages = serviceResponse.totalPages;
      response.totalRecords = serviceResponse.totalRecords;

      response.status = 200;
    } else {
      response.errors = serviceResponse.errors;
    }
    response.message = serviceResponse.message;
  } catch (error) {
    logFile.write(`Controller: programController: findAll, Error : ${error}`);
    response.message = error.message;
  }
  res.status(response.status).send(response);
};

// update
module.exports.update = async (req, res) => {
  const response = _.cloneDeep(defaultServerResponse);
  try {
    const serviceResponse = await programService.update({
      id: req.params.id,
      body: req.body,
    });

    if (serviceResponse.isOkay) {
      response.body = serviceResponse.body;
      response.status = 200;
    } else {
      response.errors = serviceResponse.errors;
    }

    response.message = serviceResponse.message;
  } catch (error) {
    logFile.write(`Controller: programController: update, Error : ${error}`);
    response.message = error.message;
  }
  res.status(response.status).send(response);
};

// delete
module.exports.delete = async (req, res) => {
  const response = _.cloneDeep(defaultServerResponse);
  try {
    const serviceResponse = await programService.delete(req.params);
    if (serviceResponse.isOkay) {
      response.body = serviceResponse.body;
      response.status = 200;
    } else {
      response.errors = serviceResponse.errors;
    }
    response.message = serviceResponse.message;
  } catch (error) {
    logFile.write(`Controller: programController: delete, Error : ${error}`);
    response.message = error.message;
  }
  res.status(response.status).send(response);
};

// deleteMultiple
module.exports.deleteMultiple = async (req, res) => {
  const response = _.cloneDeep(defaultServerResponse);
  try {
    const serviceResponse = await programService.deleteMultiple(req.body);
    if (serviceResponse.isOkay) {
      response.body = serviceResponse.body;
      response.status = 200;
    } else {
      response.errors = serviceResponse.errors;
    }
    response.message = serviceResponse.message;
  } catch (error) {
    logFile.write(
      `Controller: programController: deleteMultiple, Error : ${error}`
    );
    response.message = error.message;
  }
  res.status(response.status).send(response);
};
