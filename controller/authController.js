const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const User = require("../model/User");
const ResponseHandler = require("../utils/responseHandler"); // ResponseHandler-ni import qilish

// **Token yaratish funksiyasi**
const generateToken = (user) => jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
);

// **Foydalanuvchilarni olish**
exports.getUsers = async (req, res) => {
    try {
        const users = await User.find().select("-password");
        ResponseHandler.success(res, "usersList", users);
    } catch (error) {
        ResponseHandler.error(res, "fetchError", ResponseHandler.statusCodes.serverError);
    }
};

// **Ro‘yxatdan o‘tish**
exports.register = async (req, res) => {
    try {
        const { phone, password, firstName, lastName, dayOfBirth, role, salary } = req.body;

        // Telefon raqamidan + ni olib tashlash
        const formattedPhone = phone.replace(/^\+/, "");

        // Telefon raqami mavjudligini tekshirish
        const existingUser = await User.findOne({ phone: formattedPhone });
        if (existingUser) {
            return ResponseHandler.error(res, "userExists");
        }

        // Parolni shifrlash
        const salt = crypto.randomBytes(16).toString("hex");
        const hashedPassword = crypto
            .createHmac("sha256", salt)
            .update(password)
            .digest("hex");

        const newUser = new User({
            firstName,
            lastName,
            dayOfBirth,
            role,
            phone: formattedPhone,
            salary,
            password: `${salt}:${hashedPassword}`,
        });

        await newUser.save();

        ResponseHandler.created(res, "userCreated");
    } catch (error) {
        ResponseHandler.error(res, "userCreateError", ResponseHandler.statusCodes.serverError);
    }
};

// **Tizimga kirish**
exports.login = async (req, res) => {
    try {
        const { phone, password } = req.body;

        // Telefon raqamidan + ni olib tashlash
        const formattedPhone = phone.replace(/^\+/, "");

        const user = await User.findOne({ phone: formattedPhone });
        if (!user) {
            return ResponseHandler.error(res, "loginError", ResponseHandler.statusCodes.unauthorized);
        }

        // Parolni tekshirish
        const [salt, storedHashedPassword] = user.password.split(":");
        const hashedPassword = crypto
            .createHmac("sha256", salt)
            .update(password)
            .digest("hex");

        if (hashedPassword !== storedHashedPassword) {
            return ResponseHandler.error(res, "loginError", ResponseHandler.statusCodes.unauthorized);
        }

        // Token yaratish
        const token = generateToken(user);

        ResponseHandler.success(res, "loginSuccess", { token, user });
    } catch (error) {
        ResponseHandler.error(res, "fetchError", ResponseHandler.statusCodes.serverError);
    }
};
