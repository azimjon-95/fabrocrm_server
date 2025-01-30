const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const User = require("../model/User");

const generateToken = (user) => jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "7d" });

//  **Get**
exports.getUsers = async (req, res) => {
    try {
        const users = await User.find().select("-password");
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: "Error fetching users" });
    }
};

// **Ro‘yxatdan o‘tish**
exports.register = async (req, res) => {
    console.log(req.body);
    try {
        const { phone, password } = req.body;

        // Telefon raqamidan + ni olib tashlash
        const formattedPhone = phone.replace(/^\+/, "");

        // Telefon raqami mavjudligini tekshirish
        const existingUser = await User.findOne({ phone: formattedPhone });
        if (existingUser) {
            return res.status(400).json({ error: "Bu telefon raqami allaqachon ro‘yxatdan o‘tgan" });
        }

        // Parolni shifrlash
        const salt = crypto.randomBytes(16).toString("hex"); // Salt yaratish
        const hashedPassword = crypto
            .createHmac("sha256", salt)
            .update(password)
            .digest("hex"); // Parolni shifrlash

        const myData = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            dayOfBirth: req.body.dayOfBirth,
            role: req.body.role,
            phone: formattedPhone,
            salary: req.body.salary,
            password: `${salt}:${hashedPassword}`, // Salt va shifrlangan parolni saqlaymiz
        };

        // Yangi foydalanuvchini yaratish
        const user = new User(myData);
        await user.save();

        res.status(201).json({ message: "Foydalanuvchi yaratildi" });
    } catch (error) {
        res.status(400).json({ error: "Foydalanuvchi yaratishda xatolik" });
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
            return res.status(401).json({ error: "Telefon raqam yoki parol noto‘g‘ri" });
        }

        // Salt va shifrlangan parolni ajratish
        const [salt, storedHashedPassword] = user.password.split(":");

        // Parolni tekshirish
        const hashedPassword = crypto
            .createHmac("sha256", salt)
            .update(password)
            .digest("hex");

        if (hashedPassword !== storedHashedPassword) {
            return res.status(401).json({ error: "Telefon raqam yoki parol noto‘g‘ri" });
        }

        // Token yaratish
        const token = generateToken(user);

        // Javobni qaytarish
        res.json({ token, user });
    } catch (error) {
        res.status(500).json({ error: "Kirishda xatolik" });
    }
};