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
  .post(auth, bookingController.createBooking)
  .get(auth, bookingController.getBookings);

router
  .route("/:id")
  .delete(auth, bookingController.deleteBooking)
  .put(auth, bookingController.updateBooking);

router
  .route("/clear-balance/:id")
  .put(auth, bookingController.clearBookingBalance);

module.exports = router;
