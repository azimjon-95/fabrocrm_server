const response = require("../utils/response");
const workersDB = require("../model/workersModel");
// const Multer = require("multer");
const FormData = require("form-data");
const axios = require("axios");

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
      const data = JSON.parse(JSON.stringify(req.body));
      let imageUrl = null;

      if (req.file) {
        const formData = new FormData();

        formData.append("image", req.file.buffer.toString("base64"));

        let api = `${process.env.IMAGE_BB_API_URL}?key=${process.env.IMAGE_BB_API_KEY}`;
        const response = await axios.post(api, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        if (response?.data?.data?.url) {
          imageUrl = response.data.data.url;
        }
      }

      data.img = imageUrl;

      const worker = await workersDB.create(data);
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
