import React, { useState, useEffect } from "react";
import Axios from "axios";
import "../../css/AdminDashboard.css";
import Navbar from "../../Components/Navbar";
import { Button, Modal, Form } from "react-bootstrap";
import { Link } from "react-router-dom";

const serverUrl = import.meta.env.VITE_SERVER_URL;


export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showEmailModel, setShowEmailModel] = useState(false);
  const [emailMessage, setEmailMessage] = useState("");
  const [emailSubject, setemailSubject] = useState("");
  const [emailUserId, setEmailUserId] = useState("");

  // Fetch users on component mount
  useEffect(() => {
    Axios.get(`${serverUrl}/users`)
      .then((response) => setUsers(response.data))
      .catch((error) => console.error("Error fetching users:", error));
  }, [users]); // Fetch users only once on mount

  const handleUserClick = (user) => {
    setSelectedUser(user);
  };

  const handleDeleteUser = (userId) => {
    Axios.delete(`${serverUrl}/${userId}`)
      .then(() => setUsers(users.filter((user) => user.id !== userId)))
      .catch((error) => console.error("Error deleting user:", error));
  };

  const handleOpenEmailModal = (userId) => {
    setEmailUserId(userId);
    setShowEmailModel(true);
  };

  const handleSendMail = () => {
    const mailData = {
      subject: emailSubject,
      emailBody: emailMessage,
      userId: emailUserId,
    };

    setShowEmailModel(false);
    Axios.post(`${serverUrl}/sendMail`, mailData)
      .then(() => {
        setEmailMessage("");
        setemailSubject("");
      })
      .catch((err) => console.error("Error sending email:", err));
  };

  return (
    <>
    <div style={{marginTop:"120px"}}>
      <Navbar />
      <div className="admin-dashboard">
        <div className="listing-title">
          <h2 style={{ textTransform: "uppercase", textAlign: "center" }}>
            Admin Dashboard
          </h2>
          <div className="title-border"></div>
        </div>
        <div className="user-list">
          {users.map((user) => (
            <div className="user-row" key={user._id}>
              <span className="user-name" onClick={() => handleUserClick(user)}>
                <div className="user-detail">
                  <Link
                    to={`/userProfile/${user._id}`}
                    style={{ textDecoration: "none" }}
                  >
                    <h2 style={{ color: "#0c151d", textDecoration: "none" }}>
                      {user.firstname} {user.lastname}
                    </h2>
                  </Link>
                  <p>Email: {user.email}</p>
                  <p>Phone: {user.number}</p>
                  <p>User id: {user._id}</p>

                  <Button
                    onClick={() => handleDeleteUser(user._id)}
                    className="delete-button"
                    style={{
                      fontFamily: "DynaPuff",
                      fontWeight: "400",
                      fontSize: "1.05rem",
                      textShadow: "0.5px 0.5px 2px black",
                    }}
                  >
                    Delete User
                  </Button>
                  <Button
                    onClick={() => handleOpenEmailModal(user._id)}
                    className="mail-button"
                    style={{
                      fontFamily: "DynaPuff",
                      fontWeight: "400",
                      fontSize: "1.05rem",
                      textShadow: "0.5px 0.5px 2px black",
                    }}
                  >
                    Send Mail
                  </Button>
                </div>
              </span>
            </div>
          ))}
        </div>

        <Modal show={showEmailModel} onHide={() => setShowEmailModel(false)}>
          <Modal.Header
            closeButton
            closeVariant="white"
            style={{
              fontFamily: "DynaPuff",
              fontWeight: "400",
              fontSize: "1.35rem",
              backgroundColor: "#0c151d",
              border: "none",
              color: "#ff8b4d",
              textShadow: "0.5px 0.5px 0.2px black",
            }}
          >
            <Modal.Title style={{ fontFamily: "DynaPuff", fontWeight: "400" }}>
              Send Mail
            </Modal.Title>
          </Modal.Header>
          <Modal.Body
            style={{
              fontSize: "1.05rem",
              backgroundColor: "#0c151d",
              border: "none",
              color: "#ff8b4d",
              textShadow: "0.5px 0.5px 0.2px black",
              marginTop: "0px",
            }}
          >
            <Form>
              <Form.Group>
                <Form.Label
                  style={{ fontFamily: "DynaPuff", fontWeight: "400" }}
                >
                  Subject
                </Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter subject"
                  value={emailSubject}
                  onChange={(e) => setemailSubject(e.target.value)}
                />
              </Form.Group>
              <Form.Group>
                <Form.Label
                  style={{ fontFamily: "DynaPuff", fontWeight: "400" }}
                >
                  Email
                </Form.Label>
                <Form.Control
                  as="textarea"
                  placeholder="Enter Email"
                  value={emailMessage}
                  onChange={(e) => setEmailMessage(e.target.value)}
                  style={{ height: "250px" }}
                />
              </Form.Group>
              <Button
                variant="primary"
                onClick={handleSendMail}
                style={{
                  backgroundColor: "#52a302",
                  border: "none",
                  marginTop: "15px",
                }}
              >
                Submit
              </Button>
            </Form>
          </Modal.Body>
        </Modal>
      </div>
      </div>
    </>
  );
}
