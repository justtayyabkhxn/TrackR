import React, { useState } from "react";
import "../../css/forgotpassword.css";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom"; // Use useNavigate instead of useHistory for React Router v6
import Navbar from "../Navbar";
import { Spinner } from "react-bootstrap";
import { ToastContainer, toast, Flip } from "react-toastify";
import { ReactSession } from "react-client-session";

const serverUrl = import.meta.env.VITE_SERVER_URL;


function ForgotPassword() {
  ReactSession.setStoreType("sessionStorage");

  const [loading, setLoading] = useState(false);
  const [info, setInfo] = useState("");
  const [verified, setVerified] = useState(true);
  const [OTP, setOTP] = useState("");
  const [email, setEmail] = useState("");
  const [emailID, setEmailID] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState(""); // State to toggle password visibility
  const navigate = useNavigate();
  const handleChange = (e) => {
    const value = e.target.value;
    if (value.length > 6) {
      setInfo("OTP shouldn't exceed 6 characters");
      e.target.value = value.substring(0, 6);
    }
    setOTP(e.target.value); // Set OTP directly
  };

  const sendOTP = async () => {
    try {
      const response = await axios.get(`${serverUrl}/resetPassword`, {
        params: { email: emailID },
      });
      console.log(response);

      if (response.data.success) {
        console.log(emailID);
        ReactSession.set("email", emailID);

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

  const handleSubmit = async () => {
    setLoading(true);

    try {
      const payload = { email: emailID, userOTP: OTP };

      const response = await axios.get(`${serverUrl}/verifyOTP`, {
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
          navigate("/change-password"); // Navigate to change-passowrd page after 2 seconds
        }, 500);
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
      <div
        style={{
          width: "500px",
          borderRadius: "100px",
          padding: "50px",
        }}
      >
        <form className="Box-1-login">
          <h1>Reset Password</h1>
          <p style={{ color: "red" }}>{info}</p>

          <input
            type="email"
            name="email"
            placeholder="Email id"
            value={emailID}
            onChange={(e) => setEmailID(e.target.value)}
            required
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
              Send OTP
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
              <>Reset</>
            )}
          </button>
        </form>
        <ToastContainer />
      </div>
    </>
  );
}

export default ForgotPassword;
