import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import MapComponent from "./MapComponent";

function DriverTracking({ bus }) {

    const navigate = useNavigate();

    const [driverLocation, setDriverLocation] = useState(null);

    const [tripStarted, setTripStarted] = useState(
        bus?.status === "RUNNING" ||
        bus?.status === "running"
    );

    const [loading, setLoading] = useState(false);

    const [error, setError] = useState("");

    // =====================================================
    // GET CURRENT MOBILE LOCATION
    // =====================================================

    const getCurrentLocation = () => {

        return new Promise((resolve, reject) => {

            if (!navigator.geolocation) {

                reject(
                    new Error("Geolocation is not supported by this browser.")
                );

                return;
            }

            navigator.geolocation.getCurrentPosition(

                (position) => {

                    resolve({
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude
                    });

                },

                (error) => {

                    reject(error);

                },

                {
                    enableHighAccuracy: true,
                    timeout: 10000,
                    maximumAge: 0
                }

            );

        });

    };


    // =====================================================
    // SEND LOCATION TO BACKEND
    // =====================================================

    const updateLocation = async () => {

        if (!bus?.bus_id) return;

        try {

            const location = await getCurrentLocation();

            setDriverLocation(location);

            await API.post("/bus-location", {

                bus_id: bus.bus_id,

                latitude: location.latitude,

                longitude: location.longitude

            });

            console.log(
                "Location updated:",
                location.latitude,
                location.longitude
            );

        } catch (error) {

            console.error(
                "Location error:",
                error
            );

            setError(
                "Unable to get your current location."
            );

        }

    };


    // =====================================================
    // START TRIP
    // =====================================================

    const startTrip = async () => {

        if (!bus?.bus_id) return;

        setLoading(true);
        setError("");

        try {

            await getCurrentLocation();

            await API.post(
                `/start-trip/${bus.bus_id}`
            );

            setTripStarted(true);

            await updateLocation();

        } catch (error) {

            console.error(error);

            setError(
                "Unable to start trip. Please allow location access."
            );

        }

        setLoading(false);

    };


    // =====================================================
    // END TRIP
    // =====================================================

    const endTrip = async () => {

        if (!bus?.bus_id) return;

        try {

            await API.post(
                `/end-trip/${bus.bus_id}`
            );

            setTripStarted(false);

        } catch (error) {

            console.error(error);

            setError(
                "Unable to end trip."
            );

        }

    };


    // =====================================================
    // UPDATE LOCATION EVERY 5 SECONDS
    // =====================================================

    useEffect(() => {

        if (!tripStarted) return;

        updateLocation();

        const interval = setInterval(() => {

            updateLocation();

        }, 5000);

        return () => {

            clearInterval(interval);

        };

    }, [tripStarted, bus?.bus_id]);


    if (!bus) {

        return (
            <div className="card">
                <h3>No bus selected</h3>
            </div>
        );

    }


    return (

        <div
            style={{
                maxWidth: "1100px",
                margin: "30px auto",
                padding: "20px"
            }}
        >

            {/* BACK */}

            <button
                className="btn btn-secondary mb-3"
                onClick={() => navigate(-1)}
            >
                ← Back to Buses
            </button>


            {/* BUS INFORMATION */}

            <div
                className="card shadow p-4 mb-4"
            >

                <h2>
                    🚌 {bus.bus_number}
                </h2>

                <p>
                    <strong>College:</strong>{" "}
                    {localStorage.getItem("collegeName") || "College"}
                </p>

                <p>
                    <strong>Status:</strong>{" "}

                    {tripStarted ? (
                        <span style={{ color: "green" }}>
                            🟢 RUNNING
                        </span>
                    ) : (
                        <span style={{ color: "red" }}>
                            🔴 STOPPED
                        </span>
                    )}

                </p>

            </div>


            {/* ERROR */}

            {error && (

                <div
                    className="alert alert-danger"
                >
                    {error}
                </div>

            )}


            {/* DRIVER LOCATION */}

            {driverLocation && (

                <div
                    className="alert alert-info"
                >

                    📍 <strong>Your Current Location</strong>

                    <br />

                    Latitude:{" "}
                    {driverLocation.latitude.toFixed(6)}

                    <br />

                    Longitude:{" "}
                    {driverLocation.longitude.toFixed(6)}

                </div>

            )}


            {/* MAP */}

            <div
                className="card shadow mb-4"
                style={{
                    overflow: "hidden"
                }}
            >

                <h3
                    style={{
                        padding: "15px",
                        margin: 0
                    }}
                >
                    🗺️ Live Bus Location
                </h3>

                {driverLocation ? (

                    <MapComponent
                        lat={driverLocation.latitude}
                        lng={driverLocation.longitude}
                        route={[
                            {
                                lat: driverLocation.latitude,
                                lng: driverLocation.longitude
                            }
                        ]}
                    />

                ) : (

                    <div
                        style={{
                            height: "450px",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            background: "#e9ecef"
                        }}
                    >

                        <div>

                            📍

                            <h4>
                                Location not available
                            </h4>

                            <p>
                                Start the trip to enable GPS tracking.
                            </p>

                        </div>

                    </div>

                )}

            </div>


            {/* BUTTONS */}

            <div
                style={{
                    display: "flex",
                    gap: "15px"
                }}
            >

                {!tripStarted ? (

                    <button
                        className="btn btn-success"
                        style={{
                            flex: 1,
                            padding: "15px",
                            fontSize: "18px"
                        }}
                        onClick={startTrip}
                        disabled={loading}
                    >

                        {loading
                            ? "Starting..."
                            : "▶ Start Trip"
                        }

                    </button>

                ) : (

                    <button
                        className="btn btn-danger"
                        style={{
                            flex: 1,
                            padding: "15px",
                            fontSize: "18px"
                        }}
                        onClick={endTrip}
                    >

                        ⏹ End Trip

                    </button>

                )}

            </div>

        </div>

    );

}

export default DriverTracking;