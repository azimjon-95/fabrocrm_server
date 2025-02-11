const storeDB = require("../model/storeModel");
const response = require("../utils/response");
const mongoose = require('mongoose')
const StockUpdateHistory = require("../model/stockUpdateHistory");

class StoreController {
  async createStore(req, res) {
    try {
      const data = req.body;
      const store = await storeDB.create({
        name: data.name,
        category: data.category,
        quantity: data.quantity,
        pricePerUnit: data.pricePerUnit,
        unit: data.unit,
        supplier: data.supplier,
      });

      if (!store) return response.error(res, "Mahsulot qo'shilmadi");

      // 📝 Tarixga qo'shish
      await StockUpdateHistory.create({
        itemId: store._id,
        name: store.name,
        previousQuantity: 0,
        newQuantity: store.quantity,
        quantityAdded: store.quantity,
        previousPrice: 0,
        newPrice: store.pricePerUnit,
        unit: store.unit,
        action: "new",
        timestamp: new Date(),
      });

      response.created(res, "Mahsulot qo'shildi", store);
    } catch (err) {
      response.serverError(res, err.message, err);
    }
  }

  async updateStore(req, res) {
    try {
      const { id } = req.params;
      const data = req.body;

      let store = await storeDB.findById(id);
      if (!store) return response.error(res, "Mahsulot topilmadi");

      // Eski miqdor va narxni saqlaymiz
      const previousQuantity = store.quantity;
      const previousPrice = store.pricePerUnit;

      // Yangi ma'lumotlar bilan yangilash
      store.quantity += data.quantity || 0;
      store.name = data.name || store.name;
      store.category = data.category || store.category;
      store.pricePerUnit = data.pricePerUnit || store.pricePerUnit;
      store.unit = data.unit || store.unit;
      store.supplier = data.supplier || store.supplier;
      await store.save();

      // 📝 Tarixga yozamiz
      await StockUpdateHistory.create({
        itemId: store._id,
        name: store.name,
        previousQuantity,
        newQuantity: store.quantity,
        quantityAdded: data.quantity || 0,
        previousPrice,
        newPrice: store.pricePerUnit,
        action: "update",
        timestamp: new Date(),
        unit: store.unit,
      });

      response.success(res, "Mahsulot yangilandi", store);
    } catch (err) {
      response.serverError(res, err.message, err);
    }
  }

  async getStockHistory(req, res) {
    try {
      let store = await StockUpdateHistory.find();
      if (!store) return response.notFound(res, "Mahsulotlar Tarixi topilmadi");
      response.success(res, "Mahsulotlar Tarixi topildi", store);
    } catch (err) {
      response.serverError(res, err.message, err);
    }
  }

  async getStore(req, res) {
    try {
      let store = await storeDB.find();
      if (!store) return response.notFound(res, "Mahsulotlar topilmadi");
      response.success(res, "Mahsulotlar topildi", store);
    } catch (err) {
      response.serverError(res, err.message, err);
    }
  }


  async deleteStore(req, res) {
    try {
      const store = await storeDB.findByIdAndDelete(req.params.id);
      if (!store) return response.error(res, "Mahsulot o'chirilishda xatolik");
      response.success(res, "Mahsulot o'chirildi", store);
    } catch (err) {
      response.serverError(res, err.message, err);
    }
  }

  async getStoreByCategory(req, res) {
    try {
      let store = await storeDB.find({ category: req.params.category });
      if (!store) return response.notFound(res, "Mahsulotlar topilmadi");
      response.success(res, "Mahsulotlar topildi", store);
    } catch (err) {
      response.serverError(res, err.message, err);
    }
  }

  async decrementQuantity(req, res) {
    try {
      const store = await storeDB.findByIdAndUpdate(req.params.id, {
        $inc: { quantity: -1 },
      });
      if (!store) return response.notFound(res, "Mahsulot topilmadi");
      response.success(res, "Mahsulot omborda ayirildi", store);
    } catch (err) {
      response.serverError(res, err.message, err);
    }
  }

  // 4454
  async storeUpdateMany(req, res) {
    try {
      const updates = req.body; // array keladi

      if (!Array.isArray(updates) || updates.length === 0) {
        return response.error(res, "Yangilash uchun mahsulotlar yo‘q!");
      }

      for (const data of updates) {
        // // productId ni tekshirish
        // if (!mongoose.Types.ObjectId.isValid(data.productId)) {
        //   console.log(`❌ Noto‘g‘ri ID formati: ${data.productId}`);
        // }

        // Mahsulotni bazadan qidirish
        let store = await storeDB.findById(data.productId);

        if (store) {
          // 🔄 Agar mahsulot bo‘lsa, quantity ni qo‘shish
          store.quantity += data.quantity || 0;
          store.name = data.name || store.name;
          store.category = data.category || store.category;
          store.pricePerUnit = data.pricePerUnit || store.pricePerUnit;
          store.unit = data.unit || store.unit;
          store.supplier = data.supplier || store.supplier;
          await store.save();
        } else {
          // 🆕 Agar mahsulot yo‘q bo‘lsa, yangisini yaratish
          console.log(data);
          await storeDB.create({
            name: data.name,
            category: data.category,
            quantity: data.quantity,
            pricePerUnit: data.pricePerUnit,
            unit: data.unit,
            supplier: data.supplier,
          });
        }
      }

      response.success(res, "Mahsulotlar omborga kirib qo‘shildi!");
    } catch (err) {
      response.serverError(res, err.message, err);
    }
  }


  // async storeUpdateMany(updates) {
  //   for (const data of updates) {
  //     // productId ni tekshirish
  //     if (!mongoose.Types.ObjectId.isValid(data.productId)) {
  //       console.log(`❌ Noto‘g‘ri ID formati: ${data.productId}`);

  //       // Yangi ObjectId generatsiya qilish
  //       const newProduct = new Product({
  //         _id: new mongoose.Types.ObjectId(),
  //         name: data.name,
  //         category: data.category,
  //         pricePerUnit: data.pricePerUnit,
  //         quantity: data.quantity,
  //         unit: data.unit,
  //         supplier: data.supplier,
  //       });

  //       await newProduct.save();
  //       console.log(`✅ Yangi mahsulot yaratildi: ${newProduct.name}`);
  //       continue;
  //     }

  //     // Mavjud bo‘lsa, quantity ni yangilash
  //     const existingProduct = await Product.findOne({ _id: data.productId });

  //     if (existingProduct) {
  //       existingProduct.quantity += data.quantity;
  //       await existingProduct.save();
  //       console.log(`🔄 Yangilandi: ${existingProduct.name}, Yangi miqdor: ${existingProduct.quantity}`);
  //     } else {
  //       // Agar mavjud bo‘lmasa, yangi mahsulot yaratish
  //       const newProduct = new Product({
  //         _id: data.productId, // Valid bo‘lsa oldingi ID ishlatiladi
  //         name: data.name,
  //         category: data.category,
  //         pricePerUnit: data.pricePerUnit,
  //         quantity: data.quantity,
  //         unit: data.unit,
  //         supplier: data.supplier,
  //       });

  //       await newProduct.save();
  //       console.log(`✅ Yangi mahsulot yaratildi: ${newProduct.name}`);
  //     }
  //   }
  // }
}

module.exports = new StoreController();
