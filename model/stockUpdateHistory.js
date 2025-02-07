const mongoose = require("mongoose");

const stockUpdateHistorySchema = new mongoose.Schema(
    {
        itemId: { type: mongoose.Schema.Types.ObjectId, ref: "WarehouseItem", required: true }, // Mahsulot ID si
        name: { type: String, required: true }, // Mahsulot nomi
        previousQuantity: { type: Number, default: 0 }, // Eski miqdor
        newQuantity: { type: Number, required: true }, // Yangi miqdor
        quantityAdded: { type: Number, required: true }, // Qo‘shilgan yoki o‘zgartirilgan miqdor
        previousPrice: { type: Number, default: 0 }, // Eski narx
        newPrice: { type: Number, required: true }, // Yangi narx
        action: { type: String, enum: ["new", "update"], required: true }, // "new" yoki "update"
        timestamp: { type: Date, default: Date.now }, // Vaqt
        unit: { type: String },
    }
);

const StockUpdateHistory = mongoose.model("StockUpdateHistory", stockUpdateHistorySchema);
module.exports = StockUpdateHistory;
