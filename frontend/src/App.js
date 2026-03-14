import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";

import StudentDashboard from "./components/StudentDashboard";
import DriverDashboard from "./components/driverDashboard";
import AdminDashboard from "./components/AdminDashboard";
import Navbar from "./components/Navbar";
import Login from "./components/Login";
import Layout from "./components/layout/Layout";

function App() {

  const [role, setRole] = useState(null);

  // If not logged in → show login page
  if (!role) return <Login setRole={setRole} />;


  // =============================
  // STUDENT LOGIN
  // =============================
  if (role === "student") {
    return (
      <Routes>
        <Route path="/" element={<StudentDashboard />} />
      </Routes>
    );
  }


  // =============================
  // DRIVER LOGIN
  // =============================
  if (role === "driver") {
    return (
      <Routes>
        <Route path="/" element={<DriverDashboard />} />
      </Routes>
    );
  }


  // =============================
  // ADMIN LOGIN
  // =============================
  if (role === "admin") {
    return (
      <>
        <Navbar role={role} />

        <Layout>
          <Routes>

            <Route path="/" element={<AdminDashboard />} />
            <Route path="/drivers" element={<DriverDashboard />} />
            <Route path="/students" element={<StudentDashboard />} />

          </Routes>
        </Layout>
      </>
    );
  }

}

export default App;