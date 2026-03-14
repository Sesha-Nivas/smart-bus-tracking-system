import React, { useState } from "react";
import API from "../services/api";

function Login({ setRole }) {

  const [isSignup, setIsSignup] = useState(false);

  const [name,setName] = useState("");
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const [role,setUserRole] = useState("student");

  // LOGIN
  const handleLogin = () => {

    API.post("/login",{email,password})
      .then(res => {

        const userRole = res.data.role;

        // SAVE USER DATA
        localStorage.setItem("userId", res.data.id);
        localStorage.setItem("role", res.data.role);

        setRole(userRole);

      })
      .catch(err => {
        alert("Invalid Email or Password");
      });

  };

  // SIGNUP
  const handleSignup = () => {

    API.post("/signup",{name,email,password,role})
      .then(res => {

        alert("Account created successfully! Please login.");

        setIsSignup(false);

      })
      .catch(err => {
        alert("Signup failed");
      });

  };

  return (

    <div className="container mt-5">

      <h2>{isSignup ? "Signup" : "Login"}</h2>

      {isSignup && (
        <input
          className="form-control mb-3"
          placeholder="Name"
          value={name}
          onChange={(e)=>setName(e.target.value)}
        />
      )}

      <input
        className="form-control mb-3"
        placeholder="Email"
        value={email}
        onChange={(e)=>setEmail(e.target.value)}
      />

      <input
        type="password"
        className="form-control mb-3"
        placeholder="Password"
        value={password}
        onChange={(e)=>setPassword(e.target.value)}
      />

      {isSignup && (

        <select
          className="form-control mb-3"
          value={role}
          onChange={(e)=>setUserRole(e.target.value)}
        >

          <option value="student">Student</option>
          <option value="driver">Driver</option>
          <option value="admin">Admin</option>

        </select>

      )}

      {!isSignup ? (

        <button
          className="btn btn-primary"
          onClick={handleLogin}
        >
          Login
        </button>

      ) : (

        <button
          className="btn btn-success"
          onClick={handleSignup}
        >
          Signup
        </button>

      )}

      <div className="mt-3">

        {isSignup ? (

          <p>
            Already have an account?{" "}
            <button
              className="btn btn-link"
              onClick={()=>setIsSignup(false)}
            >
              Login
            </button>
          </p>

        ) : (

          <p>
            New user?{" "}
            <button
              className="btn btn-link"
              onClick={()=>setIsSignup(true)}
            >
              Signup
            </button>
          </p>

        )}

      </div>

    </div>

  );

}

export default Login;