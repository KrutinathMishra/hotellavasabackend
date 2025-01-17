const express = require("express");
const dotenv = require("dotenv").config();
const { mongoose } = require("mongoose");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const app = express();

// middleware
app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    credentials: true,
    origin: process.env.CLIENT_SIDE_URL,
  })
);

const PORT = process.env.PORT || 8000;

// Database connection
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("Database connected"))
  .catch((err) => console.log("Database not connected", err));

app.use("/admin/user", require("./routes/authRoutes"));
app.use("/admin/room", require("./routes/roomRoutes"));
app.use("/admin/booking", require("./routes/bookingRoutes"));
app.use("/admin/customer", require("./routes/customerRoutes"));

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
