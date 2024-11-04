const router = require("express").Router();
const bookingController = require("../controllers/bookingController");
const bookingValidationSchema = require("../apiValidationSchemas/bookingValidationSchema");
const joiSchemaValidation = require("../middlewares/joiSchemaValidation");
const jwtValidation = require("../middlewares/jwtValidation");

// ------------ USER SECTION --------------
// create
router.post(
  "/",
  jwtValidation.validateUserToken,
  joiSchemaValidation.validateBody(bookingValidationSchema.create),
  bookingController.create
);

// findById
router.get(
  "/:id",
  joiSchemaValidation.validateParams(bookingValidationSchema.findById),
  jwtValidation.validateAdminToken,
  bookingController.findById
);

// findAll
router.get(
  "/",
  joiSchemaValidation.validateParams(bookingValidationSchema.findAll),
  jwtValidation.validateAdminToken,
  bookingController.findAll
);

// update
router.put(
  "/:id",
  joiSchemaValidation.validateParams(bookingValidationSchema.findById),
  jwtValidation.validateAdminToken,
  joiSchemaValidation.validateBody(bookingValidationSchema.update),
  bookingController.update
);

// delete
router.delete(
  "/:id",
  joiSchemaValidation.validateParams(bookingValidationSchema.findById),
  jwtValidation.validateAdminToken,
  joiSchemaValidation.validateBody(bookingValidationSchema.findById),
  bookingController.delete
);

// deleteMultiple
router.delete(
  "/",
  jwtValidation.validateAdminToken,
  joiSchemaValidation.validateBody(bookingValidationSchema.deleteMultiple),
  bookingController.deleteMultiple
);

module.exports = router;
