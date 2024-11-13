import React, { useState, useEffect, useCallback } from "react";
import Navbar from "./Navbar";
import "../css/myresponses.css";
import Axios from "axios";
import { Button, Modal, Spinner } from "react-bootstrap"; // Import Spinner
import axios from "axios";

function Response() {
  const [responses, setResponses] = useState([]);
  const [showNumber, setShowNumber] = useState(false);
  const [PhoneNumber, setPhoneNumber] = useState("");
  const [itemNames, setItemNames] = useState({});
  const [loading, setLoading] = useState(true); // Loading state

  const handleCloseNumber = () => setShowNumber(false);

  const getItemName = useCallback(async (itemId) => {
    try {
      const res = await axios.get(`http://localhost:5000/getItemName/${itemId}`);
      return res.data.postName;
    } catch (err) {
      console.error(err);
      return null;
    }
  }, []);

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
    const fetchResponsesAndItemNames = async () => {
      const userId = JSON.parse(localStorage.getItem("user"))._id;
      try {
        const res = await Axios.get(`http://localhost:5000/myresponses/${userId}`);
        const responseItems = res.data.item;
        const reversedResponses = responseItems.reverse();

        const names = {};
        await Promise.all(reversedResponses.map(async (response) => {
          const name = await getItemName(response.itemId);
          names[response.itemId] = name;
        }));

        setItemNames(names);
        setResponses(reversedResponses);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false); // Set loading to false after fetching
      }
    };

    fetchResponsesAndItemNames();
  }, [getItemName]);

  return (
    <>
      <div style={{ marginTop: "120px" }}>
        <Navbar />
        <Modal show={showNumber} onHide={handleCloseNumber} backdrop="static">
          {/* Modal Content */}
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

        {loading ? ( // Show spinner if loading
         <div
         style={{
           display: "flex",
           justifyContent: "center",
           width: "100%",
           padding: "20px",
         }}
       >
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
          <div>
          <div className="responses-list">
          {responses.length > 0 ? (
            responses.map((response) => (
              // Render each response card here
              <div key={response._id}>
                {/* Example of rendering a response card */}
                <h3>{response.title}</h3>
                <p>{response.description}</p>
              </div>
              
            ))
            
          ) : (
            <div className="message" style={{
              color: "red",
              left: "50%",
              fontSize: "2rem",
              fontFamily: "DynaPuff",
              fontWeight: "400",
              textShadow: "1px 1px 2px black",
            }}>No Responses</div> 
          )}
        </div>
        </div>
        )}
      </div>
    </>
  );
}

export default Response;
