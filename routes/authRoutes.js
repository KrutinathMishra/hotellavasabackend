const express = require("express");
const router = express.Router();
const dotenv = require("dotenv").config();
const cors = require("cors");
const authController = require("../controllers/authController");
const auth = require("../middleware/auth");

// middleware
router.use(
  cors({
    credentials: true,
    origin: process.env.CLIENT_SIDE_URL,
  })
);

router.post("/register", authController.registerUser);
router.post("/login", authController.loginUser);
router.get("/logout", authController.logout);
router.get("/refresh_token", authController.refreshtoken);
router.get("/infor", auth, authController.getUser);

module.exports = router;
