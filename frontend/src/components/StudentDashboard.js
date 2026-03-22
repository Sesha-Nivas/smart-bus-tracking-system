import React, { useEffect, useState } from "react";
import API from "../services/api";
import MapComponent from "./MapComponent";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function StudentDashboard() {

  const [colleges, setColleges] = useState([]);
  const [selectedCollege, setSelectedCollege] = useState(null);

  const [buses, setBuses] = useState([]);
  const [selectedBus, setSelectedBus] = useState("");

  const [location, setLocation] = useState(null);
  const [route, setRoute] = useState([]);
  const [alertShown, setAlertShown] = useState(false);

  const [searchCollege, setSearchCollege] = useState("");

  const [studentLat, setStudentLat] = useState(null);
  const [studentLng, setStudentLng] = useState(null);

  // ============================
  // Load Colleges
  // ============================

  useEffect(() => {

    navigator.geolocation.getCurrentPosition((pos) => {

      setStudentLat(pos.coords.latitude);
      setStudentLng(pos.coords.longitude);

    });

  }, []);
  useEffect(() => {

    API.get("/colleges")
      .then(res => {
        setColleges(res.data);
      })
      .catch(err => console.error(err));

  }, []);


  // ============================
  // Load Buses for Selected College
  // ============================
  useEffect(() => {

    if(selectedCollege){

      API.get(`/buses/${selectedCollege}`)
        .then(res => {
          setBuses(res.data);
        })
        .catch(err => console.error(err));

    }

  }, [selectedCollege]);


  // ============================
  // Alert when bus is near
  // ============================
  useEffect(() => {

    if(location && location.distance < 0.5 && !alertShown){
      toast.success("🚌 Bus is arriving soon!");
      setAlertShown(true);
    }

  }, [location, alertShown]);


  // ============================
  // Fetch Location
  // ============================
  const fetchLocation = (busId) => {

    API.get(`/bus-location/${busId}`)
      .then(res => {

        if(!res.data){
          setLocation(null);
          return;
        }

        setLocation(res.data);

        setRoute(prevRoute => [
          ...prevRoute,
          {
            lat: parseFloat(res.data.latitude),
            lng: parseFloat(res.data.longitude)
          }
        ]);

      })
      .catch(err => console.error(err));
  };


  // ============================
  // Bus Selection
  // ============================
  const handleBusChange = (e) => {

    const busId = e.target.value;

    setSelectedBus(busId);
    setRoute([]);
    setAlertShown(false);

    fetchLocation(busId);

  };


  // ============================
  // Refresh Location
  // ============================
  useEffect(() => {

    if (!selectedBus) return;

    const interval = setInterval(() => {
      fetchLocation(selectedBus);
    }, 5000);

    return () => clearInterval(interval);

  }, [selectedBus]);


  return (

    <div style={{ maxWidth: "900px", margin: "0 auto", paddingTop: "20px" }}>

      <h2 className="text-center mb-4">Student Bus Tracking</h2>

      <ToastContainer />

      {/* ===============================
          COLLEGE SELECTION PAGE
      =============================== */}

      {!selectedCollege && (

        <div className="card p-3 shadow">

          <h5>Select College</h5>

          <input
            className="form-control mb-3"
            placeholder="Search college..."
            value={searchCollege}
            onChange={(e)=>setSearchCollege(e.target.value)}
          />

          {colleges
            .filter(college =>
              college.college_name.toLowerCase().includes(searchCollege.toLowerCase())
            )
            .map(college => (

              <div
                key={college.college_id}
                className="option-card"
                onClick={() => setSelectedCollege(college.college_id)}
              >
                {college.college_name}
              </div>

          ))}

        </div>

      )}


      {/* ===============================
          BUS SELECTION PAGE
      =============================== */}

      {selectedCollege && (

        <div className="card p-3 shadow">

          <button
            className="btn btn-secondary mb-3"
            onClick={()=>{
              setSelectedCollege(null);
              setSelectedBus("");
              setLocation(null);
              setRoute([]);
              setAlertShown(false);
            }}
          >
            Back
          </button>

          <label className="form-label">Select Bus</label>

          <select
            className="form-select"
            value={selectedBus}
            onChange={handleBusChange}
          >

            <option value="">Select Bus</option>

            {buses.map(bus => (
              <option key={bus.bus_id} value={bus.bus_id}>
                {bus.bus_number}
              </option>
            ))}

          </select>

        </div>

      )}


      {/* ===============================
          DRIVER NOT STARTED
      =============================== */}

      {!location && selectedBus && (
        <div className="alert alert-warning mt-3">
          Driver has not started the trip yet 🚍
        </div>
      )}


      {/* ===============================
          BUS TRACKING
      =============================== */}

      {location && (

        <div className="mt-4">

          <div className="card p-3 shadow mb-3">

            <h5>Bus Information</h5>

            <p><b>Distance:</b> {location.distance?.toFixed(2)} km</p>
            <p><b>ETA:</b> {location.eta?.toFixed(2)} minutes</p>

          </div>

          <div className="card shadow">

            <MapComponent
              lat={location.latitude}
              lng={location.longitude}
              route={route}
            />

          </div>

        </div>

      )}

    </div>

  );

}

export default StudentDashboard;