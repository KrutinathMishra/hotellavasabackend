const express = require("express");
const router = express.Router();
const cors = require("cors");
const bookingController = require("../controllers/bookingController");
const auth = require("../middleware/auth");
const dotenv = require("dotenv").config();

// middleware
router.use(
  cors({
    credentials: true,
    origin: process.env.CLIENT_SIDE_URL,
  })
);

router
  .route("/")
  .post(bookingController.createBooking)
  .get(bookingController.getBookings);

router
  .route("/:id")
  .delete(bookingController.deleteBooking)
  .put(bookingController.updateBooking);

router.route("/clear-balance/:id").put(bookingController.clearBookingBalance);

module.exports = router;
