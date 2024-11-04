const router = require("express").Router();
const homepageController = require("../controllers/homepageController");
const carouselValidationSchema = require("../apiValidationSchemas/carouselValidationSchema");
const joiSchemaValidation = require("../middlewares/joiSchemaValidation");
const jwtValidation = require("../middlewares/jwtValidation");

// create
router.post(
  "/",
  jwtValidation.validateAdminToken,
  joiSchemaValidation.validateBody(carouselValidationSchema.create),
  homepageController.create
);

// findOne
router.get("/:id", homepageController.findOne);

// delete
router.delete("/", jwtValidation.validateAdminToken, homepageController.delete);

module.exports = router;
