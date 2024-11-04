const router = require("express").Router();
const trainerInterestController = require("../controllers/trainerInterestController");
const trainerInterestValidationSchema = require("../apiValidationSchemas/trainerInterestValidationSchema");
const joiSchemaValidation = require("../middlewares/joiSchemaValidation");
const jwtValidation = require("../middlewares/jwtValidation");

// create
router.post(
  "/",
  jwtValidation.validateAdminToken,
  joiSchemaValidation.validateBody(trainerInterestValidationSchema.create),
  trainerInterestController.create
);

// findById
router.get(
  "/:id",
  joiSchemaValidation.validateParams(trainerInterestValidationSchema.findById),
  jwtValidation.validateAdminToken,
  trainerInterestController.findById
);

// findAll
router.get(
  "/",
  jwtValidation.validateAdminToken,
  joiSchemaValidation.validateQuery(trainerInterestValidationSchema.findAll),
  trainerInterestController.findAll
);

// update
router.put(
  "/:id",
  joiSchemaValidation.validateParams(trainerInterestValidationSchema.findById),
  jwtValidation.validateAdminToken,
  joiSchemaValidation.validateBody(trainerInterestValidationSchema.update),
  trainerInterestController.update
);

// delete
router.delete(
  "/:id",
  joiSchemaValidation.validateParams(trainerInterestValidationSchema.findById),
  jwtValidation.validateAdminToken,
  joiSchemaValidation.validateBody(trainerInterestValidationSchema.findById),
  trainerInterestController.delete
);

// deleteMultiple
router.delete(
  "/",
  jwtValidation.validateAdminToken,
  joiSchemaValidation.validateBody(
    trainerInterestValidationSchema.deleteMultiple
  ),
  trainerInterestController.deleteMultiple
);

module.exports = router;
