const express = require("express");
const router = express.Router();
const db = require("../config/db");

/*
==========================================
LOGIN
==========================================
*/

router.post("/login", async (req, res) => {

    const { email, password } = req.body;

    try {

        const [rows] = await db.query(
            `
            SELECT
                id,
                name,
                email,
                role,
                college_id
            FROM users
            WHERE email = ?
            AND password = ?
            `,
            [email, password]
        );

        if (rows.length === 0) {

            return res.status(401).json({
                success: false,
                message: "Invalid Email or Password"
            });

        }

        const user = rows[0];

        return res.json({

            success: true,

            id: user.id,

            name: user.name,

            role: user.role,

            college_id: user.college_id

        });

    }

    catch (err) {

        console.log(err);

        res.status(500).json({

            success: false,

            error: err.message

        });

    }

});


/*
==========================================
REGISTER
==========================================
*/

router.post("/signup", async (req, res) => {

    const {

        name,

        email,

        password,

        role,

        college_id

    } = req.body;

    try {

        await db.query(

            `
            INSERT INTO users
            (
                name,
                email,
                password,
                role,
                college_id
            )
            VALUES
            (
                ?,?,?,?,?
            )
            `,

            [

                name,

                email,

                password,

                role,

                college_id

            ]

        );

        res.json({

            success: true,

            message: "User Registered"

        });

    }

    catch (err) {

        console.log(err);

        res.status(500).json({

            success: false,

            error: err.message

        });

    }

});

module.exports = router;