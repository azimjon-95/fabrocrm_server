const Order = require("../model/orderSchema");
const response = require("../utils/response"); // Response class'ni import qilamiz
const axios = require("axios");
const FormData = require("form-data");
const sharp = require("sharp");

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
      const data = JSON.parse(JSON.stringify(req.body));
      data.materials = JSON.parse(data.materials);

      if (req.file) {
        const formData = new FormData();
        const processedImage = await sharp(req.file.buffer)
          .resize({ width: 500, height: 500, fit: "cover" }) // 3x4 format
          .jpeg({ quality: 90 }) // Sifatni saqlash
          .toBuffer();

        formData.append("image", processedImage.toString("base64"));

        let api = `${process.env.IMAGE_BB_API_URL}?key=${process.env.IMAGE_BB_API_KEY}`;
        const response = await axios.post(api, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        if (response?.data?.data?.url) {
          data.image = response.data.data.url;
        }
      }

      data.budget = +data.budget;
      data.paid = +data.paid;
      data.estimatedDays = +data.estimatedDays;
      data.dimensions = {
        length: +data.dimensions.length,
        width: +data.dimensions.width,
        height: +data.dimensions.height,
      };
      data.customer.inn = +data.customer.inn;

      const newOrder = await Order.create(data);
      if (!newOrder) return response.error(res, "Buyurtma yaratishda xatolik");
      response.created(res, "Buyurtma muvaffaqiyatli yaratildi", newOrder);
    } catch (error) {
      return response.error(res, "Buyurtma yaratishda xatolik", error);
    }
  }

  // Buyurtmani yangilash
  static async updateOrder(req, res) {
    try {
      const updatedOrder = await Order.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );
      if (!updatedOrder) return response.notFound(res, "Buyurtma topilmadi");
      return response.success(
        res,
        "Buyurtma muvaffaqiyatli yangilandi",
        updatedOrder
      );
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
