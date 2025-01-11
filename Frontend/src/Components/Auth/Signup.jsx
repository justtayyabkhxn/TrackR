import React, { useState } from "react";
import "../../css/newSignup.css";
import axios from "axios";
import Navbar from "../Navbar";
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer, Flip } from "react-toastify";
import { ReactSession } from "react-client-session";

const serverUrl = import.meta.env.VITE_SERVER_URL;


const Signup = () => {
  ReactSession.setStoreType("localStorage");
  const [info, setInfo] = useState("");
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    number: "",
    password: "",
    cpassword: "",
    verified: false,
  });
  const [showPassword, setShowPassword] = useState(false); // Toggle for password visibility
  const [showCPassword, setShowCPassword] = useState(false); // Toggle for confirm password visibility
  const navigate = useNavigate(); // Use the useNavigate hook

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({
      ...formData,
      [id]: value,
    });
  };

  const submit = () => {
    setInfo(""); // Clear the info state
    formData.verified = false;
    ReactSession.set("email", formData.email);

    axios
      .post(
        `${serverUrl}/signup`,
        formData,
        { withCredentials: true } // Include this option if dealing with cookies or authentication
      )
      .then((response) => {
        // Set the success message

        if (response.data.token) {
          navigate("/verify"); // Redirect to login on success
        } else if (response.data.message) {
          setInfo(response.data.message);
        }
      })
      .catch((error) => {
        console.log(
          "Error occurred:",
          error.response?.data?.message || error.message
        ); // Log error
      });
  };
  return (
    <>
      <Navbar />
      <div className="main-box" >
        <form className="Box-1" style={{marginTop:"100px"}}>
          <h1 className="name">Sign up</h1>
          <p style={{ color: "red" }}>{info}</p>
          <div className="row1">
            <input
              type="text"
              id="firstname"
              placeholder="First Name"
              required
              value={formData.firstname}
              onChange={handleChange}
            />
            <input
              type="text"
              id="lastname"
              placeholder="Last Name"
              required
              value={formData.lastname}
              onChange={handleChange}
            />
          </div>
          <div className="row1">
            <input
              type="email"
              id="email"
              placeholder="Email"
              required
              value={formData.email}
              onChange={handleChange}
            />
            <input
              type="number"
              id="number"
              placeholder="Phone Number"
              required
              value={formData.number}
              onChange={handleChange}
            />
          </div>
          <div className="row1">
            <div style={{ position: "relative", width: "100%" }}>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                id="password"
                required
                value={formData.password}
                onChange={handleChange}
                style={{ width: "100%" }}
              />
              <span
                className="showPassword"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: "absolute",
                  fontFamily: "DynaPuff, system-ui",
                  fontWeight: "600",
                  right: "-20px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  cursor: "pointer",
                  fontSize: "1.05rem",
                  color: "#ff8b4d",
                  marginLeft: "10px",
                }}
              >
                {showPassword ? "Hide" : "Show"}
              </span>
            </div>

            <div style={{ position: "relative", width: "100%" }}>
              <input
                type={showCPassword ? "text" : "password"}
                placeholder="Confirm Password"
                id="cpassword"
                required
                value={formData.cpassword}
                onChange={handleChange}
                style={{ width: "150%" }}
              />
             <span
                className="showPassword"
                onClick={() => setShowCPassword(!showCPassword)}
                style={{
                  position: "absolute",
                  fontFamily: "DynaPuff, system-ui",
                  fontWeight: "600",
                  right: "-20px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  cursor: "pointer",
                  fontSize: "1.05rem",
                  color: "#ff8b4d",
                  marginLeft: "10px",
                }}
              >
                {showCPassword ? "Hide" : "Show"}
              </span>
            </div>
          </div>
          <button type="button" className="submitButton" onClick={submit}>
            Sign Up
          </button>
          <p style={{ color: "white", fontSize: "1.2rem" }}>
            Have an account?{" "}
            <Link
              to="/log-in"
              style={{
                fontSize: "1.2rem",
                fontFamily: "DynaPuff, system-ui",
                fontWeight: "500",

              }}
            >
              Click here
            </Link>
          </p>
        </form>
        <ToastContainer />
      </div>
    </>
  );
};

export default Signup;
