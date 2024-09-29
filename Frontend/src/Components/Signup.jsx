import React, { useState } from "react";
import "../css/newSignup.css";
import axios from "axios";
import Navbar from "../Components/Navbar";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [info, setInfo] = useState("");
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    number: "",
    password: "",
    cpassword: "",
  });
  const navigate = useNavigate(); // Use the useNavigate hook

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({
      ...formData,
      [id]: value,
    });
  };

  const submit = () => {
    setInfo("");

    axios({
      url: "http://localhost:5000/signup",
      method: "POST",
      data: formData,
      withCredentials: true, // Include this if dealing with cookies or authentication
    })
      .then((response) => {
        toast.success("Login Successfull !", {
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
        setInfo("Sign up successful!"); // Update info with a string message
        if (response.data && response.data.token) {
          navigate("/log-in"); // Navigate using the useNavigate hook
        }
      })
      .catch((error) => {
        console.log("Error occurred:", error);
      });
  };

  return (
    <>
      <Navbar />
      <div>
        <form className="Box-1">
          <h1 className="name">Sign up</h1>
          <p style={{ color: "white" }}>{info}</p>
          <div className="row1">
            <input
              type="text"
              id="firstname"
              placeholder="First Name"
              required
              value={formData.firstname}
              onChange={handleChange}
            />
            <input
              type="text"
              id="lastname"
              placeholder="Last Name"
              required
              value={formData.lastname}
              onChange={handleChange}
            />
          </div>
          <div className="row1">
            <input
              type="email"
              id="email"
              placeholder="Email"
              required
              value={formData.email}
              onChange={handleChange}
            />
            <input
              type="number"
              id="number"
              placeholder="Phone Number"
              required
              value={formData.number}
              onChange={handleChange}
            />
          </div>
          <div className="row1">
            <input
              type="password"
              placeholder="Password"
              id="password"
              required
              value={formData.password}
              onChange={handleChange}
            />
            <input
              type="password"
              placeholder="Confirm Password"
              id="cpassword"
              required
              value={formData.cpassword}
              onChange={handleChange}
            />
          </div>
          <button type="button" className="submit" onClick={submit}>
            Submit
          </button>
          <p style={{ color: "white", fontSize: "21px" }}>
            Have an account?{" "}
            <a href="/log-in">Click here</a>
          </p>
        </form>
      </div>
    </>
  );
};

export default Signup;
