import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import MapComponent from "./MapComponent";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function StudentDashboard() {

  const navigate = useNavigate();

  const [buses, setBuses] = useState([]);
  const [selectedBus, setSelectedBus] = useState("");

  const [location, setLocation] = useState(null);
  const [route, setRoute] = useState([]);
  const [alertShown, setAlertShown] = useState(false);
  const [busStatus, setBusStatus] = useState("");

  // Get selected college from login
  const collegeName = localStorage.getItem("collegeName");
  const collegeId = localStorage.getItem("collegeId");

  // Load buses automatically
  useEffect(() => {

    if (!collegeId) return;

    API.get(`/buses/${collegeId}`)
      .then((res) => {
        setBuses(res.data);
      })
      .catch((err) => console.log(err));

  }, [collegeId]);

  // Bus Near Alert
  useEffect(() => {

    if (location && location.distance < 0.5 && !alertShown) {

      toast.success("🚌 Bus is arriving soon!");

      setAlertShown(true);

    }

  }, [location, alertShown]);

  // Fetch Bus Location
  const fetchLocation = async (busId) => {

    if (!busId) return;

    // First check whether the bus is running
    try {
      const statusRes = await API.get(`/bus-status/${busId}`);
      const status = statusRes.data?.status?.toLowerCase() || "";
      setBusStatus(status);

      console.log("Bus status response:", statusRes.data);

      if (status !== "running") {
        setLocation(null);
        return;
      }

      const locRes = await API.get(`/bus-location/${busId}`);
      console.log("Bus location response:", locRes.data);

      if (!locRes.data) {
        setLocation(null);
        return;
      }

      setLocation(locRes.data);
      setRoute(prevRoute => {
        const nextPoint = {
          lat: parseFloat(locRes.data.latitude),
          lng: parseFloat(locRes.data.longitude)
        };

        const lastPoint = prevRoute[prevRoute.length - 1];
        if (lastPoint?.lat === nextPoint.lat && lastPoint?.lng === nextPoint.lng) {
          return prevRoute;
        }

        return [...prevRoute, nextPoint];
      });
    } catch (err) {
      console.error("Bus tracking fetch error:", err);
      setBusStatus("");
      setLocation(null);
    }

  };

  // Select Bus
  const handleBusChange = (e) => {

    const id = e.target.value;

    setSelectedBus(id);

    setLocation(null);

    setRoute([]);

    setAlertShown(false);
    setBusStatus("");

    fetchLocation(id);

  };

  // Refresh Every 3 Seconds
  useEffect(() => {

    if (!selectedBus) return;

    fetchLocation(selectedBus);

    const interval = setInterval(() => {

      fetchLocation(selectedBus);

    }, 3000);

    return () => clearInterval(interval);

  }, [selectedBus]);

  return (

    <div className="container py-4">

      <button

        className="btn btn-secondary mb-4"

        onClick={() => navigate("/")}

      >

        ← Home

      </button>

      <h2 className="text-center mb-4">

        🎓 Student Dashboard

      </h2>

      <ToastContainer />

      <div className="card shadow p-4 mb-4">

        <h5>

          College

        </h5>

        <p>

          <b>{collegeName}</b>

        </p>

        <label className="form-label">

          Select Bus

        </label>

        <select

          className="form-select"

          value={selectedBus}

          onChange={handleBusChange}

        >

          <option value="">

            Select Bus

          </option>

          {buses.map(bus => (

            <option

              key={bus.bus_id}

              value={bus.bus_id}

            >

              {bus.bus_number}

            </option>

          ))}

        </select>

      </div>

      {!location && selectedBus && busStatus !== "running" && (

        <div className="alert alert-warning">

          Driver has not started the trip.

        </div>

      )}

      {!location && selectedBus && busStatus === "running" && (

        <div className="alert alert-info">

          Trip is running. Waiting for the driver's GPS location...

        </div>

      )}

      {location && (

        <>

          <div className="card shadow p-3 mb-3 bg-success text-white">

            <h5>

              🚌 Bus Live

            </h5>

            <p>

              Distance :

              {location.distance?.toFixed(2)} km

            </p>

            <p>

              ETA :

              {location.eta?.toFixed(2)} mins

            </p>

          </div>

          <MapComponent

            lat={location.latitude}

            lng={location.longitude}

            route={route}

          />

        </>

      )}

    </div>

  );

}

export default StudentDashboard;