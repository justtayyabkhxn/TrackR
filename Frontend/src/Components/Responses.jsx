import React, { useState, useEffect, useCallback } from "react";
import Navbar from "./Navbar";
import "../css/myresponses.css";
import Axios from "axios";
import { Button, Modal,Spinner } from "react-bootstrap";
import axios from "axios";

const serverUrl = import.meta.env.VITE_SERVER_URL;


function Response() {
  const [responses, setResponses] = useState([]);
  const [showNumber, setShowNumber] = useState(false);
  const [PhoneNumber, setPhoneNumber] = useState("");
  const [itemNames, setItemNames] = useState({}); // Store item names in an object
  const [loading, setLoading] = useState(true); // Loading state


  const handleCloseNumber = () => setShowNumber(false);

  const getItemName = useCallback(async (itemId) => {
    
    try {
      const res = await axios.get(`${serverUrl}/getItemName/${itemId}`);
      return res.data.postName; // Ensure you access res.data.postName properly
    } catch (err) {
      console.error(err);
      return null; // Return null or handle the error as you like
    }
  }, []);

  const handleShowNumber = useCallback((response) => {
    Axios.get(`${serverUrl}/getnumber/${response.belongsTo}`)
      .then((res) => {
        setPhoneNumber(res.data.Number);
        setShowNumber(true);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  useEffect(() => {
    const fetchResponsesAndItemNames = async () => {
      const userId = JSON.parse(localStorage.getItem("user"))._id;
      setLoading(true);
      try {
        const res = await Axios.get(`${serverUrl}/myresponses/${userId}`);
        const responseItems = res.data.item;
        const reversedResponses = responseItems.reverse();

        // Fetch all item names and store them in the state
        const names = {};
        await Promise.all(reversedResponses.map(async (response) => {
          const name = await getItemName(response.itemId);
          names[response.itemId] = name; // Store name with itemId as key
        }));

        setItemNames(names); // Update state with fetched names
        setResponses(reversedResponses); // Set the responses after fetching names
      } catch (err) {
        console.error(err);
      }
      finally {
        setLoading(false); // End loading
      }
    };

    fetchResponsesAndItemNames(); // Call the function when the component is mounted
  }, [getItemName]);

  return (
    <>
      <div>
        <div style={{ marginTop: "120px" }}>
          <Navbar />
          <Modal show={showNumber} onHide={handleCloseNumber} backdrop="static">
            <Modal.Body
              style={{
                backgroundColor: "#0c151d",
                border: "none",
                height: "53px",
                fontSize: "20px",
                marginRight: "0px",
              }}
            >
              <p
                style={{
                  color: "#ff8b4d",
                  textShadow: "2px 2px 1px black",
                }}
              >
                Here is the number: {"   "}
                <span
                  style={{
                    fontFamily: "DynaPuff",
                    fontWeight: "400",
                    color: "white",
                    textShadow: "2px 2px 1px black",
                  }}
                >
                  {PhoneNumber}
                </span>
              </p>
            </Modal.Body>
            <Modal.Footer
              style={{
                backgroundColor: "#0c151d",
                borderTop: "2px solid #ff8b4d",
                border: "none",
                fontSize: "20px",
                marginRight: "0px",
              }}
            >
              <Button
                variant="primary"
                onClick={handleCloseNumber}
                style={{
                  fontFamily: "DynaPuff",
                  fontWeight: "400",
                  color: "white",
                  textShadow: "2px 2px 1px black",
                  backgroundColor: "#0ac600",
                  border: "none",
                  boxShadow: "1px 1px 2px black",
                }}
              >
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
                fontWeight: "600",
              }}
            >
              YOUR RESPONSES
            </h2>
            <div className="title-border"></div>
          </div>
  
          {/* Loading Spinner */}
          {loading ? (
            <div className="spinner-container" style={{ textAlign: "center", marginTop: "20px" }}>
              <Spinner
              style={{ fontSize: "8rem", color: "black" }}
              animation="border"
              role="status"
              variant="dark"
            >
              {/* Loading spinner */}
            </Spinner>
            </div>
          ) : (
            <div className="responses-list">
              {responses.length>0 ? (responses.map((response) => {
                const createdDate = new Date(response.createdAt);
                const formattedDate = `${createdDate.getDate()}/${
                  createdDate.getMonth() + 1
                }/${createdDate.getFullYear()} ${createdDate.getHours()}:${createdDate.getMinutes()}`;
  
                return (
                  <div
                    key={response.itemId}
                    className="response-card"
                    style={{
                      fontFamily: "DynaPuff, system-ui",
                      fontWeight: "400",
                      cursor: "pointer",
                      boxShadow: "1px 1px 5px black",
                      padding: "15px",
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
                        Item Name:
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
                        {itemNames[response.itemId] || "Loading..."}
                      </span>
                    </h5>
  
                    {/* Other fields of the response */}
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
                        {response.question} ?
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
                        {response.answer}
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
                      <span
                        style={{
                          marginTop: "15px",
                          marginBottom: "15px",
                          letterSpacing: "1px",
                          fontSize: "0.95rem",
                          backgroundColor: "#ff8b4d",
                          textShadow: "0px 0px 0.5px black",
                          fontFamily: "DynaPuff",
                          fontWeight: "400",
                          borderRadius: "15px",
                          color: "#0c151d",
                          boxShadow: "2px 2px 2px black",
                        }}
                        className="badge"
                      >
                        Moderation
                      </span>
                    ) : response.response === "Yes" ? (
                      <>
                        <span
                          style={{
                            marginTop: "15px",
                            marginBottom: "15px",
                            letterSpacing: "1px",
                            fontSize: "0.95rem",
                            backgroundColor: "#0ac600",
                            textShadow: "0px 0px 0.5px black",
                            fontFamily: "DynaPuff",
                            fontWeight: "400",
                            borderRadius: "15px",
                            color: "#0c151d",
                            boxShadow: "2px 2px 2px black",
                          }}
                          className="badge"
                        >
                          Approved
                        </span>
                        <Button
                          className="view-phone"
                          onClick={() => handleShowNumber(response)}
                          style={{
                            fontFamily: "DynaPuff, system-ui",
                            fontWeight: "400",
                            textShadow: "1px 1.5px 1px black",
                            backgroundColor: "#0ac600",
                            boxShadow: "1px 1px 5px black",
                            marginLeft: "20px",
                            border: "none",
                          }}
                        >
                          View Phone Number
                        </Button>
                      </>
                    ) : (
                      <span
                        style={{
                          marginTop: "15px",
                          marginBottom: "15px",
                          letterSpacing: "1px",
                          fontSize: "0.95rem",
                          backgroundColor: "#ff0000",
                          textShadow: "0px 0px 0.5px black",
                          fontFamily: "DynaPuff",
                          fontWeight: "400",
                          borderRadius: "15px",
                          color: "#0c151d",
                          boxShadow: "2px 2px 2px black",
                        }}
                        className="badge"
                      >
                        Not Approved
                      </span>
                    )}
                  </div>
                );
              })):(
                <div style={{
                  color: "red",
                  textAlign: "center",
                  marginLeft:"50rem",
                  fontSize: "2rem",
                  fontFamily: "DynaPuff",
                  fontWeight: "400",
                  textShadow: "1px 1px 2px black",
                }}>No Responses</div>
              )}
              
            </div>
          )}
        </div>
      </div>
    </>
  );
}  

export default Response;