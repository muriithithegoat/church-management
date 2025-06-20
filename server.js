const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const memberRoutes = require("./routes/memberRoutes"); // <- must match your folder name + file name

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// ✅ Register API route
app.use("/api/members", memberRoutes); // <- this is what makes /api/members work

// MongoDB connection
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/churchdb";

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Error:", err));

// Server listen
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
