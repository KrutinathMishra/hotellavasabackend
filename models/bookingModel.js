const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  booking_id: {
    type: String,
    unique: true,
    required: true,
  },
  booked_on: {
    type: String,
    required: true,
  },
  booking_status: {
    type: String,
    required: true,
  },
  customer_firstname: {
    type: String,
    required: true,
  },
  customer_middlename: {
    type: String,
    default: "",
  },
  customer_lastname: {
    type: String,
    required: true,
  },
  customer_contact: {
    type: Number,
    required: true,
  },
  booking_date: {
    type: Date,
    required: true,
  },
  checkin_date: {
    type: Date,
    required: true,
  },
  checkout_date: {
    type: Date,
    required: true,
  },
  room_number: {
    type: Number,
    required: true,
  },
  room_price: {
    type: Number,
    required: true,
  },
  customer_ids: [
    {
      type: String,
    },
  ],
  advance_amount: {
    type: Number,
    default: 0,
  },
  food_amount: {
    type: Number,
    default: 0,
  },
  other_expenses: {
    type: Number,
    default: 0,
  },
  total_room_price: {
    type: Number,
  },
  gst: {
    type: Number,
  },
  total_bill_amount: {
    type: Number,
  },
  remaining_amount: {
    type: Number,
  },
  is_deleted: {
    type: Boolean,
    default: false,
  },
});

// Method to calculate total_room_price
bookingSchema.methods.calculateTotalRoomPrice = function () {
  const checkinDate = new Date(this.checkin_date);
  const checkoutDate = new Date(this.checkout_date);
  const timeDiff = Math.abs(checkoutDate - checkinDate);
  const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24)); // Calculate difference in days

  return daysDiff * this.room_price;
};

// Method to calculate GST
bookingSchema.methods.calculateGST = function (totalRoomPrice) {
  return totalRoomPrice * 0.12;
};

// Method to calculate total_bill_amount
bookingSchema.methods.calculateTotalBillAmount = function (
  totalRoomPrice,
  gst
) {
  const foodAmount = this.food_amount || 0;
  const otherExpenses = this.other_expenses || 0;

  return totalRoomPrice + foodAmount + otherExpenses + gst;
};

// Method to calculate raimaining_amount
bookingSchema.methods.calculateRemainingAmount = function (
  total_bill_amount,
  advance_amount
) {
  return total_bill_amount - advance_amount;
};

bookingSchema.pre("save", function (next) {
  this.total_room_price = this.calculateTotalRoomPrice();
  this.gst = this.calculateGST(this.total_room_price);
  this.total_bill_amount = this.calculateTotalBillAmount(
    this.total_room_price,
    this.gst
  );
  this.remaining_amount = this.calculateRemainingAmount(
    this.total_bill_amount,
    this.advance_amount
  );
  next();
});

bookingSchema.pre("findOneAndUpdate", function (next) {
  const update = this.getUpdate();
  if (update.checkin_date && update.checkout_date && update.room_price) {
    const checkinDate = new Date(update.checkin_date);
    const checkoutDate = new Date(update.checkout_date);
    const timeDiff = Math.abs(checkoutDate - checkinDate);
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24)); // Calculate difference in days
    const totalRoomPrice = daysDiff * update.room_price;
    const gst = totalRoomPrice * 0.12;
    const totalBillAmount =
      totalRoomPrice +
      (update.food_amount || 0) +
      (update.other_expenses || 0) +
      gst;
    const remaining_amount = totalBillAmount - update.advance_amount;

    update.total_room_price = totalRoomPrice;
    update.gst = gst;
    update.total_bill_amount = totalBillAmount;
    update.remaining_amount = remaining_amount;
  }
  next();
});

module.exports = mongoose.model("Booking", bookingSchema);
