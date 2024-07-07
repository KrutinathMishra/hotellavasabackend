const Room = require("../models/roomModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const roomController = {
  addRoom: async (req, res) => {
    try {
      const { room_number, type, occupied } = req.body;

      // Check if room number was entered
      if (!room_number) {
        return res.json({
          error: "Room Number is required.",
        });
      }

      // Check if room type was entered
      if (!type) {
        return res.json({
          error: "Room Type is required",
        });
      }

      //  Check room is unique or not
      const exist = await Room.findOne({ room_number });
      if (exist) {
        return res.json({
          error: "This room already exists",
        });
      }

      const newRoom = new Room({
        room_number,
        type,
        occupied,
      });
      //Save mongodb
      await newRoom.save();

      res.json({
        msg: "Room added successfully.",
      });
    } catch (error) {
      console.log(error);
    }
  },

  getRooms: async (req, res) => {
    try {
      const rooms = await Room.find();
      res.json(rooms);
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  // getRoom: async (req, res) => {
  //   try {
  //     const roomNumber = parseInt(req.params.id);

  //     const room = await Room.findOne({ room_number: roomNumber });
  //     res.json(room);
  //   } catch (err) {
  //     return res.status(500).json({ msg: err.message });
  //   }
  // },

  deleteRoom: async (req, res) => {
    try {
      const roomNumber = parseInt(req.params.id);

      await Room.findOneAndDelete({ room_number: roomNumber });
      res.json({ msg: "Room deleted successfully." });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  updateRoom: async (req, res) => {
    try {
      const { type, occupied } = req.body;
      const roomNumber = parseInt(req.params.id);

      await Room.findOneAndUpdate(
        { room_number: roomNumber },
        {
          type,
          occupied,
        }
      );

      res.json({ msg: "Updated a Room" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  updateRoomStatus: async (req, res) => {
    try {
      const { occupied } = req.body;
      const roomNumber = parseInt(req.params.id);

      await Room.findOneAndUpdate(
        { room_number: roomNumber },
        {
          occupied,
        }
      );

      res.json({ msg: "Updated a Room Status" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
};

module.exports = roomController;
