const Ajv = require("ajv");
const addFormats = require("ajv-formats");
const ajvErrors = require("ajv-errors");

const ajv = new Ajv({ allErrors: true });
addFormats(ajv);
ajvErrors(ajv);

const personSchema = {
    type: "object",
    properties: {
        firstName: { type: "string", minLength: 1, errorMessage: "Ism maydoni bo'sh bo'lishi mumkin emas." },
        lastName: { type: "string", minLength: 1, errorMessage: "Familiya maydoni bo'sh bo'lishi mumkin emas." },
        middleName: { type: "string" },
        address: { type: "string" },
        dayOfBirth: { type: "string", format: "date", errorMessage: "Tug‘ilgan sana noto‘g‘ri formatda. YYYY-MM-DD formatida bo‘lishi kerak." },
        salaryIsHourly: { type: "number", errorMessage: "Ish haqi soatbay qiymati raqam bo‘lishi kerak." },
        phone: { type: "string", minLength: 10, maxLength: 15, errorMessage: "Telefon raqami 10 dan 15 gacha belgidan iborat bo‘lishi kerak." },
        role: { type: "string", enum: ["admin", "user", "manager"], errorMessage: "Roli faqat quyidagilardan biri bo‘lishi mumkin: 'admin', 'user', 'manager'." }
    },
    required: ["firstName", "lastName", "phone"],
    additionalProperties: false,
    errorMessage: {
        additionalProperties: "Qo‘shimcha maydonlarga ruxsat berilmagan."
    }
};

const validatePerson = ajv.compile(personSchema);

module.exports = (data) => {
    const valid = validatePerson(data);
    return valid ? null : validatePerson.errors;
};

