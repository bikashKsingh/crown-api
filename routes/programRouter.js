const router = require("express").Router();
const programController = require("../controllers/programController");
const programValidationSchema = require("../apiValidationSchemas/programValidationSchema");
const joiSchemaValidation = require("../middlewares/joiSchemaValidation");
const jwtValidation = require("../middlewares/jwtValidation");

// create
router.post(
  "/",
  (req, res, next) => {
    console.log(req.body);
    next();
  },

  jwtValidation.validateAdminToken,
  joiSchemaValidation.validateBody(programValidationSchema.create),
  programController.create
);

// findById
router.get(
  "/:id",
  joiSchemaValidation.validateParams(programValidationSchema.findById),
  jwtValidation.validateAdminToken,
  programController.findById
);

// findAll
router.get(
  "/",

  joiSchemaValidation.validateParams(programValidationSchema.findAll),
  jwtValidation.validateAdminToken,
  programController.findAll
);

// update
router.put(
  "/:id",
  joiSchemaValidation.validateParams(programValidationSchema.findById),
  jwtValidation.validateAdminToken,
  joiSchemaValidation.validateBody(programValidationSchema.update),
  programController.update
);

// delete
router.delete(
  "/:id",
  joiSchemaValidation.validateParams(programValidationSchema.findById),
  jwtValidation.validateAdminToken,
  joiSchemaValidation.validateBody(programValidationSchema.findById),
  programController.delete
);

// deleteMultiple
router.delete(
  "/",
  jwtValidation.validateAdminToken,
  joiSchemaValidation.validateBody(programValidationSchema.deleteMultiple),
  programController.deleteMultiple
);

module.exports = router;
