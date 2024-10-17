import React, { useEffect, useState } from "react";
import "../../css/changepassword.css";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom"; // Use useNavigate instead of useHistory for React Router v6
import Navbar from "../Navbar";
import { Spinner } from "react-bootstrap";
import { ToastContainer, toast, Flip } from "react-toastify";
import { ReactSession } from "react-client-session";

function ChangePassword() {
  const [loading, setLoading] = useState(false);
  const [info, setInfo] = useState("");
  const [verified, setVerified] = useState(true);
  const [OTP, setOTP] = useState("");
  const [email, setEmail] = useState("");
  const [emailID, setEmailID] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // Toggle for password visibility
  const [showCPassword, setShowCPassword] = useState(false); // Toggle for confirm password visibility
  const [message, setMessage] = useState(""); // State to toggle password visibility
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    cpassword: "",
  });
  const navigate = useNavigate();

  // Use useEffect to set emailID once when component mounts
  useEffect(() => {
    const email = ReactSession.get("email");

    if (email) {
      setEmailID(email); // Set emailID in state
      sessionStorage.removeItem("email");
      sessionStorage.clear();
      // Remove email from sessionStorage
    }
  }, []); // Empty dependency array ensures this runs only once

  const handleChange = (e) => {
    const value = e.target.value;
    if (value.length > 6) {
      setInfo("OTP shouldn't exceed 6 characters");
      e.target.value = value.substring(0, 6);
    }
    setOTP(e.target.value); // Set OTP directly
  };

  const handleFormChange = (e) => {
    const { id, value } = e.target;
    setFormData({
      ...formData,
      [id]: value,
    });
  };

  const handleSubmit = async () => {
    setLoading(true);

    try {
      const payload = {
        email: emailID,
        password: formData.password,
        cpassword: formData.cpassword,
      };

      const response = await axios.post(
        "http://localhost:5000/changePassword",
        payload
      );

      // Check if Pasword is changed
      if (response.data.success) {
        toast.success("Password Changed !", {
          position: "top-right",
          autoClose: 2000,
          theme: "dark",
        });

        // Delay navigation by 2 seconds
        setTimeout(() => {
          localStorage.clear();
          navigate("/log-in"); // Navigate to change-passowrd page after 2 seconds
        }, 1500);
      } else {
        setInfo(response.data.message || "Invalid request.");
      }
    } catch (error) {
      console.error("Error occurred:", error);
      setInfo("An error occurred during verification");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div style={{ display: "flex" }}>
        <form className="Box-1-login">
          <div
            style={{
              color: "red",
              fontFamily: "DynaPuff, system-ui",
              fontWeight: "400",
              fontSize: "1.2rem",
            }}
          >
            DO NOT REFRESH THE PAGE
          </div>
          <h1>Change Password</h1>
          <p style={{ color: "red" }}>{info}</p>

          <input
            type="email"
            name="email"
            placeholder="Email id"
            value={emailID}
            onChange={(e) => setEmailID(e.target.value)}
            required
            readOnly
          />
          <div style={{ position: "relative", width: "100%" }}>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="New Password"
              id="password"
              required
              value={formData.password}
              onChange={handleFormChange}
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
              onChange={handleFormChange}
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
          <button
            type="button"
            className="submit"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <>
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                />
                <span className="sr-only">Loading...</span>
              </>
            ) : (
              <>Change Password</>
            )}
          </button>
        </form>
        <ToastContainer />
      </div>
    </>
  );
}

export default ChangePassword;
