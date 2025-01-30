const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    dayOfBirth: { type: String },
    salary: { type: Number },
    phone: {
        type: String,
        required: true,
        unique: true,
        match: /^998\d{9}$/  // faqat 998 bilan boshlanadigan telefon raqamiga mos keladigan format
    },
    password: { type: String, required: true },
    role: { type: String, enum: ["accountant", "manager", "director"], default: "director" },
}, { timestamps: true });

const User = mongoose.model("User", userSchema);
module.exports = User;
