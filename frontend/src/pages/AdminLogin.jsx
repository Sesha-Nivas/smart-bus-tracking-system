import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../services/api";

export default function AdminLogin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState(localStorage.getItem("adminEmail") || "");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(
    localStorage.getItem("rememberAdmin") === "true"
  );

  const handleLogin = async () => {
    if (!email || !password) {
      alert("Please enter Email and Password");
      return;
    }

    try {
      const res = await API.post("/login", {
        email,
        password,
      });

      // Only Admin can login here
      if (res.data.role !== "admin") {
        alert("Only Administrator can login here.");
        return;
      }

      localStorage.setItem("userId", res.data.id);
      localStorage.setItem("role", res.data.role);

      if (rememberMe) {
        localStorage.setItem("rememberAdmin", "true");
        localStorage.setItem("adminEmail", email);
      } else {
        localStorage.removeItem("rememberAdmin");
        localStorage.removeItem("adminEmail");
      }

      navigate("/admin-dashboard");
    } catch (err) {
      alert("Invalid Email or Password");
    }
  };

  return (
    <div className="landing-page">
      <header className="landing-header">
        <div className="brand-pill">🚌 Smart Bus Navigator</div>

        <nav className="landing-nav">
          <Link to="/">Home</Link>
        </nav>
      </header>

      <main className="hero-grid">
        {/* Left Side */}
        <section className="hero-panel">
          <div className="hero-badge">
            🛡 System Administrator
          </div>

          <h1 className="hero-title">
            Administrator Login
          </h1>

          <p className="hero-copy">
            Login to manage colleges, buses, drivers,
            students, reports and live tracking.
          </p>

          <div className="feature-list">
            <div className="feature-item">
              <span className="feature-icon">🏫</span>

              <div>
                <strong>College Management</strong>
                <p>Add and manage colleges.</p>
              </div>
            </div>

            <div className="feature-item">
              <span className="feature-icon">🚌</span>

              <div>
                <strong>Bus Management</strong>
                <p>Assign buses and monitor trips.</p>
              </div>
            </div>

            <div className="feature-item">
              <span className="feature-icon">📊</span>

              <div>
                <strong>Reports</strong>
                <p>View system statistics and reports.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Right Side */}
        <section className="auth-card">

          <h2>Administrator Login</h2>

          <p className="auth-description">
            Sign in using your Administrator account.
          </p>

          <input
            className="auth-input"
            type="email"
            placeholder="Administrator Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            className="auth-input"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "20px",
            }}
          >
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={() => setRememberMe(!rememberMe)}
            />

            <span style={{ marginLeft: "10px", color: "white" }}>
              Remember Me
            </span>
          </div>

          <button
            className="auth-btn"
            onClick={handleLogin}
          >
            Login
          </button>

          <div
            className="switch-row"
            style={{ marginTop: "20px" }}
          >
            <Link to="/login">
              ← Back
            </Link>
          </div>

        </section>
      </main>
    </div>
  );
}