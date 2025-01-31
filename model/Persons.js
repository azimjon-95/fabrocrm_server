const mongoose = require("mongoose");

const PersonsSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    middleName: { type: String },
    address: { type: String },
    dayOfBirth: { type: String },
    salaryIsHourly: { type: Number },
    phone: { type: String, required: true, unique: true },
    role: { type: String, enum: ["admin", "user", "manager"], default: "user" },
}, { timestamps: true });

const Persons = mongoose.model("persons", PersonsSchema);
module.exports = Persons;
