import React, { useState } from "react";
import "../css/newSignup.css";
import axios from "axios";
import Navbar from "../Components/Navbar";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer, Flip } from "react-toastify";

const Signup = () => {
  const [info, setInfo] = useState("");
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    number: "",
    password: "",
    cpassword: "",
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
    setInfo("");

    axios({
      url: "http://localhost:5000/signup",
      method: "POST",
      data: formData,
      withCredentials: true, // Include this if dealing with cookies or authentication
    })
      .then((response) => {
        setInfo("Sign up successful!"); // Update info with a string message
        if (response.data && response.data.token) {
          navigate("/log-in"); // Navigate using the useNavigate hook
        }
      })
      .catch((error) => {
        console.log("Error occurred:", error);
      });
  };

  return (
    <>
      <Navbar />
      <div>
        <form className="Box-1">
          <h1 className="name">Sign up</h1>
          <p style={{ color: "white" }}>{info}</p>
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
                  marginLeft:"10px"
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
                }}
              >
                {showCPassword ? "Hide" : "Show"}
              </span>
            </div>
          </div>
          <button type="button" className="submit" onClick={submit}>
            Submit
          </button>
          <p style={{ color: "white", fontSize: "21px" }}>
            Have an account? <a href="/log-in">Click here</a>
          </p>
        </form>
        <ToastContainer />
      </div>
    </>
  );
};

export default Signup;
