const express = require("express");
const dotEnv = require("dotenv");
const bodyParser = require("body-parser");
const dbConnection = require("./database/connection");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
dotEnv.config();
// Connect to the database
dbConnection();

// Create a app
const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

// Serve files from the 'uploads' directory
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Route to get all uploaded files
app.get("/files", (req, res) => {
  const uploadDir = path.join(__dirname, "uploads");

  fs.readdir(uploadDir, (err, files) => {
    if (err) {
      return res.status(500).json({ error: "Failed to read upload directory" });
    }

    const fileDetails = files.map((file) => {
      return {
        fileName: file,
        url: `${req.protocol}://${req.get("host")}/uploads/${file}`,
      };
    });

    res.json({
      message: "List of all uploaded files",
      files: fileDetails,
    });
  });
});

// router middleware
app.use("/api/v1/admins", require("./routes/adminRouter"));
app.use("/api/v1/categories", require("./routes/categoryRouter"));

app.use("/api/v1/carousels", require("./routes/carouselRouter"));

app.use("/api/v1/subCategories", require("./routes/subCategoryRouter"));
app.use("/api/v1/newsletters", require("./routes/newsLetterRouter"));
app.use("/api/v1/coupons", require("./routes/couponRouter"));
app.use("/api/v1/trainers", require("./routes/trainerRouter"));
app.use("/api/v1/users", require("./routes/userRouter"));
app.use("/api/v1/plans", require("./routes/planRouter"));

// ----------- Settings -----------
app.use("/api/v1/paymentSettings", require("./routes/paymentSettingRouter"));
// ----------- End Settings -----------

app.use(
  "/api/v1/programRequirements",
  require("./routes/programRequirementRouter")
);
app.use("/api/v1/programs", require("./routes/programRouter"));
app.use("/api/v1/programPlans", require("./routes/programPlanRouter"));
app.use("/api/v1/bookings", require("./routes/bookingRouter"));

app.use("/api/v1/trainerInterests", require("./routes/trainerInterestRouter"));
app.use(
  "/api/v1/trainerDesignations",
  require("./routes/trainerDesignationRouter")
);
app.use(
  "/api/v1/trainerSpecialities",
  require("./routes/trainerSpecialityRouter")
);
app.use("/api/v1/trainerLevels", require("./routes/trainerLevelRouter"));
app.use("/api/v1/documentFormats", require("./routes/documentFormatRouter"));
app.use("/api/v1/kycDocuments", require("./routes/kycDocumentRouter"));
app.use("/api/v1/fileUploads", require("./routes/fileUploadingRouter"));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

// Start listening the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is Running at ${PORT}`);
});