const storeDB = require("../model/storeModel");
const response = require("../utils/response");
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
}

module.exports = new StoreController();
