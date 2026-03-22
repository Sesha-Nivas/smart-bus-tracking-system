import React, { useState } from "react";
import StudentDashboard from "./components/StudentDashboard";
import DriverDashboard from "./components/driverDashboard";
import AdminDashboard from "./components/AdminDashboard";
import Navbar from "./components/Navbar";
import Login from "./components/Login";

function App() {

  const [role, setRole] = useState(null);

  if (!role) return <Login setRole={setRole} />;

  return (
    <>
      <Navbar role={role} />

      {role === "student" && <StudentDashboard />}
      {role === "driver" && <DriverDashboard />}
      {role === "admin" && <AdminDashboard />}
    </>
  );
}

export default App;