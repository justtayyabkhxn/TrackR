import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Signup from "./Components/Auth/Signup";
import Login from "./Components/Auth/Login";
import Feed from "./Components/Feed";
import Response from "./Components/Responses";
import PrivateRoute from "./Components/PrivateRoute";
import Home from "./Components/Home/Home";
import ItemPage from "./Components/ItemPage";
import MyListings from "./Components/MyListings";
import SearchResults from "./Components/SearchPage"
import ProfilePage from "./Components/ProfilePage"
import FAQs from "./Components/FAQs"
import OTPVerification from "./Components/Auth/OTPVerification";
import NotFound from "./Components/NotFound";
import ForgotPassword from "./Components/ForgotPassword";
import ChangePassword from "./Components/Auth/ChangePassword";
import AdminLogin from "./Components/AdminLogin";
import SavedPosts from "./Components/SavedPosts";
import AdminDashboard from "./Components/AdminDashboard";
import AdminPrivateRoute from "./Components/AdminPrivateRoute";
import UserPosts from "./Components/UserPosts";

function App() {
  return (
    <>
      <Router>
        <Routes>
          {/* Hello world */}
          <Route path="/" element={<Home />} />
          <Route path="/sign-up" element={<Signup />} />
          {
            <>
              <Route path="/log-in" element={<Login />} />
              <Route path="/feed" element={<PrivateRoute />}>
                <Route path="" element={<Feed />} />
              </Route>
              <Route path="/mylistings" element={<MyListings />} />
              <Route path="/item/:item" element={<ItemPage />} />
              <Route path="/responses" element={<Response />} />
              <Route path="/searchItem/" element={<SearchResults />} />
              <Route path="/profile/" element={<ProfilePage />} />
              <Route path="/faqs/" element={<FAQs />} />
              <Route path="/saves/" element={<SavedPosts />} />
              <Route path="/verify" element={<OTPVerification />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/change-password" element={<ChangePassword />} />
              <Route path="/feed" element={<PrivateRoute />}>
                <Route path="" element={<Feed />} />
              </Route>
              <Route path="/admin" element={<AdminLogin />} />
              <Route path="/admin-dashboard" element={<AdminPrivateRoute />}>
                <Route path="" element={<AdminDashboard />} />
              </Route>
              <Route path="/user/:userId" element={<AdminPrivateRoute />}>
                <Route path="" element={<UserPosts />} />
              </Route>
               {/* <Route path="/admin-dashboard" element={<AdminDashboard />} /> */}
              <Route path="*" element={<NotFound />} />
            </>
          }
          /*
        </Routes>
      </Router>
    </>
  );
}

export default App;
