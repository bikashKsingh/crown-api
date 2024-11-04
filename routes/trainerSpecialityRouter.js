const router = require("express").Router();
const trainerSpecialityController = require("../controllers/trainerSpecialityController");
const trainerInterestValidationSchema = require("../apiValidationSchemas/trainerInterestValidationSchema");
const joiSchemaValidation = require("../middlewares/joiSchemaValidation");
const jwtValidation = require("../middlewares/jwtValidation");

// create
router.post(
  "/",
  jwtValidation.validateAdminToken,
  joiSchemaValidation.validateBody(trainerInterestValidationSchema.create),
  trainerSpecialityController.create
);

// findById
router.get(
  "/:id",
  joiSchemaValidation.validateParams(trainerInterestValidationSchema.findById),
  jwtValidation.validateAdminToken,
  trainerSpecialityController.findById
);

// findAll
router.get(
  "/",
  jwtValidation.validateAdminToken,
  joiSchemaValidation.validateQuery(trainerInterestValidationSchema.findAll),
  trainerSpecialityController.findAll
);

// update
router.put(
  "/:id",
  joiSchemaValidation.validateParams(trainerInterestValidationSchema.findById),
  jwtValidation.validateAdminToken,
  joiSchemaValidation.validateBody(trainerInterestValidationSchema.update),
  trainerSpecialityController.update
);

// delete
router.delete(
  "/:id",
  joiSchemaValidation.validateParams(trainerInterestValidationSchema.findById),
  jwtValidation.validateAdminToken,
  joiSchemaValidation.validateBody(trainerInterestValidationSchema.findById),
  trainerSpecialityController.delete
);

// deleteMultiple
router.delete(
  "/",
  jwtValidation.validateAdminToken,
  joiSchemaValidation.validateBody(
    trainerInterestValidationSchema.deleteMultiple
  ),
  trainerSpecialityController.deleteMultiple
);

module.exports = router;
