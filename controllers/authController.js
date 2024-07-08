const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const authController = {
  registerUser: async (req, res) => {
    try {
      const { name, email, password } = req.body;

      // Check if name was entered
      if (!name) {
        return res.json({
          error: "Name is required",
        });
      }

      // Check if password was entered
      if (!password) {
        return res.json({
          error: "Password is required",
        });
      }

      // Check if password is valid
      if (password.length < 6) {
        return res.json({
          error: "Password should be atleast 6 characters long",
        });
      }

      // Check if email was entered
      if (!email) {
        return res.json({
          error: "Email is required",
        });
      }

      //  Check email is unique or not
      const exist = await User.findOne({ email });
      if (exist) {
        return res.json({
          error: "Email is taken already",
        });
      }

      //Password Encryption
      const passwordHash = await bcrypt.hash(password, 10);

      const newUser = new User({
        name,
        email,
        password: passwordHash,
      });

      //Save mongodb
      await newUser.save();

      //create jwt to authenticate
      const accesstoken = createAccessToken({ id: newUser._id });
      const refreshtoken = createRefreshToken({ id: newUser._id });

      res.cookie("refreshtoken", refreshtoken, {
        httpOnly: true,
        path: "/admin/user/refresh_token",
      });

      res.json({ accesstoken });
    } catch (error) {
      console.log(error);
    }
  },

  refreshtoken: async (req, res) => {
    try {
      const rf_token = req.cookies.refreshtoken;

      if (!rf_token) return res.json({ error: "Please Login or Registers" });

      jwt.verify(rf_token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if (err) return res.json({ error: "Please Login or Register" });
        const accesstoken = createAccessToken({ id: user.id });
        res.json({ accesstoken });
      });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  loginUser: async (req, res) => {
    try {
      const { email, password } = req.body;

      // Check if email was entered
      if (!email) {
        return res.json({
          error: "Email is required",
        });
      }

      // Check if password was entered
      if (!password) {
        return res.json({
          error: "Password is required",
        });
      }

      // Check user is available in DB
      const user = await User.findOne({ email });
      if (!user) {
        return res.json({
          error: "User does not exist.",
        });
      }

      // Check if password is valid
      if (password.length < 6) {
        return res.json({
          error: "Password should be atleast 6 characters long",
        });
      }

      // Match the password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.json({
          error: "Incorrect password.",
        });
      }

      const accesstoken = createAccessToken({ id: user._id });
      const refreshtoken = createRefreshToken({ id: user._id });

      res.cookie("refreshtoken", refreshtoken, {
        httpOnly: true,
        path: "/admin/user/refresh_token",
      });

      return res.json({ accesstoken });
    } catch (error) {}
  },

  logout: async (req, res) => {
    try {
      res.clearCookie("refreshtoken", { path: "/user/refresh_token" });
      return res.json({ msg: "Log Out" });
    } catch (err) {
      console.log(err);
    }
  },

  getUser: async (req, res) => {
    try {
      const user = await User.findById(req.user.id).select("-password");

      if (!user) return res.status(400).json({ msg: "User Not Found" });
      res.json(user);
    } catch (err) {
      return res.status(500).json({ msg: err.message });
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
