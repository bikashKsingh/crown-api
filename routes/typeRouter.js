const router = require("express").Router();
const typeController = require("../controllers/typeController");
const typeValidationSchema = require("../apiValidationSchemas/typeValidationSchema");
const joiSchemaValidation = require("../middlewares/joiSchemaValidation");
const jwtValidation = require("../middlewares/jwtValidation");

// create
router.post(
  "/",
  jwtValidation.validateAdminToken,
  joiSchemaValidation.validateBody(typeValidationSchema.create),
  typeController.create
);

// findById
router.get(
  "/:id",
  joiSchemaValidation.validateParams(typeValidationSchema.findById),
  // jwtValidation.validateAdminToken,
  typeController.findById
);

// findAll
router.get(
  "/",
  // jwtValidation.validateAdminToken,
  joiSchemaValidation.validateQuery(typeValidationSchema.findAll),
  typeController.findAll
);

// update
router.put(
  "/:id",
  joiSchemaValidation.validateParams(typeValidationSchema.findById),
  jwtValidation.validateAdminToken,
  joiSchemaValidation.validateBody(typeValidationSchema.update),
  typeController.update
);

// delete
router.delete(
  "/:id",
  joiSchemaValidation.validateParams(typeValidationSchema.findById),
  jwtValidation.validateAdminToken,
  joiSchemaValidation.validateBody(typeValidationSchema.findById),
  typeController.delete
);

// deleteMultiple
router.delete(
  "/",
  jwtValidation.validateAdminToken,
  joiSchemaValidation.validateBody(typeValidationSchema.deleteMultiple),
  typeController.deleteMultiple
);

module.exports = router;
