const express = require("express");
const router = express.Router();
const db = require("../config/db");

// =====================================
// Get All Colleges
// =====================================
router.get("/colleges", async (req, res) => {

    try {

        const [rows] = await db.query(`
            SELECT
                college_id,
                college_name,
                college_code,
                city,
                state,
                status
            FROM colleges
            ORDER BY college_name ASC
        `);

        res.json(rows);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            error: error.message
        });

    }

});

// =====================================
// Add College
// =====================================
router.post("/add-college", async (req, res) => {

    const {
        college_name,
        college_code,
        address,
        city,
        state,
        contact_email,
        contact_phone
    } = req.body;

    try {

        await db.query(

            `
            INSERT INTO colleges
            (
                college_name,
                college_code,
                address,
                city,
                state,
                contact_email,
                contact_phone,
                status
            )
            VALUES
            (
                ?,?,?,?,?,?,?,?
            )
            `,

            [
                college_name,
                college_code,
                address,
                city,
                state,
                contact_email,
                contact_phone,
                "ACTIVE"
            ]

        );

        res.json({
            success: true,
            message: "College Added Successfully"
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            error: error.message
        });

    }

});

// =====================================
// Delete College
// =====================================
router.delete("/delete-college/:id", async (req, res) => {

    try {

        await db.query(
            "DELETE FROM colleges WHERE college_id=?",
            [req.params.id]
        );

        res.json({
            success: true,
            message: "College Deleted"
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            error: error.message
        });

    }

});

// =====================================
// Update College
// =====================================
router.put("/update-college/:id", async (req, res) => {

    const {
        college_name,
        city,
        state
    } = req.body;

    try {

        await db.query(

            `
            UPDATE colleges
            SET
                college_name=?,
                city=?,
                state=?
            WHERE college_id=?
            `,

            [
                college_name,
                city,
                state,
                req.params.id
            ]

        );

        res.json({
            success: true,
            message: "College Updated"
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            error: error.message
        });

    }

});

module.exports = router;