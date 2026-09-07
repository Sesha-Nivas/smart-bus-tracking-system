import React from "react";
import { useNavigate } from "react-router-dom";

export default function CollegeAdminPage() {
  const navigate = useNavigate();

  const collegeName =
    localStorage.getItem("collegeName") || "College";

  const logout = () => {
    localStorage.removeItem("role");
    localStorage.removeItem("userId");
    localStorage.removeItem("collegeName");

    navigate("/");
  };

  return (
    <div className="landing-page">

      {/* Header */}
      <header className="landing-header">

        <div className="brand-pill">
          🚌 Smart Bus Navigator
        </div>

        <nav className="landing-nav">

          <span
            style={{
              color: "white",
              fontWeight: "600"
            }}
          >
            {collegeName}
          </span>

          <button
            className="hero-btn hero-btn-main"
            onClick={logout}
          >
            Logout
          </button>

        </nav>

      </header>

      {/* Dashboard */}

      <section
        className="section-block"
        style={{ marginTop: "30px" }}
      >

        <div className="section-title">

          <span>College Dashboard</span>

          <h2>{collegeName}</h2>

        </div>

        <div className="stats-grid">

          <div className="stat-card">
            <p className="stat-value">850</p>
            <p className="stat-label">Students</p>
          </div>

          <div className="stat-card">
            <p className="stat-value">24</p>
            <p className="stat-label">Drivers</p>
          </div>

          <div className="stat-card">
            <p className="stat-value">18</p>
            <p className="stat-label">Buses</p>
          </div>

          <div className="stat-card">
            <p className="stat-value">15</p>
            <p className="stat-label">Trips Today</p>
          </div>

        </div>

      </section>

      {/* Management Cards */}

      <section className="section-block">

        <div className="cards-grid role-cards">

          <div className="info-card">
            <div
              style={{
                fontSize: "2.2rem",
                marginBottom: "15px"
              }}
            >
              🎓
            </div>

            <h3>Student Management</h3>

            <p>
              Add, Edit and Remove Students.
            </p>

            <button
              className="hero-btn hero-btn-main"
              style={{ marginTop: "15px" }}
            >
              Manage Students
            </button>

          </div>

          <div className="info-card">

            <div
              style={{
                fontSize: "2.2rem",
                marginBottom: "15px"
              }}
            >
              🚌
            </div>

            <h3>Bus Management</h3>

            <p>
              Assign buses and manage routes.
            </p>

            <button
              className="hero-btn hero-btn-main"
              style={{ marginTop: "15px" }}
            >
              Manage Buses
            </button>

          </div>

          <div className="info-card">

            <div
              style={{
                fontSize: "2.2rem",
                marginBottom: "15px"
              }}
            >
              🚗
            </div>

            <h3>Driver Management</h3>

            <p>
              Add drivers and assign buses.
            </p>

            <button
              className="hero-btn hero-btn-main"
              style={{ marginTop: "15px" }}
            >
              Manage Drivers
            </button>

          </div>

        </div>

      </section>

      {/* Live Bus Status */}

      <section className="section-block">

        <div className="section-title">

          <span>Live Bus Status</span>

          <h2>Today's Running Buses</h2>

        </div>

        <div className="cards-grid">

          <div className="info-card">
            <h3>🚌 BUS-101</h3>
            <p>Status : Running</p>
            <p>Driver : Ravi</p>
          </div>

          <div className="info-card">
            <h3>🚌 BUS-102</h3>
            <p>Status : Running</p>
            <p>Driver : Kumar</p>
          </div>

          <div className="info-card">
            <h3>🚌 BUS-103</h3>
            <p>Status : Not Started</p>
            <p>Driver : Arjun</p>
          </div>

        </div>

      </section>

    </div>
  );
}