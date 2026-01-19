const express = require("express");
const {connectDB} = require("./config/database");
const cors = require("cors"); 
const app = express();
const cookieParser = require("cookie-parser");



const authRouter = require("./routes/authModel");
const userRoutes = require("./routes/userRoutes");
const chatRoute = require("./routes/chatRoute")


require("dotenv").config();

app.use(
  cors({
    origin: [
      "https://skill-sprout-j3n9.vercel.app",
      "http://localhost:5173",
    ],
    methods: ["GET", "POST", "PATCH", "DELETE", "PUT", "OPTIONS"],
    credentials: true,
  })
);


app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});


// ✅ Routes
app.use("/", authRouter);
app.use("/", userRoutes);
app.use("/chat", chatRoute);


connectDB().catch(console.error);

module.exports = app;