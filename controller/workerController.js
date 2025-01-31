const response = require("../utils/response");
const workersDB = require("../model/workersModel");

class WorkerController {
  async getWorkers(req, res) {
    try {
      const workers = await workersDB.find();
      if (!workers.length) return response.notFound(res, "ishchilar topilmadi");
      response.success(res, "Barcha ishchilar", workers);
    } catch (err) {
      response.serverError(res, err.message, err);
    }
  }

  async createWorker(req, res) {
    try {
      const worker = await workersDB.create(req.body);
      if (!worker) return response.error(res, "Ishchi qo'shilmadi");
      response.created(res, "Ishchi yaratildi", worker);
    } catch (err) {
      response.serverError(res, err.message, err);
    }
  }

  async deleteWorker(req, res) {
    try {
      const worker = await workersDB.findByIdAndDelete(req.params.id);
      if (!worker) return response.error(res, "Ishchi o'chirilmadi");
      response.success(res, "Ishchi o'chirildi");
    } catch (err) {
      response.serverError(res, err.message, err);
    }
  }

  async updateWorker(req, res) {
    try {
      const worker = await workersDB.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true,
        }
      );
      if (!worker) return response.error(res, "Ishchi yangilashda xatolik");
      response.success(res, "Ishchi yangilandi", worker);
    } catch (err) {
      response.serverError(res, err.message, err);
    }
  }
}

module.exports = new WorkerController();
