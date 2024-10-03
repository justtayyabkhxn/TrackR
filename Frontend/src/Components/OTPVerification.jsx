import React, { useEffect, useState } from "react";
import "../css/newSignup.css";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom"; // Use useNavigate instead of useHistory for React Router v6
import Navbar from "../Components/Navbar";
import { Spinner } from "react-bootstrap";
import { ReactSession } from "react-client-session";
const OTPVerification = () => {
  const [loading, setLoading] = useState(false);
  const [info, setInfo] = useState("");
  const [emailID, setEmailID] = useState("");
  const [password, setPassword] = useState("");
  const [OTP, setOTP] = useState("");
  const [message, setMessage] = useState(""); // State to toggle password visibility
  const navigate = useNavigate();
  useEffect(() => {
    const userEmail = ReactSession.get("email");
    axios.get('http://localhost:5000/sendOTP')
    setEmailID(userEmail);
  }, []);
  const handleChange = (e) => {
    if (e.target.value.length > 6) {
      setInfo("Username shouldn't exceed 6 characters");
      e.target.value = e.target.value.trim().substring(0, 6);
    }
    setPassword(e.target.value);
    setOTP(e.target.value);
  };
  const handleSubmit = async () => {
    setLoading(true);
    setEmailID(ReactSession.get("email"));
    // console.log(emailID);
    try {
      const payload = { email: emailID, userOTP: OTP };

      const response = await axios.get("http://localhost:5000/verifyOTP", {
        params: payload,
      });


      console.log(OTP);
    } catch (error) {
      console.log("Error occurred:", error);
      setInfo("An error occurred during login");
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <Navbar />
      <div style={{ display: "flex" }}>
        <form className="Box-1-login">
          <h1>Verify Email</h1>
          {/* <p style={{ color: "red" }}>{info}</p> */}
          <input
            type="email"
            name="email"
            placeholder="Email id"
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
              value={password}
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
          <p style={{ color: "white" }}>
            Did not recieve OTP ?{" "}
            <button
              to="/sign-up"
              style={{
                border: "none",
                borderRadius: "10px",
                padding: "3px",
                background: "#ff8b4d",
                color: "#0c151d",
                fontWeight: "500",
              }}
            >
              Resend
            </button>
          </p>
        </form>
      </div>
    </>
  );
};
export default OTPVerification;
