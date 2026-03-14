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

  if (!role) return <Login setRole={setRole} />;

  return (
    <>
      <Navbar />

      <Layout>

        <Routes>

          <Route path="/" element={<StudentDashboard />} />

          <Route path="/buses" element={<DriverDashboard />} />

          <Route path="/drivers" element={<DriverDashboard />} />

          <Route path="/colleges" element={<AdminDashboard />} />

        </Routes>

      </Layout>
    </>
  );
}

export default App;