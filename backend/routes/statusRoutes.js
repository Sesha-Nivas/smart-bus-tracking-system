const express = require("express");
const router = express.Router();
const db = require("../config/db");


// ============================================================
// START TRIP
// ============================================================

router.post("/start-trip", async (req, res) => {

    try {

        const { bus_id, driver_id } = req.body;

        if (!bus_id) {
            return res.status(400).json({
                error: "bus_id is required"
            });
        }

        // Get bus
        const [busRows] = await db.query(
            `
            SELECT
                bus_id,
                bus_number,
                driver_id,
                college_id,
                status
            FROM buses
            WHERE bus_id = ?
            `,
            [bus_id]
        );

        if (busRows.length === 0) {

            return res.status(404).json({
                error: "Bus not found"
            });

        }

        const bus = busRows[0];

        const old_status = bus.status;

        // Use the driver assigned to this bus
        // if driver_id is not supplied.
        const actualDriverId =
            bus.driver_id || driver_id || null;


        // Update bus status
        await db.query(
            `
            UPDATE buses
            SET status = 'running'
            WHERE bus_id = ?
            `,
            [bus_id]
        );


        // Log status change
        await db.query(
            `
            INSERT INTO bus_status_log
            (
                bus_id,
                driver_id,
                old_status,
                new_status,
                action,
                notes
            )
            VALUES
            (
                ?,
                ?,
                ?,
                'running',
                'TRIP_STARTED',
                'Driver started the trip'
            )
            `,
            [
                bus_id,
                actualDriverId,
                old_status
            ]
        );


        res.json({
            success: true,
            message: "Trip started successfully",
            status: "running",
            bus_id: bus_id
        });

    } catch (error) {

        console.error("START TRIP ERROR:", error);

        res.status(500).json({
            success: false,
            error: error.message
        });

    }

});


// ============================================================
// STOP TRIP
// ============================================================

router.post("/stop-trip", async (req, res) => {

    try {

        const { bus_id, driver_id } = req.body;

        if (!bus_id) {

            return res.status(400).json({
                error: "bus_id is required"
            });

        }


        // Get bus
        const [busRows] = await db.query(
            `
            SELECT
                bus_id,
                driver_id,
                status
            FROM buses
            WHERE bus_id = ?
            `,
            [bus_id]
        );


        if (busRows.length === 0) {

            return res.status(404).json({
                error: "Bus not found"
            });

        }


        const bus = busRows[0];

        const old_status = bus.status;

        const actualDriverId =
            bus.driver_id || driver_id || null;


        // Stop bus
        await db.query(
            `
            UPDATE buses
            SET status = 'stopped'
            WHERE bus_id = ?
            `,
            [bus_id]
        );


        // Log trip ended
        await db.query(
            `
            INSERT INTO bus_status_log
            (
                bus_id,
                driver_id,
                old_status,
                new_status,
                action,
                notes
            )
            VALUES
            (
                ?,
                ?,
                ?,
                'stopped',
                'TRIP_ENDED',
                'Driver stopped the trip'
            )
            `,
            [
                bus_id,
                actualDriverId,
                old_status
            ]
        );


        res.json({
            success: true,
            message: "Trip stopped successfully",
            status: "stopped",
            bus_id: bus_id
        });

    } catch (error) {

        console.error("STOP TRIP ERROR:", error);

        res.status(500).json({
            success: false,
            error: error.message
        });

    }

});


// ============================================================
// GET CURRENT BUS STATUS
// ============================================================

router.get("/bus-status/:busId", async (req, res) => {

    try {

        const { busId } = req.params;


        const [bus] = await db.query(
            `
            SELECT
                bus_id,
                bus_number,
                college_id,
                driver_id,
                status
            FROM buses
            WHERE bus_id = ?
            `,
            [busId]
        );


        if (bus.length === 0) {

            return res.status(404).json({
                error: "Bus not found"
            });

        }


        res.json(bus[0]);

    } catch (error) {

        console.error("BUS STATUS ERROR:", error);

        res.status(500).json({
            error: error.message
        });

    }

});


// ============================================================
// GET BUS STATUS HISTORY
// ============================================================

router.get("/bus-status-history/:busId", async (req, res) => {

    try {

        const { busId } = req.params;


        const [history] = await db.query(
            `
            SELECT
                id,
                bus_id,
                driver_id,
                action,
                old_status,
                new_status,
                timestamp,
                notes
            FROM bus_status_log
            WHERE bus_id = ?
            ORDER BY timestamp DESC
            LIMIT 50
            `,
            [busId]
        );


        res.json(history);

    } catch (error) {

        console.error("STATUS HISTORY ERROR:", error);

        res.status(500).json({
            error: error.message
        });

    }

});


