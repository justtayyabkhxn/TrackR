import React, { useState, useEffect } from "react";
import Axios from "axios";
import "../css/AdminDashboard.css";
import Navbar from "../Components/Navbar";

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    Axios.get("http://localhost:5000/users") // Replace with your backend API URL
      .then((response) => setUsers(response.data))
      .catch((error) => console.error("Error fetching users:", error));
  }, []);

  const handleUserClick = (user) => {
    setSelectedUser(user);
  };

  const handleDeleteUser = (userId) => {
    Axios.delete(`http://localhost:5000/users/${userId}`)
      .then(() => setUsers(users.filter((user) => user.id !== userId)))
      .catch((error) => console.error("Error deleting user:", error));
  };

  const handleSendMail = (userEmail) => {
    window.open(`mailto:${userEmail}`);
  };

  return (
    <>
      <Navbar />
      {/* {console.log(users)} */}
      <div className="admin-dashboard">
        <div className="listing-title">
          <h2
            style={{
              textTransform: "uppercase",
              textAlign: "center",
              fontFamily: "Concert One, sans-serif",
              fontWeight: "600",
            }}
          >
            Admin Dashboard
          </h2>
          <div className="title-border"></div>
        </div>
        <div className="user-list">
          {users.map((user) => (
            <div className="user-row" key={user._id}
            >
              <span className="user-name" onClick={() => handleUserClick(user)}>
                <div className="user-detail">
                  {/* {console.log(user)} */}
                  <h2>{user.firstname}'s Details</h2>
                  <p>Email: {user.email}</p> 
                  <p>Phone: {user.number}</p> 
                  <p>User id: {user._id}</p>
                  {/* Add more user fields here as needed */}
                
                {/* {user.name} */}
                <button
                  onClick={() => handleDeleteUser(user.id)}
                  className="delete-button"
                >
                  Delete User
                </button>
                <button
                  onClick={() => handleSendMail(user.email)}
                  className="mail-button"
                >
                  Send Mail
                </button>
                </div>
              </span>
            </div>
          ))}
        </div>
        {/* <UserDetail/>
        {selectedUser && (
          <UserDetail
            user={user}
          />
        )} */}
      </div>
    </>
  );
}
