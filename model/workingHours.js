const mongoose = require("mongoose");

const workingHours = new mongoose.Schema(
  {
    wages: { type: Number }, // Ish haqqi soat bay
    workingHours: { type: String }, // Ish vaqti
  },
  { timestamps: true }
);

const WorkingHours = mongoose.model("workersHours", workingHours);
module.exports = WorkingHours; 