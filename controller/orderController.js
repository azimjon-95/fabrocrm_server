const Order = require("../model/orderSchema");
const response = require("../utils/response"); // Response class'ni import qilamiz

class OrderController {
    // Barcha buyurtmalarni olish
    static async getOrders(req, res) {
        try {
            const orders = await Order.find();
            return response.success(res, "Buyurtmalar muvaffaqiyatli olindi", orders);
        } catch (error) {
            return response.serverError(res, "Serverda xatolik yuz berdi", error);
        }
    }

    // Bitta buyurtmani olish
    static async getOrderById(req, res) {
        try {
            const order = await Order.findById(req.params.id);
            if (!order) return response.notFound(res, "Buyurtma topilmadi");
            return response.success(res, "Buyurtma muvaffaqiyatli olindi", order);
        } catch (error) {
            return response.serverError(res, "Serverda xatolik yuz berdi", error);
        }
    }

    // Yangi buyurtma qo'shish
    static async createOrder(req, res) {
        try {
            const newOrder = new Order(req.body);
            await newOrder.save();
            return response.created(res, "Buyurtma muvaffaqiyatli yaratildi", newOrder);
        } catch (error) {
            return response.error(res, "Buyurtma yaratishda xatolik", error);
        }
    }

    // Buyurtmani yangilash
    static async updateOrder(req, res) {
        try {
            const updatedOrder = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true });
            if (!updatedOrder) return response.notFound(res, "Buyurtma topilmadi");
            return response.success(res, "Buyurtma muvaffaqiyatli yangilandi", updatedOrder);
        } catch (error) {
            return response.serverError(res, "Serverda xatolik yuz berdi", error);
        }
    }

    // Buyurtmani o‘chirish
    static async deleteOrder(req, res) {
        try {
            const deletedOrder = await Order.findByIdAndDelete(req.params.id);
            if (!deletedOrder) return response.notFound(res, "Buyurtma topilmadi");
            return response.success(res, "Buyurtma muvaffaqiyatli o'chirildi");
        } catch (error) {
            return response.serverError(res, "Serverda xatolik yuz berdi", error);
        }
    }
}

module.exports = OrderController;

