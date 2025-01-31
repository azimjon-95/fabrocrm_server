const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/auth");
const person = require("./routes/personRoutes");

const app = express();
app.use(express.json());

// CORS optimallashtirilgan sozlamalar
const corsOptions = {
    origin: "*", // Kerakli domenni mana shunday belgilang
    methods: ["GET", "POST", "PUT", "DELETE"], // Faollashtirilgan metodlar
    allowedHeaders: ["Content-Type", "Authorization"], // Kerakli sarlavhalarni qo'shish
    credentials: true, // Agar cookie yoki boshqa autentifikatsiya kerak bo'lsa
};


app.use(cors(corsOptions));

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDBga ulanish muvaffaqiyatli!"))
    .catch((err) => console.log("MongoDB ulanish xatosi:", err));

app.get('/', (req, res) => {
    res.send('Hello World!')
});

app.use("/api", authRoutes);
app.use("/api", person);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server ${PORT}-portda ishlayapti!`));
