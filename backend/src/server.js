const express = require("express");
const { connectDB } = require("./config/database");
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const authRouter = require("./routes/authModel");
const userRoutes = require("./routes/userRoutes");
const chatRoute = require("./routes/chatRoute");

const app = express();

app.use(cors({
    origin: [ "http://localhost:5173"],
    methods: ["GET", "POST", "PATCH", "DELETE", "PUT", "OPTIONS"],
    credentials: true,
}));

app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

app.use("/", authRouter);
app.use("/", userRoutes);
app.use("/chat", chatRoute);


const startServer = async () => {
  try {
    await connectDB();
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (err) {
    console.error("Failed to start server:", err.message);
  }
};

startServer();

module.exports = app;