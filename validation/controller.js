const Ajv = require("ajv");
const addFormats = require("ajv-formats");
const ajvErrors = require("ajv-errors");

const ajv = new Ajv({ allErrors: true });
addFormats(ajv, ["date"]);
ajvErrors(ajv);

// Validatsiya sxemalari
const schemas = {
    register: {
        type: "object",
        properties: {
            firstName: { type: "string", minLength: 2, maxLength: 50 },
            lastName: { type: "string", minLength: 2, maxLength: 50 },
            dayOfBirth: { type: "string", format: "date", errorMessage: "Tug‘ilgan sana noto‘g‘ri formatda" },
            phone: {
                type: "string",
                pattern: "^998\\d{9}$",
                errorMessage: "Telefon raqam 998 bilan boshlanishi va jami 12 ta raqam bo‘lishi kerak"
            },
            password: { type: "string", minLength: 6, errorMessage: "Parol kamida 6 ta belgidan iborat bo‘lishi kerak" },
            role: {
                type: "string",
                enum: ["accountant", "manager", "director"],
                errorMessage: "Role faqat 'accountant', 'manager' yoki 'director' bo‘lishi mumkin"
            },
            salary: { type: "number", minimum: 0, errorMessage: "Maosh manfiy bo‘lishi mumkin emas" }
        },
        required: ["firstName", "lastName", "phone", "password", "role"],
        additionalProperties: false,
        errorMessage: {
            required: {
                firstName: "Ism majburiy maydon",
                lastName: "Familiya majburiy maydon",
                phone: "Telefon raqam majburiy",
                password: "Parol majburiy",
                role: "Role majburiy"
            },
            additionalProperties: "Noto‘g‘ri maydon kiritildi"
        }
    },

    login: {
        type: "object",
        properties: {
            phone: {
                type: "string",
                pattern: "^998\\d{9}$",
                errorMessage: "Telefon raqam 998 bilan boshlanishi va jami 12 ta raqam bo‘lishi kerak"
            },
            password: { type: "string", minLength: 6, errorMessage: "Parol kamida 6 ta belgidan iborat bo‘lishi kerak" }
        },
        required: ["phone", "password"],
        additionalProperties: false,
        errorMessage: {
            required: {
                phone: "Telefon raqam majburiy",
                password: "Parol majburiy"
            },
            additionalProperties: "Noto‘g‘ri maydon kiritildi"
        }
    }
};

// Middleware sifatida validatsiya qilish
const validate = (schemaName) => (req, res, next) => {
    const validate = ajv.compile(schemas[schemaName]);
    const valid = validate(req.body);

    if (!valid) {
        return res.status(400).json({ errors: validate.errors.map(err => err.message) });
    }

    next(); // Keyingi middleware yoki controller funksiyasiga o'tkazish
};

module.exports = validate;
