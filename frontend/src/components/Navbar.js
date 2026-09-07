import React from "react";
import { Link } from "react-router-dom";

function Navbar({ role }) {

  return (
    <div className="sidebar">

      {/* ADMIN SIDEBAR */}
      {role === "admin" && (
        <>
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/buses">Buses</Link>
          <Link to="/drivers">Drivers</Link>
          <Link to="/colleges">Colleges</Link>
        </>
      )}

      {/* DRIVER SIDEBAR */}
      {role === "driver" && (
        <>
          <Link to="/driver">Driver Dashboard</Link>
        </>
      )}

      {/* STUDENT SIDEBAR */}
      {role === "student" && (
        <>
          <Link to="/student">Track Bus</Link>
        </>
      )}

    </div>
  );
}

export default Navbar;