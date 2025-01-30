require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const authRoutes = require("./routes/auth");

const app = express();
app.use(express.json());

// CORS optimallashtirilgan sozlamalar
const corsOptions = {
    origin: process.env.CORS_ORIGIN || "*", // Kerakli domenni mana shunday belgilang
    methods: ["GET", "POST", "PUT", "DELETE"], // Faollashtirilgan metodlar
    allowedHeaders: ["Content-Type", "Authorization"], // Kerakli sarlavhalarni qo'shish
    credentials: true, // Agar cookie yoki boshqa autentifikatsiya kerak bo'lsa
};

app.get('/', (req, res) => {
    res.send('Hello World!')
});

app.use(cors(corsOptions));

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDBga ulanish muvaffaqiyatli!"))
    .catch((err) => console.log("MongoDB ulanish xatosi:", err));

app.use("/api", authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server ${PORT}-portda ishlayapti!`));
