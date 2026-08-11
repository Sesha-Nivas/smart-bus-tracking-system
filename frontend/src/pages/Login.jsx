import React from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {

    const navigate = useNavigate();

    const role = localStorage.getItem("selectedRole");

    const login = () => {

        navigate("/user-login");

    };

    return (

        <div className="landing-page">

            <main className="hero-grid">

                <section className="hero-panel">

                    <h1>Welcome</h1>

                    <p>Login or create a new account.</p>

                </section>

                <section className="auth-card">

                    <h2>{role?.toUpperCase()} Portal</h2>

                    <button
                        className="auth-btn"
                        onClick={login}
                    >
                        Login
                    </button>

                    <Link
                        className="auth-btn"
                        to="/signup"
                        style={{
                            display:"block",
                            marginTop:"15px",
                            textAlign:"center",
                            textDecoration:"none"
                        }}
                    >
                        Create New Account
                    </Link>

                </section>

            </main>

        </div>

    );

}