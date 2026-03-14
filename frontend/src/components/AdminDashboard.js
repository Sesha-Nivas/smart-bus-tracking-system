import React, { useEffect, useState } from "react";
import API from "../services/api";

function AdminDashboard() {

  const [colleges, setColleges] = useState([]);
  const [selectedCollege, setSelectedCollege] = useState(null);
  const [buses, setBuses] = useState([]);
  const [search, setSearch] = useState("");

  // ==============================
  // Load Colleges
  // ==============================
  useEffect(() => {

    API.get("/colleges")
      .then(res => {
        setColleges(res.data);
      })
      .catch(err => console.error(err));

  }, []);

  // ==============================
  // Load Buses by College
  // ==============================
  useEffect(() => {

    if(selectedCollege){

      API.get(`/buses/${selectedCollege}`)
        .then(res => {
          setBuses(res.data);
        })
        .catch(err => console.error(err));

    }

  }, [selectedCollege]);

  const runningBuses = buses.filter(bus => bus.status === "running").length;
  const stoppedBuses = buses.filter(bus => bus.status === "stopped").length;

  return (

    <div className="container mt-4">

      <h2>Admin Dashboard</h2>

      {/* ===============================
          COLLEGE SELECTION
      =============================== */}

      {!selectedCollege && (

        <div className="card p-3 mt-3">

          <h5>Select College</h5>

          <input
            className="form-control mb-3"
            placeholder="Search college..."
            value={search}
            onChange={(e)=>setSearch(e.target.value)}
          />

          {colleges
            .filter(college =>
              college.college_name.toLowerCase().includes(search.toLowerCase())
            )
            .map(college => (

              <div
                key={college.college_id}
                className="card p-2 mb-2"
                style={{cursor:"pointer"}}
                onClick={()=>setSelectedCollege(college.college_id)}
              >
                {college.college_name}
              </div>

          ))}

        </div>

      )}

      {/* ===============================
          ADMIN STATISTICS
      =============================== */}

      {selectedCollege && (

        <div className="card p-3 mt-3">

          <button
            className="btn btn-secondary mb-3"
            onClick={()=>setSelectedCollege(null)}
          >
            Back
          </button>

          <h5>System Status</h5>

          <p><b>Total Buses:</b> {buses.length}</p>

          <p><b>Running Buses:</b> {runningBuses}</p>

          <p><b>Stopped Buses:</b> {stoppedBuses}</p>

          <hr/>

          <h6>Bus List</h6>

          {buses.map(bus => (

            <div
              key={bus.bus_id}
              className="card p-2 mb-2"
            >
              {bus.bus_number} — {bus.status}
            </div>

          ))}

        </div>

      )}

    </div>

  );

}

export default AdminDashboard;