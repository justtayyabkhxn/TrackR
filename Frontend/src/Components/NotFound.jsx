import React from "react";
import Navbar from "./Navbar"; // Assuming you have a custom Navbar component in the './Navbar' file
import notFoundImg from "../img/not-found.jpg";
function NotFound() {
  return (
    <>
      <Navbar /> {/* Render your custom Navbar */}
      <div style={{ align: "center", marginTop: "50px" }}>
        <center>
          <img src={notFoundImg} alt="NOT FOUND 404" style={{height:"500px"}} />
        </center>
      </div>
    </>
  );
}

export default NotFound;
