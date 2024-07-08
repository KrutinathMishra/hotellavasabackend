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

router.use(express.json());
router.use(cookieParser());

// router.get("/", auth, roomController.getRooms);
// router.post("/", auth, roomController.addRoom);
router
  .route("/")
  .get(auth, roomController.getRooms)
  .post(auth, roomController.addRoom);

router
  .route("/:id")
  .delete(auth, roomController.deleteRoom)
  .put(auth, roomController.updateRoom);

router
  .route("/update_room_status/:id")
  .put(auth, roomController.updateRoomStatus);

module.exports = router;
