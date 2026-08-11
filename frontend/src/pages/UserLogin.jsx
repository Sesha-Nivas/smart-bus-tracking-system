import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../services/api";

export default function UserLogin() {
  const navigate = useNavigate();

  const collegeName =
    localStorage.getItem("collegeName") || "College";

  const selectedRole =
    localStorage.getItem("selectedRole") || "student";

  const [userId, setUserId] = useState(
    localStorage.getItem("savedUserId") || ""
  );

  const [password, setPassword] = useState("");

  const [rememberMe, setRememberMe] = useState(
    localStorage.getItem("rememberUser") === "true"
  );

  const getTitle = () => {
    switch (selectedRole) {
      case "student":
        return "Student Login";
      case "driver":
        return "Driver Login";
      case "collegeadmin":
        return "College Administrator Login";
      default:
        return "Login";
    }
  };

  const getPlaceholder = () => {
    switch (selectedRole) {
      case "student":
        return "Student ID";
      case "driver":
        return "Driver ID";
      case "collegeadmin":
        return "Email";
      default:
        return "User ID";
    }
  };

  const handleLogin = async () => {
    if (!userId || !password) {
      alert("Please enter all fields.");
      return;
    }

    try {
      const response = await API.post("/login", {
        email: userId,
        password: password
      });

      if (response.data.role !== selectedRole) {
        alert("You selected the wrong role.");
        return;
      }

      localStorage.setItem("userId", response.data.id);
      localStorage.setItem("role", response.data.role);

      if (rememberMe) {
        localStorage.setItem("rememberUser", "true");
        localStorage.setItem("savedUserId", userId);
      } else {
        localStorage.removeItem("rememberUser");
        localStorage.removeItem("savedUserId");
      }

      if (selectedRole === "student") {
        navigate("/student-dashboard");
      }

      else if (selectedRole === "driver") {
        navigate("/driver-dashboard");
      }

      else if (selectedRole === "collegeadmin") {
        navigate("/college-dashboard");
      }

    } catch (err) {
      alert("Invalid Login Credentials");
    }
  };

  return (
    <div className="landing-page">

      <header className="landing-header">

        <div className="brand-pill">
          🚌 Smart Bus Navigator
        </div>

        <nav className="landing-nav">
          <Link to="/">Home</Link>
        </nav>

      </header>

      <main className="hero-grid">

        {/* Left */}

        <section className="hero-panel">

          <div className="hero-badge">
            🏫 {collegeName}
          </div>

          <h1 className="hero-title">
            {getTitle()}
          </h1>

          <p className="hero-copy">
            Login securely to access your dashboard,
            live tracking, notifications and bus
            management system.
          </p>

          <div className="feature-list">

            <div className="feature-item">
              <span className="feature-icon">🚌</span>

              <div>
                <strong>Live Bus Tracking</strong>
                <p>View buses in real time.</p>
              </div>

            </div>

            <div className="feature-item">
              <span className="feature-icon">📍</span>

              <div>
                <strong>GPS Navigation</strong>
                <p>Accurate location updates.</p>
              </div>

            </div>

            <div className="feature-item">
              <span className="feature-icon">🔔</span>

              <div>
                <strong>Notifications</strong>
                <p>Receive trip alerts instantly.</p>
              </div>

            </div>

          </div>

        </section>

        {/* Right */}

        <section className="auth-card">

          <h2>{getTitle()}</h2>

          <p className="auth-description">
            {collegeName}
          </p>

          <input
            className="auth-input"
            placeholder={getPlaceholder()}
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
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
              marginBottom: "20px"
            }}
          >
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={() => setRememberMe(!rememberMe)}
            />

            <span
              style={{
                marginLeft: "10px",
                color: "white"
              }}
            >
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
            <Link to="/role-selection">
              ← Back
            </Link>
          </div>

        </section>

      </main>

    </div>
  );
}