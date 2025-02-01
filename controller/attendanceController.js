const AttendanceDB = require("../model/attendanceModel");
const response = require("../utils/response");

class AttendanceController {
  async create(req, res) {
    try {
      const result = await AttendanceDB.create(req.body);

      if (!result) return response.error(res, "Ma'lumot kirishda xatolik");
      return response.success(res, "Saqlandi", result);
    } catch (error) {
      return response.error(res, error.message, error);
    }
  }

  // update outTime
  async update(req, res) {
    try {
      const result = await AttendanceDB.findOneAndUpdate(
        { _id: req.params.id },
        { outTime: req.body.outTime }
      );
      if (!result)
        return response.error(res, "Ma'lumot o'zgartirishda xatolik");
      return response.success(res, "Ma'lumot o'zgartirildi", result);
    } catch (error) {
      return response.error(res, error.message, error);
    }
  }

  async getAll(req, res) {
    try {
      const result = await AttendanceDB.find();
      if (!result) return response.notFound(res, "Ma'lumotlar topilmadi");
      return response.success(res, "Barcha davomatlar", result);
    } catch (error) {
      return response.error(res, error.message, error);
    }
  }

  async getByDate(req, res) {
    try {
      const result = await AttendanceDB.find({ date: req.params.date });
      if (!result) return response.notFound(res, "Ma'lumotlar topilmadi");
      return response.success(res, "Barcha davomatlar", result);
    } catch (error) {
      return response.error(res, error.message, error);
    }
  }

  async getMonthlyAttendance(req, res) {
    try {
      const { year, month } = req.params;
      const startOfMonth = moment(`${year}-${month}-01`)
        .startOf("month")
        .toDate();
      const endOfMonth = moment(startOfMonth).endOf("month").toDate();

      const result = await AttendanceDB.find({
        createdAt: { $gte: startOfMonth, $lt: endOfMonth },
      }).populate("workerId", "fullname");
      if (!result) return response.notFound(res, "Ma'lumotlar topilmadi");
      return response.success(res, "Barcha davomatlar", result);
    } catch (error) {
      return response.error(res, error.message, error);
    }
  }
}

module.exports = new AttendanceController();
