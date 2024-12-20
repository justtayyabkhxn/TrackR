import React, { useState } from "react";
import "../../css/login.css";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom"; // Use useNavigate instead of useHistory for React Router v6
import Navbar from "../Navbar";
import { Spinner } from "react-bootstrap";
import { ToastContainer, toast, Flip } from "react-toastify";

import { ReactSession } from "react-client-session";

function Login() {
  ReactSession.setStoreType("localStorage");

  const [loading, setLoading] = useState(false);
  const [info, setInfo] = useState("");
  const [verified, setVerified] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState(""); // State to toggle password visibility
  const navigate = useNavigate();
  ReactSession.set("email", email);

  const handleSubmit = async () => {
    setLoading(true);

    try {
      const payload = { email, password };

      const response = await axios.post("http://localhost:5000/login", payload);

      if (response.data.user) {
        // Authentication successful
        toast.success("Login Successful!", {
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
        localStorage.setItem("token", response.data.jwtToken);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        navigate("/feed", { state: { user: response.data.user } });
      } else {
        // Handle the error messages
        setInfo(response.data.message || "An error occurred");
        setVerified(
          response.data.status !== undefined ? response.data.status : true
        );
      }
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
      <div className="main-box" style={{ display: "flex" }}>
        <div
          className="Box-1"
          style={{
            width: "500px",
            borderRadius: "100px",
            padding: "50px",
          }}
        >
          <form className="Box-1-login">
            
            <div className="main-heading">
              
              <h1>Log in</h1>
              <hr />
            </div>
            <p style={{ color: "red" }}>
              {info}
              {!verified && (
                <Link
                  to="/verify"
                  style={{ color: "white", textDecoration: "none" }}
                >
                  Verify Now.
                </Link>
              )}
            </p>
            <input
              type="email"
              name="email"
              placeholder="Email id"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <div style={{ position: "relative" }}>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{ width: "100%" }}
              />
              <span
                className="showPassword"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "Hide" : "Show"}
              </span>
            </div>
            <button
              type="submit"
              className="submitLogin"
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
                  <span className="sr-only"> Loading...</span>
                </>
              ) : (
                <>Log In</>
              )}
            </button>
            <p style={{ color: "white" }}>
              Don't have an account?{" "}
              <Link className="clickHere" to="/sign-up">
                Click Here
              </Link>
            </p>
            <Link to="/forgot-password" className="forgotPass">
              Reset Password
            </Link>
          </form>
        </div>
      </div>
    </>
  );
}

export default Login;
