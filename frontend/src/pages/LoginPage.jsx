import React from "react";
import { useNavigate, Link } from "react-router-dom";

export default function LoginPage() {
  const navigate = useNavigate();

  return (
    <div className="landing-page">
      {/* Header */}
      <header className="landing-header">
        <div className="brand-pill">🚌 Smart Bus Navigator</div>

        <nav className="landing-nav">
          <Link to="/">Home</Link>
        </nav>
      </header>

      {/* Main Section */}
      <main className="hero-grid">

        {/* Left Side */}
        <section className="hero-panel">

          <div className="hero-badge">
            🔐 Secure Login Portal
          </div>

          <h1 className="hero-title">
            Welcome to Smart Bus Navigator
          </h1>

          <p className="hero-copy">
            Select your portal to continue.
            Administrators can manage colleges, buses,
            students and drivers.
            Students, Drivers and College Administrators
            should use the College Portal.
          </p>

          <div className="feature-list">

            <div className="feature-item">
              <span className="feature-icon">🏫</span>

              <div>
                <strong>College Portal</strong>
                <p>
                  Student, Driver and College Admin Login
                </p>
              </div>

            </div>

            <div className="feature-item">
              <span className="feature-icon">🛡</span>

              <div>
                <strong>Administrator</strong>
                <p>
                  System Administration Dashboard
                </p>
              </div>

            </div>

          </div>

        </section>

        {/* Right Side */}
        <section className="auth-card">

          <h2>Select Login</h2>

          <p className="auth-description">
            Choose how you want to access the system.
          </p>

          <button
            className="auth-btn"
            onClick={() => navigate("/admin-login")}
          >
            👨‍💼 Administrator Login
          </button>

          <button
            className="auth-btn"
            style={{ marginTop: "20px" }}
            onClick={() => navigate("/college-search")}
          >
            🏫 College Portal
          </button>

          <div
            className="switch-row"
            style={{ marginTop: "25px" }}
          >
            <Link to="/">
              ← Back to Home
            </Link>
          </div>

        </section>

      </main>

    </div>
  );
}