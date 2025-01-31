const express = require("express");
const { register, login, getUsers } = require("../controller/authController");
const validate = require("../validation/controller");

const router = express.Router();

router.post("/register", validate('register'), register);
router.post("/signin", validate('login'), login);
router.get("/getUsers", getUsers);

module.exports = router;


