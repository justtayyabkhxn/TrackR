import React, { useEffect, useState } from "react";
import axios from "axios";
import logo from "../img/logo.jpg";
import LostItem from "./Lost_Item";
import "../css/Navbar.css";

function Navbar() {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const token = window.localStorage.getItem("token");

  useEffect(() => {
    if (token) {
      axios({
        url: "http://localhost:5000/checktoken",
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => {
          console.log("Token verified:", res);
          setIsSignedIn(true); // Set signed-in status
        })
        .catch((err) => {
          console.error("Token verification failed:", err);
          setIsSignedIn(false); // If token verification fails, set not signed-in
        });
    } else {
      setIsSignedIn(false); // If no token, set not signed-in
    }
  }, [token]);

  const signout = () => {
    axios({
      url: "http://localhost:5000/signout",
      method: "POST",
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
      },
    })
      .then(() => {
        localStorage.clear();
        window.location.href = "/log-in"; // Redirect to log-in after sign-out
      })
      .catch((error) => {
        console.error("Error during sign-out:", error);
      });
  };

  return (
    <div className="navbar">
      {!isSignedIn && (
        <div className="logo">
          <img src={logo} alt="Logo" />
        </div>
      )}

      <div
        className={`navbar-content ${isSignedIn ? "signed-in" : "signed-out"}`}
      >
        {!isSignedIn ? (
          <div id="login" className="signin">
            <ul>
              <a
                id="a"
                style={{ textDecoration: "none", color: "white" }}
                href="/"
              >
                <span>HOME</span>
              </a>
              <a
                id="a"
                style={{ textDecoration: "none", color: "white" }}
                href="/sign-up"
              >
                <span>SIGN-UP</span>
              </a>
            </ul>
            <ul>
              <a
                id="a"
                style={{ textDecoration: "none", color: "white" }}
                href="/log-in"
                className="loginLink"
              >
                <span>LOG-IN</span>
              </a>
            </ul>
          </div>
        ) : (
          <div className="postsignin">
            <div className="childrens">
              <div className="otherRoutes">
                <div className="logo2">
                  <img src={logo} alt="Logo" />
                </div>
                <ul>
                  <a style={{ textDecoration: "none" }} href="/feed">
                    Feed
                  </a>
                  <a style={{ textDecoration: "none" }} href="/responses">
                    Responses
                  </a>
                  <a style={{ textDecoration: "none" }} href="/mylistings">
                    My Listings
                  </a>
                  <a
                    style={{ textDecoration: "none" }}
                    onClick={signout}
                    href="/log-in"
                  >
                    Sign-out
                  </a>
                  <div className="lost-item">
                    <LostItem />
                  </div>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Navbar;
