const Ajv = require("ajv");
const ajv = new Ajv({ allErrors: true });
require("ajv-errors")(ajv);
require("ajv-formats")(ajv);
const response = require("../utils/response");

const attendanceValidation = (req, res, next) => {
  const schema = {
    type: "object",
    properties: {
      workerId: { type: "string", format: "objectId" },
      date: { type: "string", format: "date" },
      status: {
        type: "string",
        enum: ["present", "absent", "late", "on_leave"],
      },
      inTime: { type: "string", format: "time" },
      outTime: { type: "string", format: "time" },
      remarks: { type: "string" },
    },
    required: ["workerId", "date", "status"],
    additionalProperties: false,
    errorMessage: {
      required: {
        workerId: "Ishchi id kiritilmadi",
        date: "Sana tanlanmadi",
        status: "Status kiritilmadi",
        inTime: "Kirish vaqti kiritilmadi",
        outTime: "Chiqish vaqti kiritilmadi",
      },
      properties: {
        workerId: "Ishchi id noto‘g‘ri formatda",
        date: "Sana noto‘g‘ri formatda",
        status: "Status noto‘g‘ri formatda",
        inTime: "Kirish vaqti noto‘g‘ri formatda",
      },
    },
  };
  const validate = ajv.compile(schema);
  const result = validate(req.body);
  if (!result) {
    return response.error(
      res,
      "Tasdiqlashda xatolik",
      validate.errors[0].message
    );
  }
  next();
};

module.exports = attendanceValidation;
