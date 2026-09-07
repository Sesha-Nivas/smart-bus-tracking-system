import { Link } from "react-router-dom";

export default function LandingPage() {
  return (
    <div className="landing-page">
      <header className="landing-header">
        <div className="brand-pill">🚌 Smart Bus Navigator</div>
        <nav className="landing-nav">
          <a href="#features">Features</a>
          <a href="#how">How it works</a>
          <a href="#about">About</a>
          <Link to="/login" className="nav-cta">
            Login
          </Link>
        </nav>
      </header>

      <main className="hero-grid">
        <section className="hero-panel">
          <div className="hero-badge">
            <span style={{ fontSize: "1.2rem" }}>⭐</span>
            Live route tracking
          </div>
          <h1 className="hero-title">Smart bus navigation built for campus and city transit.</h1>
          <p className="hero-copy">
            Plan safer trips, track vehicles in real time, and give riders a faster, more reliable commute.
          </p>

          <div className="hero-actions">
            <Link to="/login" className="hero-btn hero-btn-main">
              Start tracking
            </Link>
            <a href="#features" className="hero-btn hero-btn-secondary">
              Explore features
            </a>
          </div>

          <div className="feature-list" id="features">
            <div className="feature-item">
              <span className="feature-icon">📍</span>
              <div>
                <strong>Live bus locations</strong>
                <p>Track every vehicle on campus and next-stop ETA updates.</p>
              </div>
            </div>
            <div className="feature-item">
              <span className="feature-icon">🛣️</span>
              <div>
                <strong>Route planning</strong>
                <p>Optimize routes for drivers, admins, and students in one dashboard.</p>
              </div>
            </div>
            <div className="feature-item">
              <span className="feature-icon">🔔</span>
              <div>
                <strong>Real-time updates</strong>
                <p>Receive accurate bus status, arrival alerts, and transit analytics.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="hero-card hero-status-card">
          <div className="hero-card-header">
            <div>
              <p className="card-label">Route status</p>
              <h2>Campus Express</h2>
            </div>
            <span className="status-chip">On time</span>
          </div>

          <div className="route-summary">
            <div>
              <p className="route-label">From</p>
              <p><strong>North Gate</strong></p>
            </div>
            <div>
              <p className="route-label">To</p>
              <p><strong>Central Library</strong></p>
            </div>
          </div>

          <div className="route-details">
            <div>
              <span>Next stop</span>
              <strong>Science Block</strong>
            </div>
            <div>
              <span>ETA</span>
              <strong>4 min</strong>
            </div>
          </div>

          <div className="small-cards">
            <div className="small-card">
              <span className="route-label">Bus</span>
              <strong>BUS-101</strong>
            </div>
            <div className="small-card">
              <span className="route-label">Capacity</span>
              <strong>42 seats</strong>
            </div>
          </div>
        </section>
      </main>

      <section className="section-block" id="how">
        <div className="section-title">
          <span>How it works</span>
          <h2>Designed for drivers, passengers, and admins.</h2>
        </div>

        <div className="cards-grid role-cards">
          <div className="info-card">
            <div style={{ fontSize: "2.2rem", marginBottom: "12px" }}>🚗</div>
            <h3>Driver tools</h3>
            <p>Streamline route updates, start and end trips, and share live location automatically.</p>
          </div>
          <div className="info-card">
            <div style={{ fontSize: "2.2rem", marginBottom: "12px" }}>👤</div>
            <h3>Passenger alerts</h3>
            <p>Notify riders with accurate ETAs, delay warnings, and next-stop arrival reminders.</p>
          </div>
          <div className="info-card">
            <div style={{ fontSize: "2.2rem", marginBottom: "12px" }}>⚙️</div>
            <h3>Admin control</h3>
            <p>Monitor fleet status, manage routes, and keep service performance on track.</p>
          </div>
        </div>
      </section>

      <section className="section-block" id="about">
        <div className="section-title">
          <span>Why choose Smart Bus Navigator</span>
          <h2>Reliable transit, smoother and more modern.</h2>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <p className="stat-value">98%</p>
            <p className="stat-label">On-time arrivals</p>
          </div>
          <div className="stat-card">
            <p className="stat-value">3x</p>
            <p className="stat-label">Faster route planning</p>
          </div>
          <div className="stat-card">
            <p className="stat-value">24/7</p>
            <p className="stat-label">Live tracking support</p>
          </div>
        </div>
      </section>

      <footer className="landing-footer">
        <div>
          <strong>Smart Bus Navigator</strong>
          <p>Efficient transit platform for campuses, drivers, and students.</p>
        </div>
        <div className="footer-links">
          <a href="#features">Features</a>
          <a href="#how">How it works</a>
          <a href="#about">About</a>
        </div>
      </footer>
    </div>
  );
}
