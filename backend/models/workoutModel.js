// backend/models/workoutModel.js
const mongoose = require("mongoose");

const workoutSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    load: { type: Number, required: true },
    reps: { type: Number, required: true },
  },
  { timestamps: true } // adds createdAt & updatedAt automatically
);

module.exports = mongoose.model("Workout", workoutSchema);
