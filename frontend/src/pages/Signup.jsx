import React, { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

export default function Signup() {

    const navigate = useNavigate();

    const [name,setName]=useState("");

    const [email,setEmail]=useState("");

    const [password,setPassword]=useState("");

    const role=localStorage.getItem("selectedRole");

    const college_id=localStorage.getItem("collegeId");

    const signup=async()=>{

        try{

            const res=await API.post("/signup",{

                name,

                email,

                password,

                role,

                college_id

            });

            alert(res.data.message);

            navigate("/user-login");

        }

        catch(err){

            alert("Registration Failed");

            console.log(err);

        }

    }

    return(

        <div className="landing-page">

            <main className="hero-grid">

                <section className="hero-panel">

                    <h1>Create Account</h1>

                </section>

                <section className="auth-card">

                    <input
                    className="auth-input"
                    placeholder="Name"
                    onChange={(e)=>setName(e.target.value)}
                    />

                    <input
                    className="auth-input"
                    placeholder="Email"
                    onChange={(e)=>setEmail(e.target.value)}
                    />

                    <input
                    className="auth-input"
                    type="password"
                    placeholder="Password"
                    onChange={(e)=>setPassword(e.target.value)}
                    />

                    <button
                    className="auth-btn"
                    onClick={signup}
                    >
                        Register
                    </button>

                </section>

            </main>

        </div>

    );

}