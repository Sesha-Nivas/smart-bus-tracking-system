import React from "react";
import { useNavigate, Link } from "react-router-dom";

export default function RoleSelection() {
  const navigate = useNavigate();

  const collegeName =
    localStorage.getItem("collegeName") || "Selected College";

  const selectRole = (role) => {
    localStorage.setItem("selectedRole", role);
    navigate("/login-option");
  };

  return (
    <div className="landing-page">

      {/* Header */}
      <header className="landing-header">

        <div className="brand-pill">
          🚌 Smart Bus Navigator
        </div>

        <nav className="landing-nav">
          <Link to="/">Home</Link>
        </nav>

      </header>

      <main className="hero-grid">

        {/* Left Section */}

        <section className="hero-panel">

          <div className="hero-badge">
            🏫 College Portal
          </div>

          <h1 className="hero-title">
            {collegeName}
          </h1>

          <p className="hero-copy">
            Select how you want to login.
            Your dashboard and permissions will
            depend on your selected role.
          </p>

          <div className="feature-list">

            <div className="feature-item">
              <span className="feature-icon">🎓</span>

              <div>
                <strong>Student</strong>
                <p>
                  Track buses, check ETA and receive notifications.
                </p>
              </div>

            </div>

            <div className="feature-item">
              <span className="feature-icon">🚌</span>

              <div>
                <strong>Driver</strong>
                <p>
                  Start trips, update live location and manage routes.
                </p>
              </div>

            </div>

            <div className="feature-item">
              <span className="feature-icon">🏢</span>

              <div>
                <strong>College Administrator</strong>
                <p>
                  Manage students, drivers and buses.
                </p>
              </div>

            </div>

          </div>

        </section>

        {/* Right Section */}

        <section className="auth-card">

          <h2>Select Your Role</h2>

          <p className="auth-description">
            Choose your role to continue.
          </p>

          <button
            className="auth-btn"
            onClick={() => selectRole("student")}
          >
            🎓 Student
          </button>

          <button
            className="auth-btn"
            style={{ marginTop: "15px" }}
            onClick={() => selectRole("driver")}
          >
            🚌 Driver
          </button>

          <button
            className="auth-btn"
            style={{ marginTop: "15px" }}
            onClick={() => selectRole("collegeadmin")}
          >
            🏢 College Administrator
          </button>

          <div
            className="switch-row"
            style={{ marginTop: "25px" }}
          >
            <Link to="/college-search">
              ← Back to College Search
            </Link>
          </div>

        </section>

      </main>

    </div>
  );
}