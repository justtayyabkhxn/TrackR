import React, { useEffect, useState } from "react";
import axios from "axios";
import { Navbar, Nav, NavDropdown, Container, Image } from "react-bootstrap";
import { Link } from "react-router-dom";
import logo from "../img/logo.png";
import profile from "../img/profile.png";
import PostItem from "./Post_Item";
import "../css/Navbar.css";

function NavBar() {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const token = window.localStorage.getItem("token");
  const admin = "67075569252b464e56db8e31";
  const [userInfo, setUserInfo] = useState(() => {
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
          setIsSignedIn(true); // Set signed-in status
        })
        .catch((err) => {
          console.error("Token verification failed:", err);
          setIsSignedIn(false); // Set not signed-in if token verification fails
        });
    } else {
      setIsSignedIn(false); // Set not signed-in if no token
    }
  }, [token]);

  const signOut = () => {
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
      <Navbar collapseOnSelect expand="xl" className="symbol">
        <Container>
          <Navbar.Toggle
            aria-controls="responsive-navbar-nav"
            className="custom-toggler"
          >
            <span
              className="custom-toggler-icon"
              style={{
                fontFamily: "DynaPuff",
                fontWeight: "400",
                textShadow: "1px 1px 2px black",
              }}
            >
              menu
            </span>
          </Navbar.Toggle>
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="me-auto">
              <div className="otherRoutes">
                {!isSignedIn ? (
                  <>
                    <Nav.Link className="a" as={Link} to="/sign-up">
                      Sign-Up
                    </Nav.Link>
                    <Nav.Link as={Link} to="/log-in">
                      Log-In
                    </Nav.Link>
                    <Nav.Link as={Link} to="/">
                      Home
                    </Nav.Link>
                  </>
                ) : (
                  <>
                    <div className="postsignin">
                      <Nav.Link as={Link} to="/feed" className="routes">
                        Feed
                      </Nav.Link>
                      <Nav.Link as={Link} to="/responses" className="routes">
                        Responses
                      </Nav.Link>
                      <Nav.Link as={Link} to="/mylistings" className="routes">
                        My Listings
                      </Nav.Link>
                      <Nav.Link as={Link} to="/saves" className="routes">
                        Saved Posts
                      </Nav.Link>
                      {admin === userInfo._id && (
                        <Nav.Link as={Link} to="/admin-dashboard" className="routes">
                          Admin
                        </Nav.Link>
                      )}
                      <PostItem />
                    </div>
                  </>
                )}
              </div>
            </Nav>

            <Nav>
              {isSignedIn && (
                <div>
                  <NavDropdown
                    className="dropDown"
                    title={
                      <Image
                        src={profile}
                        className="Profile"
                        roundedCircle
                        style={{ height: "50px", width: "50px" }}
                      />
                    }
                    align="end"
                  >
                    <NavDropdown.Item as="span">
                      <span style={{ textAlign: "center" }}>
                        {userInfo.firstname} {userInfo.lastname}
                      </span>
                    </NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item>
                      <Nav.Link as={Link} to="/profile">
                        <span
                          style={{
                            textAlign: "center",
                            color: "black",
                            width: "fit-content",
                          }}
                        >
                          Change Password
                        </span>
                      </Nav.Link>
                    </NavDropdown.Item>
                    <NavDropdown.Item
                      onClick={signOut}
                      style={{ textAlign: "center" }}
                    >
                      <span
                        style={{
                          textAlign: "center",
                          color: "black",
                          width: "fit-content",
                        }}
                      >
                        Sign-Out
                      </span>
                    </NavDropdown.Item>
                  </NavDropdown>
                </div>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </div>
  );
}

export default NavBar;
