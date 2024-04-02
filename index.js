require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");

// Import Endpoint Routes
const userRoutes = require("./api/users/user.router");
const AdminRoutes = require("./api/admin/admin.router");
const MedicineRoutes = require("./api/medicines/medicine.router");
const OrdersRoutes = require("./api/orders/order.router")

// Serve static files from the 'uploads' directory
app.use("/uploads", express.static("uploads"));

// Configure Middleware functions
app.use(express.json());
app.use(cors());
app.use("/api", userRoutes);
app.use("/api", AdminRoutes);
app.use("/api", MedicineRoutes);
app.use("/api", OrdersRoutes);

app.get("", (req, res) => {
  res.json({
    message: "it works fi ne!!",
  });
});

// Listen to server Port
app.listen(process.env.SERVER_PORT, () => {
  console.log("Server up and running!!");
});
