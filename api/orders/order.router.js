const router = require("express").Router();
const multer = require("multer");
const {
  insertOrder,
  insertCustomer,
  insertOrderItem,
  retrieveOrders,
  changeOrderStatus,
} = require("./order.controller");

// Configure Multer for image uploads

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/prescriptions/");
  },
  filename: function (req, file, cb) {
    // Generate a random string of numbers
    const randomNumber = Math.random().toString().slice(2); // Get random string without leading '0.'

    // Get the file extension
    const fileExtension = file.originalname.split(".").pop();

    // Construct the unique filename
    const uniqueFilename = `score_pharmacy_prescription_${randomNumber}.${fileExtension}`;

    cb(null, uniqueFilename);
  },
});

const upload = multer({ storage: storage });

router.post("/orders", upload.single("image"), insertOrder);
router.post("/orders/customer", insertCustomer);
router.post("/orders/item", insertOrderItem);
router.get("/orders", retrieveOrders);
router.post("/orders/status", changeOrderStatus);

module.exports = router;
