const express = require("express");
const { register, login, getUsers } = require("../controller/authController");

const router = express.Router();

router.post("/register", register);
router.post("/signin", login);
router.get("/getUsers", getUsers);

module.exports = router;
