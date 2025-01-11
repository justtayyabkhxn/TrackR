import React, { useState } from "react";
import { Navigate, Outlet } from "react-router-dom";

const AdminPrivateRoute = () => {
  // const admin = "67075569252b464e56db8e31";
  const admin = import.meta.env.VITE_ADMIN;

  const [user_info, setUserInfo] = useState(() => {
    return JSON.parse(localStorage.getItem("user")) || {};
  });
  const user_id = user_info._id;
  console.log(user_id);

  return user_id == admin ? <Outlet /> : <Navigate to="/feed" />;
};

export default AdminPrivateRoute;
