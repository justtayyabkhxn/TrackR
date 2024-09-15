import React, { useState } from "react";
import "../css/newSignup.css";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Use useNavigate instead of useHistory for React Router v6
import Navbar from "../Components/Navbar";
import { Spinner } from "react-bootstrap";

function Login() {
  const [loading, setLoading] = useState(false);
  const [info, setInfo] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async () => {
    setLoading(true);

    try {
      const payload = { email, password };

      const response = await axios.post("http://localhost:5000/login", payload);

      if (response.data.user) {
        // Authentication successful
        localStorage.setItem("token", response.data.jwtToken);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        navigate("/feed", { state: { user: response.data.user } });
      } else {
        setInfo(response.data.message || "An error occurred");
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
        <form className="Box-1 login">
          <h1>Log in</h1>
          <p style={{ color: "white" }}>{info}</p>
          <input
            type="email"
            name="email"
            placeholder="Email id"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
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
            Don't have an account?{" "}
            <a href="/sign-up">Click here</a>
          </p>
        </form>
      </div>
    </>
  );
}

export default Login;
