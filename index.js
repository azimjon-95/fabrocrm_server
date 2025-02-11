require("dotenv").config();
const express = require("express");
const { connect } = require("mongoose");
const cors = require("cors");

const router = require("./routes/router");
const authMiddleware = require("./middleware/AuthMiddleware");

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const corsOptions = {
  // origin: ["http://localhost:3000", "http://localhost:3001"],
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
};

app.use(cors(corsOptions));

connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDBga ulanish muvaffaqiyatli! ✅✅✅"))
  .catch((err) => console.log("MongoDB ulanish xatosi:,🛑🛑🛑", err));

app.get("/", (req, res) => res.send("Salom dunyo"));

app.use("/api", authMiddleware, router);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`http://localhost:${PORT}`));
