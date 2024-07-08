const express = require("express");
const router = express.Router();
const dotenv = require("dotenv").config();
const cors = require("cors");
const auth = require("../middleware/auth");
const customerController = require("../controllers/customerController");

// middleware
router.use(
  cors({
    credentials: true,
    origin: process.env.CLIENT_SIDE_URL,
  })
);

router.use(express.json());
router.use(cookieParser());

router
  .route("/")
  .post(auth, customerController.createCustomer)
  .get(auth, customerController.getCustomers);

router
  .route("/:id")
  .delete(auth, customerController.deleteCustomer)
  .put(auth, customerController.updateCustomer);

module.exports = router;
