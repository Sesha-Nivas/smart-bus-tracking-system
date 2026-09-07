const express = require("express");
const router = express.Router();
const db = require("../config/db");


// =============================
// Get buses by college
// =============================
router.get("/buses/:collegeId", async (req, res) => {

  const collegeId = req.params.collegeId;

  try {

    const [rows] = await db.query(
      "SELECT * FROM buses WHERE college_id=?",
      [collegeId]
    );

    res.json(rows);

  } catch (error) {

    console.error("Buses Error:", error);
    res.status(500).json({ error: error.message });

  }

});


// =============================
// Get bus for driver
// =============================
router.get("/driver-bus/:driverId", async (req,res)=>{

  const driverId = req.params.driverId;

  try{

    const [rows] = await db.query(
      "SELECT * FROM buses WHERE driver_id=?",
      [driverId]
    );

    res.json(rows[0]);

  }catch(error){

    console.error(error);
    res.status(500).json({error:error.message});

  }

});


// =============================
// Register new bus
// =============================
router.post("/register-bus", async (req,res)=>{

 try{

  const {bus_number, driver_id, college_id} = req.body;

  await db.query(
    "INSERT INTO buses (bus_number,driver_id,college_id,status) VALUES (?,?,?,?)",
    [bus_number,driver_id,college_id,"stopped"]
  );

  res.json({message:"Bus registered"});

 }catch(error){

  console.error(error);
  res.status(500).json({error:error.message});

 }

});


// =============================
// Get latest bus location
// =============================
router.get("/bus-location/:id", async (req, res) => {

  try {

    const busId = req.params.id;

    const [bus] = await db.query(
      "SELECT status FROM buses WHERE bus_id=?",
      [busId]
    );

    if(!bus.length){
      return res.json(null);
    }

    const [rows] = await db.query(
      `SELECT bus_id, latitude, longitude, updated_at
       FROM bus_locations
       WHERE bus_id = ?
       ORDER BY updated_at DESC
       LIMIT 1`,
      [busId]
    );

    if (rows.length === 0) {
      return res.json(null);
    }

    const location = rows[0];

    const busLat = location.latitude;
    const busLng = location.longitude;

    const studentLat = parseFloat(req.query.studentLat);
    const studentLng = parseFloat(req.query.studentLng);

    if (Number.isNaN(studentLat) || Number.isNaN(studentLng)) {
      return res.json({
        latitude: busLat,
        longitude: busLng,
        updated_at: location.updated_at
      });
    }

    const R = 6371;

    const dLat = (busLat - studentLat) * Math.PI / 180;
    const dLng = (busLng - studentLng) * Math.PI / 180;

    const a =
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(studentLat * Math.PI/180) *
      Math.cos(busLat * Math.PI/180) *
      Math.sin(dLng/2) *
      Math.sin(dLng/2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    const distance = R * c;

    const speed = 40;

    const eta = (distance / speed) * 60;

    res.json({
      latitude: busLat,
      longitude: busLng,
      distance,
      eta
    });

  } catch (error) {

    console.error(error);
    res.status(500).json({ error: error.message });

  }

});


// =============================
// Update driver location
// =============================
router.post("/update-location", async (req, res) => {

  try {

    const { bus_id, latitude, longitude } = req.body;

    await db.query(
      `INSERT INTO bus_locations (bus_id, latitude, longitude)
       VALUES (?, ?, ?)`,
      [bus_id, latitude, longitude]
    );

    res.json({ message: "Location updated" });

  } catch (error) {

    console.error(error);
    res.status(500).json({ error: error.message });

  }

});


// =============================
// Start trip
// =============================
router.post("/start-trip/:busId", async (req, res) => {

  try{

    const busId = req.params.busId;

    await db.query(
      "DELETE FROM bus_locations WHERE bus_id=?",
      [busId]
    );

    await db.query(
      "UPDATE buses SET status='running' WHERE bus_id=?",
      [busId]
    );

    res.json({ message: "Trip started" });

  }catch(error){

    console.error(error);
    res.status(500).json({error:error.message});

  }

});


// =============================
// End trip
// =============================
router.post("/end-trip/:busId", async (req, res) => {

  try{

    const busId = req.params.busId;

    await db.query(
      "UPDATE buses SET status='stopped' WHERE bus_id=?",
      [busId]
    );

    res.json({ message: "Trip ended" });

  }catch(error){

    console.error(error);
    res.status(500).json({error:error.message});

  }

});

module.exports = router;