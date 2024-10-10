import React, { useEffect, useState } from "react";
import "../css/newSignup.css";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom"; // Use useNavigate instead of useHistory for React Router v6
import Navbar from "../Components/Navbar";
import { Spinner } from "react-bootstrap";
import { ToastContainer, toast, Flip } from "react-toastify";
import { ReactSession } from "react-client-session";

function AdminLogin() {
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
  useEffect(() => {
    setEmail("admin@trackit.com");
  }, []);

  const handleSubmit = async () => {
    setLoading(true);

    try {
      const payload = { email, password };

      const response = await axios.post(
        "http://localhost:5000/adminLogin",
        payload
      );

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
      <div style={{ display: "flex" }}>
        <form className="Box-1-login">
          <h1>Admin Log in</h1>
          <p style={{ color: "red" }}>{info}</p>

          <input
            type="email"
            name="email"
            placeholder="Email id"
            style={{
              color: "#ff8b4d",
              borderColor: "#ff8b4d",
              textShadow: "1px 1px 1px black",
            }}
            value={"admin@trackit.com"}
            required
            readOnly
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
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: "absolute",
                fontFamily: "DynaPuff, system-ui",
                fontWeight: "600",
                right: "10px",
                top: "50%",
                transform: "translateY(-50%)",
                cursor: "pointer",
                fontSize: "1.05rem",
                color: "#ff8b4d",
              }}
            >
              {showPassword ? "Hide" : "Show"}
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
      </div>
    </>
  );
}

export default AdminLogin;
