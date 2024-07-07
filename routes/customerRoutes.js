const express = require("express");
const router = express.Router();
const dotenv = require("dotenv").config();
const cors = require("cors");
const customerController = require("../controllers/customerController");

// middleware
router.use(
  cors({
    credentials: true,
    origin: process.env.CLIENT_SIDE_URL,
  })
);

router
  .route("/")
  .post(customerController.createCustomer)
  .get(customerController.getCustomers);

router
  .route("/:id")
  .delete(customerController.deleteCustomer)
  .put(customerController.updateCustomer);

module.exports = router;
