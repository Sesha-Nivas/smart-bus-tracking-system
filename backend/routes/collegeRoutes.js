const express = require("express");
const router = express.Router();
const db = require("../config/db");


// =============================
// Get all colleges
// =============================
router.get("/colleges", async (req, res) => {

  try {

    const [rows] = await db.query(
      "SELECT * FROM colleges ORDER BY college_name ASC"
    );

    res.json(rows);

  } catch (error) {

    console.error(error);
    res.status(500).json({ error: error.message });

  }

});


// =============================
// Add new college
// =============================
router.post("/add-college", async (req, res) => {

  const { college_name } = req.body;

  try {

    await db.query(
      "INSERT INTO colleges (college_name) VALUES (?)",
      [college_name]
    );

    res.json({ message: "College added successfully" });

  } catch (error) {

    console.error(error);
    res.status(500).json({ error: error.message });

  }

});

module.exports = router;