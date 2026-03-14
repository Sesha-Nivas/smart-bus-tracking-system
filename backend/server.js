const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

// ============================
// Import routes
// ============================
const authRoutes = require("./routes/authRoutes");
const busRoutes = require("./routes/busRoutes");
const collegeRoutes = require("./routes/collegeRoutes"); // NEW

// ============================
// Use routes
// ============================
app.use("/api", authRoutes);
app.use("/api", busRoutes);
app.use("/api", collegeRoutes); // NEW

// Root route
app.get("/", (req, res) => {
  res.send("Backend is running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});