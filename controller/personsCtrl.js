const ResponseHandler = require("../utils/responseHandler");
const Persons = require("../model/Persons");
const validatePerson = require("../validation/personValidator");


exports.createPerson = async (req, res) => {
    try {
        // 1. Ma'lumotlarni validatsiya qilish
        const validationErrors = validatePerson(req.body);
        if (validationErrors) {
            return ResponseHandler.error(res, validationErrors, 400);
        }

        const { phone } = req.body;
        const existingPerson = await Persons.findOne({ phone });
        if (existingPerson) return ResponseHandler.error(res, "userExists");

        const newPerson = new Persons(req.body);
        await newPerson.save();

        ResponseHandler.created(res, "userCreated", newPerson);
    } catch (error) {
        ResponseHandler.error(res, "userCreateError", "serverError");
    }
};
exports.getPersons = async (req, res) => {
    try {
        const persons = await Persons.find();
        ResponseHandler.success(res, "usersList", persons);
    } catch (error) {
        ResponseHandler.error(res, "fetchError", "serverError");
    }
};

exports.getPersonById = async (req, res) => {
    try {
        const person = await Persons.findById(req.params.id);
        if (!person) return ResponseHandler.error(res, "userNotFound", "notFound");

        ResponseHandler.success(res, "userFound", person);
    } catch (error) {
        ResponseHandler.error(res, "fetchError", "serverError");
    }
};

exports.updatePerson = async (req, res) => {
    try {
        // 1. Ma'lumotlarni validatsiya qilish
        const validationErrors = validatePerson(req.body);
        if (validationErrors) {
            return ResponseHandler.error(res, validationErrors, 400);
        }

        // 2. Foydalanuvchini yangilash
        const updatedPerson = await Persons.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedPerson) return ResponseHandler.error(res, "userNotFound", "notFound");

        ResponseHandler.success(res, "userUpdated", updatedPerson);
    } catch (error) {
        ResponseHandler.error(res, "fetchError", "serverError");
    }
};


exports.deletePerson = async (req, res) => {
    try {
        const deletedPerson = await Persons.findByIdAndDelete(req.params.id);
        if (!deletedPerson) return ResponseHandler.error(res, "userNotFound", "notFound");

        ResponseHandler.success(res, "userDeleted");
    } catch (error) {
        ResponseHandler.error(res, "fetchError", "serverError");
    }
};


