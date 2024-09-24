import React, { useState, useEffect, useCallback } from "react";
import Navbar from "./Navbar";
import "../css/myresponses.css";
import Axios from "axios";
import { Button, Modal, Badge } from "react-bootstrap";

function Response() {
  const [responses, setResponses] = useState([]);
  const [showNumber, setShowNumber] = useState(false);
  const [PhoneNumber, setPhoneNumber] = useState("");

  const handleCloseNumber = () => setShowNumber(false);

  const handleShowNumber = useCallback((response) => {
    Axios.get(`http://localhost:5000/getnumber/${response.belongsTo}`)
      .then((res) => {
        setPhoneNumber(res.data.Number);
        setShowNumber(true);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  useEffect(() => {
    const userId = JSON.parse(localStorage.getItem("user"))._id;
    Axios.get(`http://localhost:5000/myresponses/${userId}`)
      .then((res) => {
        const responseItems = res.data.item;
        const reversedResponses = responseItems.reverse().map((response) => {
          const createdDate = new Date(response.createdAt);
          const formattedDate = `${createdDate.getDate()}/${
            createdDate.getMonth() + 1
          }/${createdDate.getFullYear()} ${createdDate.getHours()}:${createdDate.getMinutes()}`;

          return (
            <div
              key={response.itemId}
              className="responese-card"
              style={{
                fontFamily: "DynaPuff, system-ui",
                fontWeight: "400",
                cursor: "pointer",
                boxShadow: "1px 1px 5px black",
                padding: "15px",
                marginLeft: "30px",
                marginBottom: "30px",
                backgroundColor: "#0c151d",
                borderBottom: "5px solid #ff8b4d",
              }}
            >
              <h5 style={{ marginTop: "15px" }}>
                <span
                  className="attributes"
                  style={{
                    fontFamily: "DynaPuff, system-ui",
                    fontWeight: "400",
                    fontSize: "1.35rem",
                    textTransform: "uppercase",
                    textDecoration: "underline",
                    textShadow: "1px 1px 2px black",
                    marginBottom: "20px",
                    color: "#ff8b4d",
                  }}
                >
                  Item ID:
                </span>{" "}
                <span
                  style={{
                    fontFamily: "DynaPuff, system-ui",
                    fontWeight: "400",
                    fontSize: "1.35rem",
                    textTransform: "capitalize",
                    textShadow: "1px 1px 2px black",
                    marginBottom: "20px",
                    color: "#b5b3b3",
                  }}
                >
                  {response.itemId}
                </span>
              </h5>
              <h5 style={{ marginTop: "15px" }}>
                <span
                  className="attributes"
                  style={{
                    fontFamily: "DynaPuff, system-ui",
                    fontWeight: "400",
                    fontSize: "1.35rem",
                    textTransform: "uppercase",
                    textDecoration: "underline",
                    textShadow: "1px 1px 2px black",
                    marginBottom: "20px",
                    color: "#ff8b4d",
                  }}
                >
                  Question:
                </span>{" "}
                <span
                  style={{
                    fontFamily: "DynaPuff, system-ui",
                    fontWeight: "400",
                    fontSize: "1.35rem",
                    textTransform: "capitalize",
                    textShadow: "1px 1px 2px black",
                    marginBottom: "20px",
                    color: "#b5b3b3",
                  }}
                >
                  {response.question}
                </span>
              </h5>
              <h5 style={{ marginTop: "15px" }}>
                <span
                  className="attributes"
                  style={{
                    fontFamily: "DynaPuff, system-ui",
                    fontWeight: "400",
                    fontSize: "1.35rem",
                    textTransform: "uppercase",
                    textDecoration: "underline",
                    textShadow: "1px 1px 2px black",
                    marginBottom: "20px",
                    color: "#ff8b4d",
                  }}
                >
                  Your Answer:
                </span>{" "}
                <span
                  style={{
                    fontFamily: "DynaPuff, system-ui",
                    fontWeight: "400",
                    fontSize: "1.35rem",
                    textTransform: "capitalize",
                    textShadow: "1px 1px 2px black",
                    marginBottom: "20px",
                    color: "#b5b3b3",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "DynaPuff, system-ui",
                      fontWeight: "400",
                      fontSize: "1.35rem",
                      textTransform: "capitalize",
                      textShadow: "1px 1px 2px black",
                      marginBottom: "20px",
                      color: "#b5b3b3",
                    }}
                  >
                    {response.answer}
                  </span>
                </span>
              </h5>
              <h5 style={{ marginTop: "15px" }}>
                <span
                  className="attributes"
                  style={{
                    fontFamily: "DynaPuff, system-ui",
                    fontWeight: "400",
                    fontSize: "1.35rem",
                    textTransform: "uppercase",
                    textDecoration: "underline",
                    textShadow: "1px 1px 2px black",
                    marginBottom: "20px",
                    color: "#ff8b4d",
                  }}
                >
                  Time:
                </span>{" "}
                <span
                  style={{
                    fontFamily: "DynaPuff, system-ui",
                    fontWeight: "400",
                    fontSize: "1.35rem",
                    textTransform: "capitalize",
                    textShadow: "1px 1px 2px black",
                    marginBottom: "20px",
                    color: "#b5b3b3",
                  }}
                >
                  {formattedDate}
                </span>
              </h5>
              {response.response === "Moderation" ? (
                <Badge
                  pill
                  bg="primary"
                  style={{
                    marginTop: "15px",
                    letterSpacing: "1px",
                    fontSize: "0.95rem",
                    textShadow: "0.5px 0.5px 2px black",
                    fontFamily: "DynaPuff",
                    fontWeight: "400",
                  }}
                >
                  Moderation
                </Badge>
              ) : response.response === "Yes" ? (
                <>
                  <Badge pill bg="success">
                    Approved
                  </Badge>
                  <Button
                    className="btn-primary"
                    onClick={() => handleShowNumber(response)}
                  >
                    Show Number
                  </Button>
                </>
              ) : (
                <Badge pill bg="danger">
                  Opps!!
                </Badge>
              )}
            </div>
          );
        });

        setResponses(reversedResponses);
      })
      .catch((err) => {
        console.error(err);
      });
  }, [handleShowNumber]);

  return (
    <>
      <Navbar />
      <Modal show={showNumber} onHide={handleCloseNumber} backdrop="static">
        <Modal.Body>
          <p>Here is the number: {PhoneNumber}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleCloseNumber}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      <div className="response-title">
        <h2
          style={{
            textTransform: "uppercase",
            textAlign: "center",
            fontFamily: "Concert One, sans-serif",
            textTransform: "uppercase",
            fontWeight: "600",
          }}
        >
          Your responses
        </h2>
        <div className="title-border"></div>
      </div>
      <div className="responses-list">{responses}</div>
    </>
  );
}

export default Response;
