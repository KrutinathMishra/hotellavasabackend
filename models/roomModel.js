const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema({
  room_number: {
    type: Number,
    required: true,
    unique: true,
  },
  type: {
    type: String,
    required: true,
  },
  occupied: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model("Room", roomSchema);
