import React, { useState, useEffect, useRef } from "react";
import API from "../services/api";
import MapComponent from "./MapComponent";

function DriverDashboard() {

  const [mode, setMode] = useState(null);
  const [buses, setBuses] = useState([]);
  const [search, setSearch] = useState("");
  const [busNumber, setBusNumber] = useState("");
  const [driverName, setDriverName] = useState("");
  const [selectedBus, setSelectedBus] = useState(null);

  const [started, setStarted] = useState(false);
  const [location, setLocation] = useState(null);

  const [colleges, setColleges] = useState([]);
  const [selectedCollege, setSelectedCollege] = useState(null);

  const watchId = useRef(null);

  const driverId = localStorage.getItem("userId");

  // ==============================
  // Load colleges
  // ==============================
  useEffect(() => {

    API.get("/colleges")
      .then(res => {
        setColleges(res.data);
      })
      .catch(err => console.error(err));

  }, []);


  // ==============================
  // Fetch buses by college
  // ==============================
  useEffect(() => {

    if(mode === "registered" && selectedCollege){

      API.get(`/buses/${selectedCollege}`)
        .then(res=>{
          setBuses(res.data);
        })
        .catch(err=>console.error(err));

    }

  },[mode, selectedCollege]);


  // ==============================
  // Register new bus
  // ==============================
  const registerBus = () => {

    API.post("/register-bus",{
      bus_number:busNumber,
      driver_name:driverName,
      driver_id:driverId,
      college_id:selectedCollege
    })
    .then(res=>{
      alert("Bus registered successfully");
      setMode("registered");
    })
    .catch(err=>console.error(err));

  };


  // ==============================
  // Start Trip
  // ==============================
  const startTrip = async () => {

    if(!selectedBus){
      alert("Select a bus first");
      return;
    }

    if(!navigator.geolocation){
      alert("Geolocation is not supported by your browser");
      return;
    }

    await API.post(`/start-trip/${selectedBus.bus_id}`);

    setStarted(true);

    watchId.current = navigator.geolocation.watchPosition(

      (position)=>{

        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        setLocation({
          latitude:lat,
          longitude:lng
        });

        API.post("/update-location",{
          bus_id:selectedBus.bus_id,
          latitude:lat,
          longitude:lng
        });

      },

      (error)=>{

        alert("Please enable location to start trip");
        console.error(error);

      },

      {
        enableHighAccuracy:true,
        maximumAge:0,
        timeout:10000
      }

    );

  };


  // ==============================
  // End Trip
  // ==============================
  const endTrip = async () => {

    if(!selectedBus) return;

    await API.post(`/end-trip/${selectedBus.bus_id}`);

    if(watchId.current){
      navigator.geolocation.clearWatch(watchId.current);
    }

    setStarted(false);
    setLocation(null);
    setSelectedBus(null);
    setMode(null);

    alert("Trip ended. Location tracking stopped.");

  };


  // ==============================
  // Search filter
  // ==============================
  const filteredBuses = buses.filter(bus =>
    bus.bus_number.toLowerCase().includes(search.toLowerCase())
  );


  return (

    <div className="container mt-4">

      <h2>Driver Dashboard</h2>

      {/* ===============================
          COLLEGE SELECTION PAGE
      =============================== */}

      {!selectedCollege && (

        <div className="mt-4">

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
          DRIVER OPTIONS
      =============================== */}

      {selectedCollege && !mode && (

        <>
          <button
            className="btn btn-secondary mb-3"
            onClick={()=>setSelectedCollege(null)}
          >
            Back
          </button>

          <button
            className="btn btn-primary me-3"
            onClick={()=>setMode("registered")}
          >
            Bus already registered
          </button>

          <button
            className="btn btn-success"
            onClick={()=>setMode("new")}
          >
            New bus appointing now
          </button>
        </>

      )}


      {/* ===============================
          REGISTERED BUS PAGE
      =============================== */}

      {mode === "registered" && !selectedBus && (

        <div className="mt-4">

          <button
            className="btn btn-secondary mb-3"
            onClick={()=>setMode(null)}
          >
            Back
          </button>

          <input
            className="form-control mb-3"
            placeholder="Search bus number..."
            value={search}
            onChange={(e)=>setSearch(e.target.value)}
          />

          {filteredBuses.map(bus=>(

            <div
              key={bus.bus_id}
              className="card p-2 mb-2"
              style={{cursor:"pointer"}}
              onClick={()=>setSelectedBus(bus)}
            >
              {bus.bus_number}
            </div>

          ))}

        </div>

      )}


      {/* ===============================
          BUS SELECTED
      =============================== */}

      {selectedBus && !started && (

        <div className="mt-4">

          <button
            className="btn btn-secondary mb-3"
            onClick={()=>setSelectedBus(null)}
          >
            Back
          </button>

          <h4>Your Bus: {selectedBus.bus_number}</h4>

          <button
            className="btn btn-success"
            onClick={startTrip}
          >
            Start Trip
          </button>

        </div>

      )}


      {/* ===============================
          TRIP RUNNING
      =============================== */}

      {started && location && (

        <div className="mt-4">

          <h4 className="text-success">Trip is running 🚍</h4>

          <button
            className="btn btn-danger mb-3"
            onClick={endTrip}
          >
            End Trip
          </button>

          <MapComponent
            lat={location.latitude}
            lng={location.longitude}
          />

        </div>

      )}


      {/* ===============================
          NEW BUS PAGE
      =============================== */}

      {mode === "new" && (

        <div className="mt-4">

          <button
            className="btn btn-secondary mb-3"
            onClick={()=>setMode(null)}
          >
            Back
          </button>

          <input
            className="form-control mb-3"
            placeholder="Enter Bus Number"
            value={busNumber}
            onChange={(e)=>setBusNumber(e.target.value)}
          />

          <input
            className="form-control mb-3"
            placeholder="Enter Driver Name"
            value={driverName}
            onChange={(e)=>setDriverName(e.target.value)}
          />

          <button
            className="btn btn-success"
            onClick={registerBus}
          >
            Register Bus
          </button>

        </div>

      )}

    </div>

  );

}

export default DriverDashboard;