const express = require("express");
const router = express.Router();
const cors = require("cors");
const dotenv = require("dotenv").config();
const roomController = require("../controllers/roomController");
const auth = require("../middleware/auth");

// middleware
router.use(
  cors({
    credentials: true,
    origin: process.env.CLIENT_SIDE_URL,
  })
);

router.get("/", auth, roomController.getRooms);
// router
//   .route("/")
//   .get(auth, roomController.getRooms)
//   .post(roomController.addRoom);

router
  .route("/:id")
  .delete(roomController.deleteRoom)
  .put(roomController.updateRoom);

router.route("/update_room_status/:id").put(roomController.updateRoomStatus);

module.exports = router;
