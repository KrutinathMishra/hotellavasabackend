const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema({
  customer_id: {
    type: String,
    required: true,
  },
  first_name: {
    type: String,
    required: true,
  },
  middle_name: {
    type: String,
    default: "",
  },
  last_name: {
    type: String,
    required: true,
  },
  customer_email: {
    type: String,
    default: "",
  },
  phone_no: {
    type: String,
    default: "",
  },
  dob: {
    type: String,
    default: "",
  },
});

module.exports = mongoose.model("Customer", customerSchema);