// ============================================================
// DRIVER GPS - UPDATE BUS LOCATION
// ============================================================

router.post("/bus-location", async (req, res) => {

    try {

        const {
            bus_id,
            latitude,
            longitude
        } = req.body;


        // Validate
        if (
            !bus_id ||
            latitude === undefined ||
            longitude === undefined
        ) {

            return res.status(400).json({
                success: false,
                error: "bus_id, latitude and longitude are required"
            });

        }


        const lat = parseFloat(latitude);
        const lng = parseFloat(longitude);


        if (
            Number.isNaN(lat) ||
            Number.isNaN(lng)
        ) {

            return res.status(400).json({
                success: false,
                error: "Invalid latitude or longitude"
            });

        }


        // Check bus
        const [bus] = await db.query(
            `
            SELECT bus_id
            FROM buses
            WHERE bus_id = ?
            `,
            [bus_id]
        );


        if (bus.length === 0) {

            return res.status(404).json({
                success: false,
                error: "Bus not found"
            });

        }


        // Check whether location already exists
        const [existing] = await db.query(
            `
            SELECT location_id
            FROM bus_locations
            WHERE bus_id = ?
            LIMIT 1
            `,
            [bus_id]
        );


        if (existing.length > 0) {

            // Update existing location
            await db.query(
                `
                UPDATE bus_locations
                SET
                    latitude = ?,
                    longitude = ?,
                    updated_at = CURRENT_TIMESTAMP
                WHERE bus_id = ?
                `,
                [
                    lat,
                    lng,
                    bus_id
                ]
            );

        } else {

            // Insert first location
            await db.query(
                `
                INSERT INTO bus_locations
                (
                    bus_id,
                    latitude,
                    longitude
                )
                VALUES (?, ?, ?)
                `,
                [
                    bus_id,
                    lat,
                    lng
                ]
            );

        }


        res.json({
            success: true,
            message: "Bus location updated",
            bus_id: bus_id,
            latitude: lat,
            longitude: lng
        });


    } catch (error) {

        console.error("LOCATION UPDATE ERROR:", error);

        res.status(500).json({
            success: false,
            error: error.message
        });

    }

});


// ============================================================
// GET CURRENT BUS LOCATION
// ============================================================

router.get("/bus-location/:busId", async (req, res) => {

    try {

        const { busId } = req.params;


        const [rows] = await db.query(
            `
            SELECT
                bus_id,
                latitude,
                longitude,
                updated_at
            FROM bus_locations
            WHERE bus_id = ?
            LIMIT 1
            `,
            [busId]
        );


        if (rows.length === 0) {

            return res.json(null);

        }


        res.json(rows[0]);


    } catch (error) {

        console.error("GET LOCATION ERROR:", error);

        res.status(500).json({
            success: false,
            error: error.message
        });

    }

});


// ============================================================
// GET ALL BUSES WITH STATUS
// ADMIN DASHBOARD
// ============================================================

router.get("/all-buses-status", async (req, res) => {

    try {

        const [buses] = await db.query(
            `
            SELECT
                b.bus_id,
                b.bus_number,
                b.college_id,
                c.college_name,
                b.driver_id,
                b.status,
                b.capacity,
                bl.latitude,
                bl.longitude,
                bl.updated_at AS last_location_update
            FROM buses b

            LEFT JOIN colleges c
                ON b.college_id = c.college_id

            LEFT JOIN bus_locations bl
                ON bl.bus_id = b.bus_id

            ORDER BY b.bus_id
            `
        );


        res.json(buses);

    } catch (error) {

        console.error("ALL BUS STATUS ERROR:", error);

        res.status(500).json({
            error: error.message
        });

    }

});


// ============================================================
// ADMIN - UPDATE BUS STATUS
// ============================================================

