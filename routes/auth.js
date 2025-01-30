const express = require("express");
const { register, login, getUsers } = require("../controller/authController");

const router = express.Router();

router.post("/register", register);
router.post("/signin", login);
router.get("/get/users", getUsers);

module.exports = router;
