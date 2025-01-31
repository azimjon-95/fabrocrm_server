const { Schema, model } = require("mongoose");

const attendanceSchema = new Schema(
  {
    workerId: {
      type: Schema.Types.ObjectId,
      ref: "Worker",
      required: true,
    },
    date: {
      type: String,
      required: true,
      default: new Date().toISOString().slice(0, 10),
    }, // Format: YYYY-MM-DD
    status: {
      type: String,
      enum: ["present", "absent", "late", "on_leave"],
    },
    inTime: { type: String, default: new Date().toISOString().slice(11, 16) }, // Kirish vaqti (HH:mm)
    outTime: { type: String }, // Chiqish vaqti (HH:mm)
    remarks: { type: String }, // Izoh
  },
  {
    timestamps: true,
  }
);

const Attendance = model("Attendance", attendanceSchema);
