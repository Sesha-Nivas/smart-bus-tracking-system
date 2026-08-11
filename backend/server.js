const express = require("express");
const cors = require("cors");
require("dotenv").config();

// const collegeRoutes = require("./routes/collegeRoutes");

const app = express();

app.use(cors());
app.use(express.json());

// ============================
// Import routes
// ============================
const authRoutes = require("./routes/authRoutes");
const busRoutes = require("./routes/busRoutes");
const collegeRoutes = require("./routes/collegeRoutes");
const statusRoutes = require("./routes/statusRoutes");

// ============================
// Use routes
// ============================
app.use("/api", authRoutes);
app.use("/api", busRoutes);
app.use("/api", collegeRoutes);
app.use("/api", statusRoutes);

// Root route
app.get("/", (req, res) => {
  res.send("Backend is running");
});

// app.use("/api", collegeRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});