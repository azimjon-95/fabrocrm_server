const mongoose = require("mongoose");

const PersonsSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    midleName: { type: String },
    address: { type: String },
    dayOfBirth: { type: String },
    salaryIsHourly: { type: Number },
    phone: { type: String, required: true },
    role: { type: String, enum: ["accountant", "manager", "director"], default: "director" },
}, { timestamps: true });

const Persons = mongoose.model("persons", PersonsSchema);
module.exports = Persons;
