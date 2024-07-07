const Booking = require("../models/bookingModel");
const jwt = require("jsonwebtoken");

const bookingController = {
  createBooking: async (req, res) => {
    try {
      const {
        booking_id,
        booked_on,
        booking_status,
        customer_firstname,
        customer_middlename,
        customer_lastname,
        customer_contact,
        booking_date,
        checkin_date,
        checkout_date,
        room_number,
        room_price,
        customer_ids,
        advance_amount,
        food_amount,
        other_expenses,
      } = req.body;

      const dataToSend = {
        booking_id,
        booked_on,
        booking_status,
        customer_firstname,
        customer_middlename,
        customer_lastname,
        customer_contact,
        booking_date,
        checkin_date,
        checkout_date,
        room_number,
        room_price,
        customer_ids,
        advance_amount,
        food_amount,
        other_expenses,
      };

      for (let key in dataToSend) {
        if (
          dataToSend[key] === null ||
          dataToSend[key] === undefined ||
          dataToSend[key] === ""
        ) {
          delete dataToSend[key];
        }
      }

      //  Check booking is unique or not
      const exist = await Booking.findOne({ booking_id });
      if (exist) {
        return res.json({
          error: "This booking already exists",
        });
      }

      // Check if customer_name present
      if (!booked_on) {
        return res.json({
          error: "Booked on is required.",
        });
      }

      // Check if customer_name present
      if (!customer_firstname) {
        return res.json({
          error: "First name is required.",
        });
      }

      // Check if customer_name present
      if (!customer_lastname) {
        return res.json({
          error: "Last name is required.",
        });
      }

      // Check if contact_no present and valid
      if (!customer_contact) {
        return res.json({
          error: "Contact No. is required.",
        });
      } else if (
        customer_contact.length !== 10 ||
        !/^\d+$/.test(customer_contact)
      ) {
        return res.json({
          error:
            "Invalid Contact No. Please enter a 10-digit numeric contact number.",
        });
      }

      // Check if booking_status present
      if (!booking_status) {
        return res.json({
          error: "Booking Status is required.",
        });
      }

      // Check if booking_date present
      if (!booking_date) {
        return res.json({
          error: "Booking Date is required.",
        });
      }

      // Check if checkin_date present
      if (!checkin_date) {
        return res.json({
          error: "Check In Date is required.",
        });
      }

      // Check if checkout_date present
      if (!checkout_date) {
        return res.json({
          error: "Check Out Date is required.",
        });
      }

      // Check if room_number present
      if (!room_number) {
        return res.json({
          error: "Room Number is required.",
        });
      }

      // Check if room_price present
      if (!room_price) {
        return res.json({
          error: "Room Price is required.",
        });
      }

      // Check if customer_ids present for Non-reservation bookings
      if (booking_status != "Reserved" && !customer_ids) {
        return res.json({
          error: "Customer ID not found.",
        });
      }

      const newBooking = new Booking(dataToSend);

      //Save mongodb
      await newBooking.save();

      res.json({
        msg: "Booking created successfully.",
      });
    } catch (error) {
      console.log(error);
    }
  },

  getBookings: async (req, res) => {
    try {
      const bookings = await Booking.find();
      res.json(bookings);
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  deleteBooking: async (req, res) => {
    try {
      const bookingId = req.params.id;

      //  Check booking is available or not
      const exist = await Booking.findOne({ booking_id: bookingId });
      if (!exist) {
        return res.json({
          error: "This booking does not exists",
        });
      }

      await Booking.findOneAndUpdate(
        { booking_id: bookingId },
        {
          is_deleted: true,
        }
      );

      res.json({ msg: "Booking deleted successfully." });
    } catch (err) {
      res.status(500).json({ msg: err.message });
    }
  },

  updateBooking: async (req, res) => {
    try {
      const {
        booked_on,
        booking_status,
        customer_firstname,
        customer_middlename,
        customer_lastname,
        customer_contact,
        booking_date,
        checkin_date,
        checkout_date,
        room_number,
        room_price,
        customer_ids,
        advance_amount,
        food_amount,
        other_expenses,
      } = req.body;

      const booking_id = req.params.id;

      //  Check booking is available or not
      const exist = await Booking.findOne({ booking_id });
      if (!exist) {
        return res.json({
          error: "This booking does not exists",
        });
      }

      // Check if booking_status present
      if (!booking_status) {
        return res.json({
          error: "Booking Status is required.",
        });
      }

      // Check if contact_no present
      if (!customer_contact) {
        return res.json({
          error: "Contact No. is required.",
        });
      }
      // Check if contact_no valid

      const customer_contact_str = String(customer_contact);
      if (
        customer_contact_str.length !== 10 ||
        !/^\d+$/.test(customer_contact_str)
      ) {
        return res.json({
          error:
            "Invalid Contact No. Please enter a 10-digit numeric contact number.",
        });
      }

      // Check if booking_date present
      if (!booking_date) {
        return res.json({
          error: "Booking Date is required.",
        });
      }

      // Check if checkin_date present
      if (!checkin_date) {
        return res.json({
          error: "Check In Date is required.",
        });
      }

      // Check if checkout_date present
      if (!checkout_date) {
        return res.json({
          error: "Check Out Date is required.",
        });
      }

      // Check if room_number present
      if (!room_number) {
        return res.json({
          error: "Room Number is required.",
        });
      }

      // Check if room_price present
      if (!room_price) {
        return res.json({
          error: "Room Price is required.",
        });
      }

      const bookingId = req.params.id;

      await Booking.findOneAndUpdate(
        { booking_id: bookingId },
        {
          booked_on,
          booking_status,
          customer_firstname,
          customer_middlename,
          customer_lastname,
          customer_contact,
          booking_date,
          checkin_date,
          checkout_date,
          room_number,
          room_price,
          customer_ids,
          advance_amount,
          food_amount,
          other_expenses,
        }
      );

      res.json({ msg: "Booking updated successfully." });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  clearBookingBalance: async (req, res) => {
    try {
      const { advance_amount } = req.body;

      const booking_id = req.params.id;

      //  Check booking is available or not
      const exist = await Booking.findOne({ booking_id });
      if (!exist) {
        return res.json({
          error: "This booking does not exists",
        });
      }

      const bookingId = req.params.id;

      await Booking.findOneAndUpdate(
        { booking_id: bookingId },
        {
          advance_amount,
          remaining_amount: "0",
        }
      );

      res.json({ msg: "Booking updated successfully." });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
};

module.exports = bookingController;
