import React, { useState, useEffect } from "react";
import API from "../services/api";

function Login({ setRole }) {
  const [isSignup, setIsSignup] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setUserRole] = useState("student");

  const [buses, setBuses] = useState([]);
  const [selectedBus, setSelectedBus] = useState(null);
  const [loadingBuses, setLoadingBuses] = useState(false);

  useEffect(() => {
    fetchBuses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchBuses = async () => {
    setLoadingBuses(true);
    try {
      // try backend first (if /api/buses exists). Fallback to sample data.
      const res = await API.get("/buses");
      if (res && res.data && Array.isArray(res.data) && res.data.length) {
        setBuses(res.data);
        setSelectedBus(res.data[0]);
      } else {
        throw new Error("No buses from API");
      }
    } catch (err) {
      // fallback sample data
      const sample = [
        {
          id: 1,
          number: "BUS-101",
          route: "Campus Loop",
          start: "Main Gate",
          end: "College Park",
          nextStop: "Library",
          etaMinutes: 4,
          capacity: 40,
          status: "On Time",
        },
        {
          id: 2,
          number: "BUS-202",
          route: "Downtown Express",
          start: "College Park",
          end: "Central Station",
          nextStop: "Market St",
          etaMinutes: 9,
          capacity: 32,
          status: "Delayed",
        },
        {
          id: 3,
          number: "BUS-303",
          route: "East Shuttle",
          start: "North Campus",
          end: "East Gate",
          nextStop: "Science Block",
          etaMinutes: 2,
          capacity: 28,
          status: "On Time",
        },
      ];
      setBuses(sample);
      setSelectedBus(sample[0]);
    } finally {
      setLoadingBuses(false);
    }
  };

  const handleLogin = () => {
    API.post("/login", { email, password })
      .then((res) => {
        const userRole = res.data.role;
        localStorage.setItem("userId", res.data.id);
        localStorage.setItem("role", res.data.role);
        setRole(userRole);
      })
      .catch(() => {
        alert("Invalid Email or Password");
      });
  };

  const handleSignup = () => {
    API.post("/signup", { name, email, password, role })
      .then(() => {
        alert("Account created successfully! Please login.");
        setIsSignup(false);
      })
      .catch(() => {
        alert("Signup failed");
      });
  };

  return (
    <div className="landing-page">
      <div className="hero-grid">
        {/* Left: Hero + Features + Bus list */}
        <section className="hero-panel">
          <div className="hero-badge">🚌 Smart Bus Navigation</div>

          <h1 className="hero-title">Real-time smart bus navigation and tracking.</h1>

          <p className="hero-copy">
            Plan efficient bus routes, track buses live, and manage routes with a
            responsive admin & rider dashboard.
          </p>

          <div className="feature-list" style={{ marginBottom: 18 }}>
            <div className="feature-item">
              <span className="feature-icon">📡</span>
              <div>
                <strong>Real-time tracking</strong>
                <div>See live bus locations and ETA updates.</div>
              </div>
            </div>

            <div className="feature-item">
              <span className="feature-icon">🗓️</span>
              <div>
                <strong>Route scheduling</strong>
                <div>Manage routes, stops and timetables easily.</div>
              </div>
            </div>

            <div className="feature-item">
              <span className="feature-icon">🔔</span>
              <div>
                <strong>Alerts & notifications</strong>
                <div>Get delay/arrival alerts for riders and drivers.</div>
              </div>
            </div>
          </div>

          <div style={{ marginTop: 8 }}>
            <h3 style={{ margin: "8px 0" }}>Available buses</h3>

            <div
              style={{
                display: "grid",
                gap: 10,
                marginTop: 8,
              }}
            >
              {loadingBuses && <div>Loading buses...</div>}
              {!loadingBuses &&
                buses.map((b) => (
                  <button
                    key={b.id}
                    onClick={() => setSelectedBus(b)}
                    className="feature-item"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      background:
                        selectedBus && selectedBus.id === b.id
                          ? "linear-gradient(90deg,#ffd59a,#ffb347)"
                          : undefined,
                      color:
                        selectedBus && selectedBus.id === b.id ? "#071623" : undefined,
                      border:
                        selectedBus && selectedBus.id === b.id
                          ? "1px solid rgba(0,0,0,0.06)"
                          : undefined,
                      cursor: "pointer",
                    }}
                  >
                    <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                      <span style={{ fontSize: 18 }}>🚌</span>
                      <div>
                        <div style={{ fontWeight: 700 }}>{b.number} — {b.route}</div>
                        <div style={{ fontSize: 13, color: "rgba(255,255,255,0.7)" }}>
                          Next: {b.nextStop} • ETA {b.etaMinutes} min
                        </div>
                      </div>
                    </div>

                    <div style={{ textAlign: "right", fontSize: 13 }}>
                      <div style={{ fontWeight: 700 }}>{b.status}</div>
                      <div style={{ color: "rgba(255,255,255,0.7)" }}>{b.capacity} seats</div>
                    </div>
                  </button>
                ))}

              {!loadingBuses && buses.length === 0 && (
                <div className="feature-item">No buses found.</div>
              )}
              <div style={{ marginTop: 6 }}>
                <button
                  onClick={fetchBuses}
                  className="auth-btn"
                  style={{ width: 160, padding: "8px 12px" }}
                >
                  Refresh buses
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Right: Bus details + Auth card */}
        <section className="auth-card">

    <div style={{ marginBottom: 18 }}>
        ...
    </div>

    <hr style={{ borderColor: "rgba(255,255,255,0.06)", margin: "14px 0" }} />

    <h2 style={{ marginTop: 6 }}>
        {isSignup ? "Create your account" : "Welcome back"}
    </h2>

    <p className="auth-description">
        {isSignup
            ? "Signup to access the admin dashboard and manage buses."
            : "Login to view routes, tracking, and navigation tools."}
    </p>

    {isSignup && (
        <input
            className="auth-input"
            placeholder="Name"
            value={name}
            onChange={(e)=>setName(e.target.value)}
        />
    )}

    <input
        className="auth-input"
        placeholder="Email"
        value={email}
        onChange={(e)=>setEmail(e.target.value)}
    />

    <input
        type="password"
        className="auth-input"
        placeholder="Password"
        value={password}
        onChange={(e)=>setPassword(e.target.value)}
    />

    {isSignup && (
        <select
                    className="auth-select"
                    value={role}
                    onChange={(e)=>setUserRole(e.target.value)}
                >
                    <option value="student">Student</option>
                    <option value="driver">Driver</option>
                    <option value="admin">Admin</option>
                </select>
            )}

            {!isSignup ? (
                <button className="auth-btn" onClick={handleLogin}>
                    Login
                </button>
            ) : (
                <button className="auth-btn" onClick={handleSignup}>
                    Signup
                </button>
            )}

            <div className="switch-row">

                {isSignup ? (

                    <>
                        Already have an account?

                        <button
                            className="toggle-button"
                            onClick={()=>setIsSignup(false)}
                        >
                            Login
                        </button>
                    </>

                ) : (

                    <>
                        New user?

                        <button
                            className="toggle-button"
                            onClick={()=>setIsSignup(true)}
                        >
                            Create account
                        </button>
                    </>

                )}

            </div>

        </section>
      </div>
    </div>
  );
}

export default Login;