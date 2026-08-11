import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";

export default function CollegeSearch() {
  const navigate = useNavigate();

  const [colleges, setColleges] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  // Load colleges from MySQL
  useEffect(() => {
    fetchColleges();
  }, []);

  const fetchColleges = async () => {
    try {
      const response = await API.get("/colleges");

      console.log("College API Response:", response.data);

      // If backend returns array
      if (Array.isArray(response.data)) {
        setColleges(response.data);
      }
      // If backend returns { success:true, data:[...] }
      else if (response.data.data) {
        setColleges(response.data.data);
      } else {
        setColleges([]);
      }
    } catch (error) {
      console.error("College Load Error:", error);
      alert("Unable to load colleges from database.");
    } finally {
      setLoading(false);
    }
  };

  const filteredColleges = colleges.filter((college) =>
    (college.college_name || "")
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const selectCollege = (college) => {
    localStorage.setItem("collegeId", college.college_id);
    localStorage.setItem("collegeName", college.college_name);

    navigate("/role-selection");
  };

  return (
    <div className="landing-page">
      {/* Header */}

      <header className="landing-header">
        <div className="brand-pill">🚌 Smart Bus Navigator</div>

        <nav className="landing-nav">
          <Link to="/">Home</Link>
        </nav>
      </header>

      {/* Main */}

      <main className="hero-grid">
        {/* Left */}

        <section className="hero-panel">
          <div className="hero-badge">
            🏫 College Portal
          </div>

          <h1 className="hero-title">
            Select Your College
          </h1>

          <p className="hero-copy">
            Search your college and continue to the
            Student, Driver or College Administrator login.
          </p>

          <div className="feature-list">
            <div className="feature-item">
              <span className="feature-icon">🎓</span>

              <div>
                <strong>Students</strong>

                <p>Track buses in real time.</p>
              </div>
            </div>

            <div className="feature-item">
              <span className="feature-icon">🚌</span>

              <div>
                <strong>Drivers</strong>

                <p>Start and end trips.</p>
              </div>
            </div>

            <div className="feature-item">
              <span className="feature-icon">🏢</span>

              <div>
                <strong>College Admin</strong>

                <p>Manage buses and students.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Right */}

        <section className="auth-card">
          <h2>Search College</h2>

          <p className="auth-description">
            Choose your college below
          </p>

          <input
            className="auth-input"
            placeholder="Search College..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <div
            style={{
              marginTop: "20px",
              maxHeight: "320px",
              overflowY: "auto",
            }}
          >
            {loading ? (
              <p style={{ color: "white" }}>
                Loading colleges...
              </p>
            ) : filteredColleges.length === 0 ? (
              <p style={{ color: "white" }}>
                No College Found
              </p>
            ) : (
              filteredColleges.map((college) => (
                <button
                  key={college.college_id}
                  className="auth-btn"
                  style={{
                    width: "100%",
                    marginBottom: "12px",
                  }}
                  onClick={() => selectCollege(college)}
                >
                  {college.college_name}
                </button>
              ))
            )}
          </div>

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