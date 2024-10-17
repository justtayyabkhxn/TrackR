import React, { useEffect, useState } from "react";
import "../../css/newSignup.css";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom"; // Use useNavigate instead of useHistory for React Router v6
import Navbar from "../Navbar";
import { Spinner } from "react-bootstrap";
import { ReactSession } from "react-client-session";
import { ToastContainer, toast, Flip } from "react-toastify";

const OTPVerification = () => {
  const [loading, setLoading] = useState(false);
  const [info, setInfo] = useState("");
  const [emailID, setEmailID] = useState("");
  const [password, setPassword] = useState("");
  const [OTP, setOTP] = useState("");
  const [message, setMessage] = useState(""); // State to toggle password visibility
  const navigate = useNavigate();

  // Function to send OTP
  const sendOTP = async () => {
    const userEmail = ReactSession.get("email");
    setEmailID(userEmail); // set email
    try {
      const response = await axios.get("http://localhost:5000/sendOTP", {
        params: { email: userEmail },
      });

      if (response.data.message) {
        toast.success("OTP sent successfully!", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
          transition: Flip,
          style: {
            fontSize: "1.05rem",
            textTransform: "uppercase",
            textShadow: "0.5px 0.5px 2px black",
            color: "#ff8b4d",
            backgroundColor: "#0c151d",
          },
        });
      } else {
        setInfo(response.data.message);
      }
    } catch (error) {
      setInfo("Failed to send OTP. Please try again.");
      console.error("Error sending OTP:", error);
    }
  };

  // useEffect to send OTP on component mount
  useEffect(() => {
    sendOTP(); // Send OTP on initial load
  }, []);

  // Handle input change for OTP
  const handleChange = (e) => {
    const value = e.target.value;
    if (value.length > 6) {
      setInfo("OTP shouldn't exceed 6 characters");
      e.target.value = value.substring(0, 6);
    }
    setOTP(e.target.value); // Set OTP directly
  };

  // Handle form submit
  const handleSubmit = async () => {
    setLoading(true);
    try {
      const payload = { email: emailID, userOTP: OTP };

      const response = await axios.get("http://localhost:5000/verifyOTP", {
        params: payload,
      });

      // Check if OTP is verified
      if (response.data.verified) {
        toast.success("OTP Verified!", {
          position: "top-right",
          autoClose: 2000,
          theme: "dark",
        });
      
        // Delay navigation by 2 seconds
        setTimeout(() => {
          navigate("/log-in"); // Navigate to login page after 2 seconds
        }, 2000);
      } else {
        setInfo(response.data.message || "Invalid OTP.");
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
          <h1>Verify Email</h1>
          <p style={{ color: "red" }}>{info}</p>
          <input
            type="email"
            name="email"
            placeholder="Email ID"
            value={emailID}
            required
            readOnly
          />
          <div style={{ position: "relative" }}>
            <input
              type="number"
              placeholder="6 Digit OTP"
              maxLength="6"
              name="text"
              value={OTP}
              onChange={handleChange}
              required
              style={{ width: "60%" }}
            />
            <span
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
              onClick={sendOTP} // Trigger OTP resend
            >
              Resend OTP
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
              <>Submit</>
            )}
          </button>
        </form>
        <ToastContainer />
      </div>
    </>
  );
};

export default OTPVerification;
