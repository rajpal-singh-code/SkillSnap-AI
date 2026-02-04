const express = require("express");
const { connectDB } = require("./config/database");
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const authRouter = require("./routes/authModels");
const chatRoutes = require("./routes/chatRoutes");

const app = express();


app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://skill-snap-ai-4trx.vercel.app",
    ],
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Backend is running 🚀...");
});

app.use("/", authRouter);
app.use("/api/chat", chatRoutes);

const startServer = async () => {
  try {
    await connectDB();
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () =>
      console.log(`Server running on port ${PORT}`)
    );
  } catch (err) {
    console.error("Failed to start server:", err.message);
  }
};

startServer();

module.exports = app;
