const router = require("express").Router();
const multer = require("multer");
const { insertMedicine, allMedicines, visibleMedicines} = require("./medicine.controller");

// Configure Multer for image uploads

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/medicines/");
  },
  filename: function (req, file, cb) {
    // Generate a random string of numbers
    const randomNumber = Math.random().toString().slice(2); // Get random string without leading '0.'

    // Get the file extension
    const fileExtension = file.originalname.split(".").pop();

    // Construct the unique filename
    const uniqueFilename = `score_pharmacy_medicine_${randomNumber}.${fileExtension}`;

    cb(null, uniqueFilename);
  },
});

const upload = multer({ storage: storage });
router.post("/medicine", upload.single("image"), insertMedicine);
router.get("/medicine", allMedicines);
router.get("/medicine/visible", visibleMedicines);

module.exports = router;
