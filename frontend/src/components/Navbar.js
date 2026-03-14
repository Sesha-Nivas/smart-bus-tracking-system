import React from "react";
import { Link } from "react-router-dom";

function Navbar({ role }) {

  // Sidebar only for admin
  if (role !== "admin") return null;

  return (
    <div className="sidebar">

      <Link to="/">Dashboard</Link>

      <Link to="/drivers">Drivers</Link>

      <Link to="/students">Students</Link>

      <Link to="/colleges">Colleges</Link>

    </div>
  );
}

export default Navbar;