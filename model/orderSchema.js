const mongoose = require("mongoose");

const MaterialSchema = new mongoose.Schema({
    name: { type: String, required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true }
});

const CustomerSchema = new mongoose.Schema({
    type: { type: String, enum: ["Jismoniy shaxs", "Yuridik shaxs"], required: true },
    fullName: { type: String }, // Faqat jismoniy shaxslar uchun
    phone: { type: String, required: true },
    companyName: { type: String }, // Faqat yuridik shaxslar uchun
    manager: {
        fullName: { type: String },
        position: { type: String }
    },
    director: { type: String },
    inn: { type: Number },
    address: { type: String }
});

const OrderSchema = new mongoose.Schema({
    name: { type: String, required: true },
    budget: { type: Number, required: true },
    paid: { type: Number, required: true },
    date: { type: Date, required: true },
    estimatedDays: { type: Number, required: true },
    dimensions: {
        length: { type: Number, required: true },
        width: { type: Number, required: true },
        height: { type: Number, required: true }
    },
    image: { type: String },
    customer: { type: CustomerSchema, required: true },
    paymentType: { type: String, enum: ["Naqd", "Karta orqali", "Bank orqali"], required: true },
    materials: [MaterialSchema]
}, { timestamps: true });

const Order = mongoose.model("order", OrderSchema);

module.exports = Order;
