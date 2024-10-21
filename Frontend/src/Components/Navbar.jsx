import React, { useEffect, useState } from "react";
import axios from "axios";
import logo from "../img/logo.jpg";
import profile from "../img/profile.png";
import PostItem from "./Post_Item";
import "../css/Navbar.css";
import { Link } from "react-router-dom";

function Navbar() {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const token = window.localStorage.getItem("token");

  const [user_info, setUserInfo] = useState(() => {
    return JSON.parse(localStorage.getItem("user")) || {};
  });
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
          // console.log("Token verified:", res);
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
              <Link
                id="a"
                style={{ textDecoration: "none", color: "white" }}
                to="/"
              >
                <span>HOME</span>
              </Link>
              <Link
                id="a"
                style={{ textDecoration: "none", color: "white" }}
                to="/sign-up"
              >
                <span>SIGN-UP</span>
              </Link>
            </ul>
            <ul>
              <Link
                id="a"
                style={{ textDecoration: "none", color: "white" }}
                to="/log-in"
                className="loginLink"
              >
                <span>LOG-IN</span>
              </Link>
            </ul>
          </div>
        ) : (
          //POST SIGN IN
          <div className="postsignin">
            <div className="childrens">
              <div className="otherRoutes">
                <div className="profile">
                  <Link
                    to={"/profile"}
                    style={{
                      borderRight: "none",
                      borderBottom: "none",
                      boxShadow: "none",
                    }}
                  >
                    <img src={profile} alt="Profile" />
                  </Link>
                    <center>
                  <div className="name">

                    <span>
                      {user_info.firstname} {user_info.lastname}
                    </span>
                  </div>
                    </center>
                </div>
                <div className="logo2">
                  <img src={logo} alt="Logo" />
                </div>
                <ul>
                  <Link style={{ textDecoration: "none" }} to="/feed">
                    Feed
                  </Link>
                  <Link style={{ textDecoration: "none" }} to="/responses">
                    Responses
                  </Link>
                  <Link style={{ textDecoration: "none" }} to="/mylistings">
                    My Listings
                  </Link>
                  <Link style={{ textDecoration: "none" }} to="/saves">
                    Saved Posts
                  </Link>
                  <Link
                  className="signOut"
                  style={{
                    backgroundColor: "#ff8b4d",
                    color: "#0c151d",
                    border: "none",
                    height: "53px",
                    fontSize: "20px",
                    boxShadow: "2px 2px 2px black",
                    textShadow: "0.2px 0.25px .1px black",
                    marginRight: "15px",
                    borderRadius:"5px",
                    textDecoration:"none"
                  }}
                    onClick={signout}
                    to="/log-in"
                  >
                    Sign-out
                  </Link>
                  <div className="lost-item">
                    <PostItem />
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