router.post("/admin/update-bus-status", async (req, res) => {

    try {

        const {
            bus_id,
            new_status,
            admin_id,
            notes
        } = req.body;


        if (
            ![
                "stopped",
                "running",
                "arrived",
                "delayed"
            ].includes(new_status)
        ) {

            return res.status(400).json({
                error: "Invalid status"
            });

        }


        const [bus] = await db.query(
            `
            SELECT status
            FROM buses
            WHERE bus_id = ?
            `,
            [bus_id]
        );


        if (bus.length === 0) {

            return res.status(404).json({
                error: "Bus not found"
            });

        }


        const old_status = bus[0].status;


        await db.query(
            `
            UPDATE buses
            SET status = ?
            WHERE bus_id = ?
            `,
            [
                new_status,
                bus_id
            ]
        );


        /*
         * admin_id is only used here if your
         * bus_status_log.driver_id accepts it.
         */
        await db.query(
            `
            INSERT INTO bus_status_log
            (
                bus_id,
                driver_id,
                old_status,
                new_status,
                action,
                notes
            )
            VALUES
            (
                ?,
                ?,
                ?,
                ?,
                'ADMIN_UPDATE',
                ?
            )
            `,
            [
                bus_id,
                admin_id || null,
                old_status,
                new_status,
                notes || "Admin updated status manually"
            ]
        );


        res.json({
            success: true,
            message: "Bus status updated by admin",
            old_status: old_status,
            new_status: new_status,
            timestamp: new Date()
        });


    } catch (error) {

        console.error("ADMIN STATUS ERROR:", error);

        res.status(500).json({
            error: error.message
        });

    }

});


// ============================================================
// ADMIN - DELETE BUS
// ============================================================

router.delete("/admin/delete-bus/:busId", async (req, res) => {

    try {

        const { busId } = req.params;


        // Delete child records first
        await db.query(
            `
            DELETE FROM bus_locations
            WHERE bus_id = ?
            `,
            [busId]
        );


        await db.query(
            `
            DELETE FROM bus_status_log
            WHERE bus_id = ?
            `,
            [busId]
        );


        await db.query(
            `
            DELETE FROM buses
            WHERE bus_id = ?
            `,
            [busId]
        );


        res.json({
            success: true,
            message: "Bus deleted successfully"
        });


    } catch (error) {

        console.error("DELETE BUS ERROR:", error);

        res.status(500).json({
            error: error.message
        });

    }

});


// ============================================================
// ADMIN - ADD NEW BUS
// ============================================================

router.post("/admin/add-bus", async (req, res) => {

    try {

        const {
            bus_number,
            driver_id,
            college_id,
            capacity
        } = req.body;


        if (
            !bus_number ||
            !driver_id ||
            !college_id
        ) {

            return res.status(400).json({
                error: "bus_number, driver_id and college_id are required"
            });

        }


        await db.query(
            `
            INSERT INTO buses
            (
                bus_number,
                driver_id,
                college_id,
                capacity,
                status
            )
            VALUES
            (
                ?,
                ?,
                ?,
                ?,
                'stopped'
            )
            `,
            [
                bus_number,
                driver_id,
                college_id,
                capacity || 50
            ]
        );


        res.json({
            success: true,
            message: "Bus added successfully"
        });


    } catch (error) {

        console.error("ADD BUS ERROR:", error);

        res.status(500).json({
            error: error.message
        });

    }

});

// =============================
// DRIVER: UPDATE BUS LOCATION
// =============================
router.post("/bus-location", async (req, res) => {

  try {

    const {
      bus_id,
      latitude,
      longitude,
      accuracy,
      speed
    } = req.body;


    // Validate required data
    if (
      !bus_id ||
      latitude === undefined ||
      longitude === undefined
    ) {

      return res.status(400).json({
        success: false,
        error: "Bus ID, latitude and longitude are required"
      });

    }


    // Check whether bus exists
    const [bus] = await db.query(
      "SELECT bus_id, status FROM buses WHERE bus_id = ?",
      [bus_id]
    );


    if (!bus.length) {

      return res.status(404).json({
        success: false,
        error: "Bus not found"
      });

    }


    // Only save location when bus is running
    if (bus[0].status !== "running") {

      return res.status(400).json({
        success: false,
        error: "Bus trip is not running"
      });

    }


    // Save GPS location
    await db.query(
      `
      INSERT INTO bus_locations
      (
        bus_id,
        latitude,
        longitude,
        accuracy,
        speed
      )
      VALUES (?, ?, ?, ?, ?)
      `,
      [
        bus_id,
        latitude,
        longitude,
        accuracy || null,
        speed || null
      ]
    );


    res.json({

      success: true,

      message: "Bus location updated",

      bus_id,

      latitude,

      longitude

    });

  }

  catch (error) {

    console.error(
      "Bus location error:",
      error
    );

    res.status(500).json({

      success: false,

      error: error.message

    });

  }

});

module.exports = router;