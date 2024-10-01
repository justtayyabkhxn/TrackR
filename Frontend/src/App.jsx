import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Signup from "./Components/SignUp";
import Login from "./Components/Login";
import Feed from "./Components/Feed";
import Response from "./Components/Responses";
import PrivateRoute from "./Components/PrivateRoute";
import Home from "./Components/Home";
import ItemPage from "./Components/ItemPage";
import MyListings from "./Components/MyListings";
import SearchResults from "./Components/SearchPage"
import ProfilePage from "./Components/ProfilePage"

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
              <Route path="/:item" element={<ItemPage />} />

              <Route path="/responses" element={<Response />} />
              <Route path="/searchItem/" element={<SearchResults />} />
              <Route path="/profile/" element={<ProfilePage />} />
            </>
          }
          /*
          {/* <Route path="*" element={<NotFound />} /> */}
        </Routes>
      </Router>
    </>
  );
}

export default App;
