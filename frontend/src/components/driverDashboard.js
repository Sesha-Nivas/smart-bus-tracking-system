import React, { useEffect, useRef, useState } from "react";
import API from "../services/api";
import MapComponent from "./MapComponent";

function DriverDashboard() {

  // ============================
  // DASHBOARD STATE
  // ============================

  const [mode, setMode] = useState(null);

  const [buses, setBuses] = useState([]);

  const [search, setSearch] = useState("");

  const [busNumber, setBusNumber] = useState("");

  const [selectedBus, setSelectedBus] = useState(null);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  // ============================
  // TRIP / GPS STATE
  // ============================
  

  const [busStatus, setBusStatus] = useState("");

  const [tripStarted, setTripStarted] = useState(false);

  const [location, setLocation] = useState(null);

  const [route, setRoute] = useState([]);

  const [gpsError, setGpsError] = useState("");

  const [startingTrip, setStartingTrip] = useState(false);

  const [endingTrip, setEndingTrip] = useState(false);

  const [watchId, setWatchId] = useState(null);

  // GPS watcher reference
  const watchIdRef = useRef(null);

  // ============================
  // LOGIN INFORMATION
  // ============================

  const driverId = localStorage.getItem("userId");

  const collegeId = localStorage.getItem("collegeId");

  const collegeName =
    localStorage.getItem("collegeName") ||
    "Your College";


  // ============================
  // LOAD COLLEGE BUSES
  // ============================

  useEffect(() => {

    if (!selectedBus) return;

    const getCurrentBusStatus = async () => {

      try {

        const response = await API.get(
          `/bus-status/${selectedBus.bus_id}`
        );

        console.log("Current bus status:", response.data);

        setBusStatus(response.data.status);

        if (
          response.data.status &&
          response.data.status.toLowerCase() === "running"
        ) {

          setTripStarted(true);

        } else {

          setTripStarted(false);

        }

      } catch (error) {

        console.error(
          "Unable to get current bus status:",
          error
        );

      }

    };

    getCurrentBusStatus();

    const interval = setInterval(
      getCurrentBusStatus,
      3000
    );

    return () => clearInterval(interval);

  }, [selectedBus]);
  const loadBuses = async () => {

    if (!collegeId) {

      setError(
        "College information is missing. Please login again."
      );

      return;
    }

    try {

      setLoading(true);

      setError("");

      const response = await API.get(
        `/buses/${collegeId}`
      );

      setBuses(response.data);

    } catch (err) {

      console.error(
        "Bus loading error:",
        err
      );

      setError(
        "Unable to load buses."
      );

    } finally {

      setLoading(false);

    }

  };


  // ============================
  // LOAD BUSES WHEN DASHBOARD OPENS
  // ============================

  useEffect(() => {

    loadBuses();

    // Cleanup GPS when page is closed
    return () => {

      if (watchIdRef.current !== null) {

        navigator.geolocation.clearWatch(
          watchIdRef.current
        );

      }

    };

  }, []);


  // ============================
  // REGISTER NEW BUS
  // ============================

  const registerBus = async () => {

    if (!busNumber.trim()) {

      alert(
        "Please enter bus number."
      );

      return;
    }

    if (!driverId) {

      alert(
        "Driver ID not found. Please login again."
      );

      return;
    }

    if (!collegeId) {

      alert(
        "College ID not found. Please login again."
      );

      return;
    }


    try {

      const response = await API.post(
        "/register-bus",
        {
          bus_number: busNumber.trim(),
          driver_id: driverId,
          college_id: collegeId
        }
      );


      if (response.data.success) {

        alert(
          "Bus registered successfully!"
        );

        setBusNumber("");

        setMode("registered");

        await loadBuses();

      }

    } catch (err) {

      console.error(
        "Bus registration error:",
        err
      );

      if (
        err.response &&
        err.response.status === 409
      ) {

        alert(
          "This bus number is already registered."
        );

      } else {

        alert(
          "Unable to register bus."
        );

      }

    }

  };


  // ============================
  // FILTER BUSES
  // ============================

  const filteredBuses = buses.filter(
    (bus) =>
      bus.bus_number
        .toLowerCase()
        .includes(search.toLowerCase())
  );


  // ============================
  // RESET
  // ============================

  const goBack = () => {

    stopGpsWatcher();

    setMode(null);

    setSelectedBus(null);

    setSearch("");

    setTripStarted(false);

    setLocation(null);

    setRoute([]);

    setGpsError("");

  };


  // ============================
  // STOP GPS WATCHER
  // ============================

  const stopGpsWatcher = () => {

    if (watchIdRef.current !== null) {

      navigator.geolocation.clearWatch(
        watchIdRef.current
      );

      watchIdRef.current = null;

    }

  };


  // ============================
  // SEND LOCATION TO BACKEND
  // ============================

  const sendLocationToServer = async (
    position
  ) => {

    if (!selectedBus) return;

    const latitude =
      position.coords.latitude;

    const longitude =
      position.coords.longitude;

    const accuracy =
      position.coords.accuracy;

    const speed =
      position.coords.speed;

    // Show location immediately on driver screen
    setLocation({
      latitude,
      longitude,
      accuracy,
      speed
    });

    // Add location to route
    setRoute((previousRoute) => [

      ...previousRoute,

      {
        lat: latitude,
        lng: longitude
      }

    ]);


    // Send location to backend
    try {

      await API.post(
        "/bus-location",
        {
          bus_id: selectedBus.bus_id,

          latitude,
          longitude,

          accuracy,

          speed
        }
      );

      console.log(
        "Location sent:",
        latitude,
        longitude
      );

    } catch (err) {

      console.error(
        "Unable to send location:",
        err
      );

      setGpsError(
        "GPS is working, but location could not be saved to server."
      );

    }

  };


  // ============================
  // GPS ERROR
  // ============================

  const handleGpsError = (error) => {

    console.error(
      "GPS Error:",
      error
    );

    let message =
      "Unable to get your current location.";

    if (error.code === 1) {

      message =
        "Location permission denied. Please allow location access.";

    } else if (error.code === 2) {

      message =
        "Your location is currently unavailable.";

    } else if (error.code === 3) {

      message =
        "GPS request timed out. Please try again.";

    }

    setGpsError(message);

  };


  // ============================
  // START GPS WATCHING
  // ============================

  const startGpsTracking = () => {

    if (!navigator.geolocation) {

      setGpsError(
        "GPS is not supported by this device/browser."
      );

      return;

    }


    setGpsError("");

    setRoute([]);


    // Get current position immediately
    navigator.geolocation.getCurrentPosition(

      (position) => {

        sendLocationToServer(
          position
        );

      },

      (error) => {

        handleGpsError(error);

      },

      {
        enableHighAccuracy: true,

        timeout: 15000,

        maximumAge: 0

      }

    );


    // Continue watching location
    watchIdRef.current =
      navigator.geolocation.watchPosition(

        (position) => {

          sendLocationToServer(
            position
          );

        },

        (error) => {

          handleGpsError(error);

        },

        {
          enableHighAccuracy: true,

          timeout: 15000,

          maximumAge: 0
        }

      );

  };


  // ============================
  // START TRIP
  // ============================

  const startTrip = async () => {

    try {

      setLoading(true);

      const response = await API.post(
        "/start-trip",
        {
          bus_id: selectedBus.bus_id,
          driver_id: driverId
        }
      );

      console.log(response.data);

      setBusStatus("running");

      setTripStarted(true);

      setSelectedBus(prev => ({
        ...prev,
        status: "running"
      }));

      startGpsTracking();

    } catch (error) {

      console.error("Start trip error:", error);

      alert(
        error.response?.data?.error ||
        "Unable to start trip."
      );

    } finally {

      setLoading(false);

    }

  };

  // ============================
  // END TRIP
  // ============================

  const endTrip = async () => {

    if (!selectedBus) return;


    try {

      setEndingTrip(true);


      // Stop GPS first
      stopGpsWatcher();


      const response =
        await API.post(
          "/stop-trip",
          {
            bus_id:
              selectedBus.bus_id,

            driver_id:
              selectedBus.driver_id ||
              driverId
          }
        );


      if (
        response.data &&
        response.data.status === "stopped"
      ) {

        setTripStarted(false);

        setSelectedBus(
          (previousBus) => ({
            ...previousBus,

            status: "stopped"
          })
        );


        alert(
          "Trip ended successfully."
        );

      } else {

        alert(
          "Unable to end trip."
        );

      }

    } catch (err) {

      console.error(
        "End trip error:",
        err
      );

      alert(
        err.response?.data?.error ||
        "Unable to end trip."
      );

    } finally {

      setEndingTrip(false);

    }

  };


  // ============================
  // SELECT BUS
  // ============================

  const selectBus = (bus) => {

    setSelectedBus(bus);

    setTripStarted(
      bus.status === "running"
    );

    setLocation(null);

    setRoute([]);

    setGpsError("");

  };

  const stopTrip = async () => {
    try {
      setLoading(true);

      // Stop GPS tracking
      if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId);
        setWatchId(null);
      }

      // Update bus status in backend
      await API.post("/stop-trip", {
        bus_id: selectedBus.bus_id,
        driver_id: driverId
      });

      // Update frontend status
      setSelectedBus((prev) => ({
        ...prev,
        status: "stopped"
      }));

      setTripStarted(false);

      alert("Trip ended successfully.");

    } catch (err) {
      console.error("Stop trip error:", err);

      alert(
        err.response?.data?.error ||
        "Unable to stop trip."
      );

    } finally {
      setLoading(false);
    }
  };

  // ============================
  // RETURN UI
  // ============================

  return (

    <div
      className="container mt-4"
      style={{
        maxWidth: "1000px"
      }}
    >

      {/* ============================
          HEADER
      ============================ */}

      <div
        className="card shadow p-4 mb-4"
        style={{
          background:
            "linear-gradient(135deg, #071b3a, #0b2d5c)",

          color: "white",

          borderRadius: "18px"
        }}
      >

        <h2>
          🚌 Driver Dashboard
        </h2>

        <p
          style={{
            marginBottom: 0
          }}
        >

          College:

          <strong>
            {" "}{collegeName}
          </strong>

        </p>

      </div>


      {/* ============================
          ERROR
      ============================ */}

      {error && (

        <div className="alert alert-danger">

          {error}

        </div>

      )}


      {/* ============================
          MAIN OPTIONS
      ============================ */}

      {!mode && !selectedBus && (

        <div
          className="card shadow p-4"
        >

          <h4 className="mb-3">

            Bus Management

          </h4>

          <p>

            Select an existing bus or
            register a new bus.

          </p>


          <div
            className="d-flex gap-3 flex-wrap"
          >

            <button
              className="btn btn-primary"
              onClick={() =>
                setMode("registered")
              }
            >

              🚌 Bus Already Registered

            </button>


            <button
              className="btn btn-success"
              onClick={() =>
                setMode("new")
              }
            >

              ➕ Register New Bus

            </button>

          </div>

        </div>

      )}


      {/* ============================
          REGISTERED BUSES
      ============================ */}

      {mode === "registered" &&
        !selectedBus && (

        <div
          className="card shadow p-4"
        >

          <div
            className="
              d-flex
              justify-content-between
              align-items-center
              mb-3
            "
          >

            <h4>

              🚌 Registered Buses

            </h4>


            <button
              className="btn btn-secondary"
              onClick={goBack}
            >

              ← Back

            </button>

          </div>


          <input
            className="form-control mb-3"
            placeholder="Search bus number..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />


          {loading && (

            <p>
              Loading buses...
            </p>

          )}


          {!loading &&
            filteredBuses.length === 0 && (

            <div
              className="alert alert-warning"
            >

              No buses are registered for
              {` ${collegeName}`}.

              <br />

              You can register a new bus.

              <br />

              <button
                className="btn btn-success mt-3"
                onClick={() =>
                  setMode("new")
                }
              >

                ➕ Register New Bus

              </button>

            </div>

          )}


          {!loading &&
            filteredBuses.map((bus) => (

            <div
              key={bus.bus_id}
              className="
                card
                shadow-sm
                p-3
                mb-3
              "
              style={{
                borderRadius: "12px"
              }}
            >

              <div
                className="
                  d-flex
                  justify-content-between
                  align-items-center
                "
              >

                <div>

                  <h5>

                    🚌 {bus.bus_number}

                  </h5>

                  <small>

                    Status:{" "}

                    <strong>

                      {bus.status}

                    </strong>

                  </small>

                </div>


                <button
                  className="
                    btn
                    btn-outline-primary
                  "
                  onClick={() =>
                    selectBus(bus)
                  }
                >

                  Select

                </button>

              </div>

            </div>

          ))}

        </div>

      )}


      {/* ============================
          REGISTER NEW BUS
      ============================ */}

      {mode === "new" && (

        <div
          className="card shadow p-4"
        >

          <div
            className="
              d-flex
              justify-content-between
              align-items-center
              mb-4
            "
          >

            <h4>

              ➕ Register New Bus

            </h4>


            <button
              className="btn btn-secondary"
              onClick={goBack}
            >

              ← Back

            </button>

          </div>


          <div
            className="alert alert-info"
          >

            This bus will be registered
            under:

            <br />

            <strong>
              {collegeName}
            </strong>

          </div>


          <label
            className="form-label"
          >

            Bus Number

          </label>


          <input
            className="form-control mb-3"
            placeholder="Example: TN01AB1234"
            value={busNumber}
            onChange={(e) =>
              setBusNumber(
                e.target.value
              )
            }
          />


          <button
            className="btn btn-success"
            onClick={registerBus}
          >

            🚌 Register Bus

          </button>

        </div>

      )}


      {/* ============================
          SELECTED BUS / LIVE TRACKING
      ============================ */}

      {selectedBus && (

        <div className="card shadow p-4">

          <button
            className="btn btn-secondary mb-4"
            onClick={() => {
              setSelectedBus(null);
              setTripStarted(false);
              setBusStatus("");
            }}
          >
            ← Back to Buses
          </button>

          <h3>
            🚌 {selectedBus.bus_number}
          </h3>

          <p>
            College:
            <strong> {collegeName}</strong>
          </p>

          <p>
            Status:
            <strong
              style={{
                color:
                  busStatus?.toLowerCase() === "running"
                    ? "green"
                    : "red"
              }}
            >
              {" "}
              {busStatus?.toUpperCase() || "LOADING..."}
            </strong>
          </p>


          {!tripStarted && (

            <div className="text-center">

              <div className="alert alert-info">

                🚌 Bus is ready.

                <br />

                Click <strong>Start Trip</strong>
                {" "}to begin GPS tracking.

              </div>

              <button
                className="btn btn-success btn-lg"
                onClick={startTrip}
                disabled={loading}
              >
                {loading
                  ? "Starting..."
                  : "▶️ Start Trip"}
              </button>

            </div>

          )}


          {tripStarted && (

            <div>

              <div className="alert alert-success">

                🟢 <strong>Trip is currently running!</strong>

                <br />

                GPS location tracking is active.

              </div>

              {/* MAP WILL COME HERE */}

              <button
                className="btn btn-danger btn-lg"
                onClick={stopTrip}
              >
                ⏹️ End Trip
              </button>

            </div>

          )}

        </div>

      )}

          {/* ============================
              LIVE STATUS
          ============================ */}

          {tripStarted && (

            <div
              className="alert alert-success"
            >

              🟢 <strong>
                Trip is LIVE
              </strong>

              <br />

              Your mobile GPS location
              is being tracked.

            </div>

          )}


          {/* ============================
              MAP
          ============================ */}

          {tripStarted && (

            <div
              className="card shadow-sm mb-4"
              style={{
                overflow: "hidden"
              }}
            >

              <div
                className="p-3"
                style={{
                  background: "#071b3a",
                  color: "white"
                }}
              >

                <h5
                  style={{
                    margin: 0
                  }}
                >

                  📍 Live Bus Location

                </h5>

              </div>


              {location ? (

                <MapComponent
                  lat={location.latitude}
                  lng={location.longitude}
                  route={route}
                />

              ) : (

                <div
                  style={{
                    height: "400px",

                    display: "flex",

                    alignItems: "center",

                    justifyContent: "center",

                    background: "#e9f2f7",

                    color: "#071b3a",

                    fontSize: "18px"
                  }}
                >

                  📍 Waiting for GPS location...

                </div>

              )}

            </div>

          )}


          {/* ============================
              GPS INFORMATION
          ============================ */}

          {tripStarted && location && (

            <div
              className="card p-3 mb-4"
              style={{
                background: "#f5f7fa"
              }}
            >

              <h5>
                📡 Current GPS Information
              </h5>


              <p>

                <strong>
                  Latitude:
                </strong>{" "}

                {location.latitude}

              </p>


              <p>

                <strong>
                  Longitude:
                </strong>{" "}

                {location.longitude}

              </p>


              <p>

                <strong>
                  Accuracy:
                </strong>{" "}

                {location.accuracy
                  ? `${Math.round(
                      location.accuracy
                    )} meters`
                  : "Calculating..."}

              </p>


              {location.speed !== null &&
                location.speed !== undefined && (

                <p>

                  <strong>
                    Speed:
                  </strong>{" "}

                  {location.speed >= 0
                    ? `${(
                        location.speed * 3.6
                      ).toFixed(1)} km/h`
                    : "Not available"}

                </p>

              )}

            </div>

          )}


          {/* ============================
              END TRIP
          ============================ */}

          {tripStarted && (

            <div
              className="text-center"
            >

              <button
                className="
                  btn
                  btn-danger
                  btn-lg
                  px-5
                "
                onClick={endTrip}
                disabled={endingTrip}
              >

                {endingTrip
                  ? "Ending Trip..."
                  : "⏹ End Trip"}

              </button>

            </div>

          )}

        </div>

      )}

//     </div>

//   );

// }

export default DriverDashboard;