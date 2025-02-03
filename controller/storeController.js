const storeDB = require("../model/storeModel");
const response = require("../utils/response");

class StoreController {
  async createStore(req, res) {
    try {
      let store = await storeDB.create(req.body);
      if (!store) return response.error(res, "Mahsulot qo'shilmadi");
      response.created(res, "Mahsulot qo'shildi", store);
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

  async updateStore(req, res) {
    try {
      const store = await storeDB.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
      });
      if (!store) return response.error(res, "Mahsulot yangilashda xatolik");
      response.success(res, "Mahsulot yangilandi", store);
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
