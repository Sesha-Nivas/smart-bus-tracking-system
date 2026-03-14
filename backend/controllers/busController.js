// const db = require("../config/db");
// const getDistance = require("../utils/distance");
// const sendSMS = require("../utils/sendSMS");
// const calculateETA = require("../utils/eta");


// exports.updateLocation = (req, res) => {
//   const { bus_id, latitude, longitude } = req.body;

//   // 1️⃣ Insert new location
//   db.query(
//     "INSERT INTO bus_locations (bus_id, latitude, longitude) VALUES (?, ?, ?)",
//     [bus_id, latitude, longitude],
//     (err, result) => {
//       if (err) return res.status(500).json(err);

//       // 2️⃣ Get bus stop location from database
//       db.query(
//         "SELECT stop_lat, stop_lng FROM stops WHERE bus_id = ?",
//         [bus_id],
//         (err, stops) => {
//           if (err) return res.status(500).json(err);

//           if (stops.length > 0) {
//             const stop = stops[0];

//             // 3️⃣ Calculate distance
//             const distance = getDistance(
//               latitude,
//               longitude,
//               stop.stop_lat,
//               stop.stop_lng
//             );

//             // 4️⃣ If bus is near stop
//             if (distance < 0.5) {
//               const studentPhone = "+91XXXXXXXXXX";

//               sendSMS(studentPhone, "Bus is arriving in 5 minutes");
//             }
//           }

//           res.json({ message: "Location Updated" });
//         }
//       );
//     }
//   );
// };

const db = require("../config/db");

// GET ALL BUSES
exports.getBuses = (req, res) => {
  db.query("SELECT * FROM buses", (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
};

// UPDATE LOCATION
exports.updateLocation = (req, res) => {
  const { bus_id, latitude, longitude } = req.body;

  db.query(
    "INSERT INTO bus_locations (bus_id, latitude, longitude) VALUES (?, ?, ?)",
    [bus_id, latitude, longitude],
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.json({ message: "Location updated" });
    }
  );
};

// GET LATEST LOCATION
exports.getLatestLocation = (req, res) => {
  const busId = req.params.id;

  db.query(
    "SELECT * FROM bus_locations WHERE bus_id = ? ORDER BY timestamp DESC LIMIT 1",
    [busId],
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.json(result[0]);
    }
  );
};