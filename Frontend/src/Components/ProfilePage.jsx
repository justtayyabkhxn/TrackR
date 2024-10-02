import React, { useState, useEffect } from "react";
import Navbar from "../Components/Navbar";
import { useLocation } from "react-router-dom";
import "../css/feed.css";
import "../css/item_card.css";
import Axios from "axios";
import { Card, Col, Container, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import { setConstraint } from "../constraints";

const ProfilePage = () => {
  const [user_info, setUserInfo] = useState(() => {
    return JSON.parse(localStorage.getItem("user")) || {};
  });

  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility

  useEffect(() => {
    setConstraint(true);
  }, [user_info]);

  return (
    <div>
      <Navbar />
      <div>
        <form className="Box-1">
          <h1 className="name">Account Info</h1>
          <p style={{ color: "white" }}></p>
          <div className="row1">
            <input
              type="text"
              id="firstname"
              placeholder="First Name"
              required
              defaultValue={user_info.firstname}
              readOnly
            />
            <input
              type="text"
              id="lastname"
              placeholder="Last Name"
              required
              defaultValue={user_info.lastname}
              readOnly
            />
          </div>
          <div className="row1">
            <input
              type="email"
              id="email"
              placeholder="Email"
              required
              defaultValue={user_info.email}
              readOnly
            />
            <input
              type="number"
              id="number"
              placeholder="Phone Number"
              required
              defaultValue={user_info.number}
              readOnly
            />
          </div>
          <div className="row1" style={{ position: "relative", width: "100%" }}>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              id="password"
              required
              defaultValue={user_info.password}
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
          <button type="button" className="submit">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;
