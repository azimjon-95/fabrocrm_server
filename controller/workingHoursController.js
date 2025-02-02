const WorkingHours = require("../model/workingHours");
const Response = require("../utils/response");

class WorkingHoursController {
    // 1. Create (Yaratish)
    async createWorkingHours(req, res) {
        try {
            const { wages, workingHours } = req.body;

            // Avvalgi ma'lumotlarni tekshirish
            const existingWorkingHours = await WorkingHours.findOne();
            if (existingWorkingHours) {
                return Response.badRequest(res, "Working hours already exist. Use update instead.");
            }

            const newWorkingHours = new WorkingHours({ wages, workingHours });
            await newWorkingHours.save();
            Response.created(res, "Working hours created successfully", newWorkingHours);
        } catch (error) {
            Response.serverError(res, error.message);
        }
    }

    // 2. Read (Barcha ma'lumotlarni o'qish)
    async getAllWorkingHours(req, res) {
        try {
            const workingHours = await WorkingHours.find();
            Response.success(res, "Working hours fetched successfully", workingHours);
        } catch (error) {
            Response.serverError(res, error.message);
        }
    }

    // 3. Read (ID bo'yicha ma'lumot o'qish)
    async getWorkingHoursById(req, res) {
        try {
            const { id } = req.params;
            const workingHours = await WorkingHours.findById(id);
            if (!workingHours) {
                return Response.notFound(res, "Working hours not found");
            }
            Response.success(res, "Working hours fetched successfully", workingHours);
        } catch (error) {
            Response.serverError(res, error.message);
        }
    }

    // 4. Update (Yangilash)
    async updateWorkingHours(req, res) {
        try {
            const { id } = req.params;
            const { wages, workingHours } = req.body;
            const updatedWorkingHours = await WorkingHours.findByIdAndUpdate(
                id,
                { wages, workingHours },
                { new: true }
            );
            if (!updatedWorkingHours) {
                return Response.notFound(res, "Working hours not found");
            }
            Response.success(res, "Working hours updated successfully", updatedWorkingHours);
        } catch (error) {
            Response.serverError(res, error.message);
        }
    }

    // 5. Delete (O'chirish)
    async deleteWorkingHours(req, res) {
        try {
            const { id } = req.params;
            const deletedWorkingHours = await WorkingHours.findByIdAndDelete(id);
            if (!deletedWorkingHours) {
                return Response.notFound(res, "Working hours not found");
            }
            Response.success(res, "Working hours deleted successfully");
        } catch (error) {
            Response.serverError(res, error.message);
        }
    }
}

module.exports = new WorkingHoursController();
