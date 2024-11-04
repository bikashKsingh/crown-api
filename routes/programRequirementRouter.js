const router = require("express").Router();
const programRequirementController = require("../controllers/programRequirementController");
const programRequirementValidationSchema = require("../apiValidationSchemas/programRequirementValidationSchema");
const joiSchemaValidation = require("../middlewares/joiSchemaValidation");
const jwtValidation = require("../middlewares/jwtValidation");

// create
router.post(
  "/",
  jwtValidation.validateAdminToken,
  joiSchemaValidation.validateBody(programRequirementValidationSchema.create),
  programRequirementController.create
);

// findById
router.get(
  "/:id",
  joiSchemaValidation.validateParams(
    programRequirementValidationSchema.findById
  ),
  jwtValidation.validateAdminToken,
  programRequirementController.findById
);

// findAll
router.get(
  "/",
  jwtValidation.validateAdminToken,
  joiSchemaValidation.validateQuery(programRequirementValidationSchema.findAll),
  programRequirementController.findAll
);

// update
router.put(
  "/:id",
  joiSchemaValidation.validateParams(
    programRequirementValidationSchema.findById
  ),
  jwtValidation.validateAdminToken,
  joiSchemaValidation.validateBody(programRequirementValidationSchema.update),
  programRequirementController.update
);

// delete
router.delete(
  "/:id",
  joiSchemaValidation.validateParams(
    programRequirementValidationSchema.findById
  ),
  jwtValidation.validateAdminToken,
  joiSchemaValidation.validateBody(programRequirementValidationSchema.findById),
  programRequirementController.delete
);

// deleteMultiple
router.delete(
  "/",
  jwtValidation.validateAdminToken,
  joiSchemaValidation.validateBody(
    programRequirementValidationSchema.deleteMultiple
  ),
  programRequirementController.deleteMultiple
);

module.exports = router;
