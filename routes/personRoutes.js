const express = require("express");
const router = express.Router();
const {
    createPerson,
    getPersons,
    getPersonById,
    updatePerson,
    deletePerson
} = require("../controller/personsCtrl");

// Yangi foydalanuvchi yaratish
router.post("/person", createPerson);

// Barcha foydalanuvchilarni olish
router.get("/person", getPersons);

// ID bo'yicha foydalanuvchini olish
router.get("/person/:id", getPersonById);

// Foydalanuvchini yangilash
router.put("/person/:id", updatePerson);

// Foydalanuvchini o'chirish
router.delete("/person/:id", deletePerson);

module.exports = router;
