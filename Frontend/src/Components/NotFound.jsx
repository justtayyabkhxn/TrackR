import React from "react";
import Navbar from "./Navbar";
import notFoundImg from "../img/not-found.jpg";
function NotFound() {
  return (
    <>
      <Navbar />
      <div style={{ align: "center", marginTop: "50px" }}>
        <center>
          <img
            src={notFoundImg}
            alt="NOT FOUND 404"
            style={{ height: "500px" }}
          />
        </center>
      </div>
    </>
  );
}

export default NotFound;
