import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import "./App.css";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

// Public Pages
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import AdminLogin from "./pages/AdminLogin";
import CollegeSearch from "./pages/CollegeSearch";
import RoleSelection from "./pages/RoleSelection";
import UserLogin from "./pages/UserLogin";

// Dashboards
import AdminPage from "./pages/AdminPage";
import StudentPage from "./pages/StudentPage";
import DriverPage from "./pages/DriverPage";
import CollegeAdminPage from "./pages/CollegeAdminPage";

// Protected Route
function ProtectedRoute({ children, allowedRoles }) {
  const role = localStorage.getItem("role");

  if (!role) {
    return <Navigate to="/" replace />;
  }

  if (!allowedRoles.includes(role)) {
    return <Navigate to="/" replace />;
  }

  return children;
}

function App() {
  return (
    <Routes>

      {/* Landing */}
      <Route path="/" element={<LandingPage />} />

      {/* Login Selection */}
      <Route path="/login" element={<LoginPage />} />

      {/* Admin Login */}
      <Route path="/admin-login" element={<AdminLogin />} />

      {/* College Portal */}
      <Route path="/college-search" element={<CollegeSearch />} />

      {/* Select User Role */}
      <Route path="/role-selection" element={<RoleSelection />} />

      {/* Student / Driver / College Admin Login */}
      <Route path="/user-login" element={<UserLogin />} />


      <Route
        path="/login-option"
        element={<Login/>}
      />

      <Route
        path="/signup"
        element={<Signup/>}
      />

      {/* Admin Dashboard */}
      <Route
        path="/admin-dashboard"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminPage />
          </ProtectedRoute>
        }
      />

      {/* Student Dashboard */}
      <Route
        path="/student-dashboard"
        element={
          <ProtectedRoute allowedRoles={["student"]}>
            <StudentPage />
          </ProtectedRoute>
        }
      />

      {/* Driver Dashboard */}
      <Route
        path="/driver-dashboard"
        element={
          <ProtectedRoute allowedRoles={["driver"]}>
            <DriverPage />
          </ProtectedRoute>
        }
      />

      {/* College Admin Dashboard */}
      <Route
        path="/college-dashboard"
        element={
          <ProtectedRoute allowedRoles={["college_admin"]}>
            <CollegeAdminPage />
          </ProtectedRoute>
        }
      />

      {/* Invalid Route */}
      <Route path="*" element={<Navigate to="/" replace />} />

    </Routes>
  );
}

export default App;