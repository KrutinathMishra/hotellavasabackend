const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const authController = {
  registerUser: async (req, res) => {
    try {
      const { name, email, password } = req.body;

      if (!name || !password || !email) {
        return res
          .status(400)
          .json({ error: "Name, Email, and Password are required" });
      }

      if (password.length < 6) {
        return res
          .status(400)
          .json({ error: "Password should be at least 6 characters long" });
      }

      const exist = await User.findOne({ email });
      if (exist) {
        return res.status(400).json({ error: "Email is already taken" });
      }

      const passwordHash = await bcrypt.hash(password, 10);
      const newUser = new User({ name, email, password: passwordHash });
      await newUser.save();

      const accesstoken = createAccessToken({ id: newUser._id });
      const refreshtoken = createRefreshToken({ id: newUser._id });

      res.cookie("refreshtoken", refreshtoken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // Use secure cookies in production
        path: "/admin/user/refresh_token",
      });

      res.json({ accesstoken });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },

  refreshtoken: async (req, res) => {
    try {
      const rf_token = req.cookies.refreshtoken;
      if (!rf_token)
        return res.status(401).json({ error: "Please Login or Register" });

      jwt.verify(rf_token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if (err)
          return res.status(403).json({ error: "Invalid Refresh Token" });

        const accesstoken = createAccessToken({ id: user.id });
        res.json({ accesstoken });
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },

  loginUser: async (req, res) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res
          .status(400)
          .json({ error: "Email and Password are required" });
      }

      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ error: "User does not exist." });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ error: "Incorrect password." });
      }

      const accesstoken = createAccessToken({ id: user._id });
      const refreshtoken = createRefreshToken({ id: user._id });

      res.cookie("refreshtoken", refreshtoken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // Use secure cookies in production
        path: "/admin/user/refresh_token",
      });

      res.json({ accesstoken });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },

  logout: async (req, res) => {
    try {
      res.clearCookie("refreshtoken", {
        path: "/admin/user/refresh_token",
        secure: process.env.NODE_ENV === "production", // Use secure cookies in production
      });
      res.json({ msg: "Logged Out" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },

  getUser: async (req, res) => {
    try {
      const user = await User.findById(req.user.id).select("-password");
      if (!user) return res.status(400).json({ msg: "User Not Found" });
      res.json(user);
    } catch (err) {
      console.error(err);
      res.status(500).json({ msg: "Internal Server Error" });
    }
  },
};

const createAccessToken = (payload) => {
  return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "1d",
  });
};

const createRefreshToken = (payload) => {
  return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "7d",
  });
};

module.exports = authController;
