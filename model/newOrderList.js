const mongoose = require('mongoose');

const materialSchema = new mongoose.Schema({
    productId: { type: String, required: true },
    name: { type: String, required: true },
    category: { type: String, required: true },
    pricePerUnit: { type: Number, required: true },
    quantity: { type: Number, required: true },
    unit: { type: String, required: true },
    supplier: { type: String, required: true }
}, { _id: false });

const orderSchema = new mongoose.Schema({
    totalPrice: { type: Number, required: true, default: 0 },
    materials: [materialSchema],
    isNew: { type: Boolean, default: false },
    sentToAccountant: { type: Boolean, default: false },
    approvedByAccountant: { type: Boolean, default: false },
    addedToData: { type: Boolean, default: false },
    isPaid: { type: Boolean, default: false }
}, {
    timestamps: { currentTime: () => Date.now() + 5 * 60 * 1000 }
});

orderSchema.pre('save', function (next) {
    this.totalPrice = this.materials.reduce((sum, material) => sum + (material.pricePerUnit * material.quantity), 0);
    next();
});

const Orderlist = mongoose.model('Neworderlist', orderSchema);
module.exports = Orderlist;
