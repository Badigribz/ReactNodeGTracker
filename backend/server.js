// backend/server.js
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();
const workoutRoutes = require("./routes/workoutRoutes");

const app = express();



app.use(cors());
app.use(express.json());
app.use("/api/workouts", workoutRoutes);

// show incoming requests in console (helpful for debugging)
app.use((req, res, next) => {
  console.log("→", req.method, req.path, "body:", req.body);
  next();
});

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ Connected to MongoDB");
    app.listen(process.env.PORT, () => {
      console.log(`🚀 Server running on port ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
  });

// simple test route
app.get("/", (req, res) => {
  res.send("🔥 Backend is running!");
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
