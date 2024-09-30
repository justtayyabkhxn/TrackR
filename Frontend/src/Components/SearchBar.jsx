import React, { useState } from "react";
import "boxicons";
import "../css/searchbar.css";
import { Link } from "react-router-dom";

const SearchBar = () => {
  const [query, setQuery] = useState(""); // query state

  return (
    <>
      <div className="search">
        <div>
          <input
            type="text"
            className="w-full placeholder-gray-400 text-gray-900 p-4"
            placeholder="Search"
            value={query} // bind input value to query state
            onChange={(e) => setQuery(e.target.value)} // update query as user types
            style={{
              marginTop: "20px",
              height: "10px",
              marginBottom: "20px",
              width: "300px",
              borderRadius: "20px",
              border: "none",
              boxShadow: ".1px .1px 2.5px black",
              fontFamily: "DynaPuff, system-ui",
              fontWeight: "600",
              color: "#0c151d",
            }}
          />
        </div>
        <Link to={`/searchItem?query=${query}`} style={{ textDecoration: "none" }}>
          <button
            type="submit"
            style={{ textShadow: "1px 1px 2px black", fontSize: "1.2rem" }}
            className="searchButton"
          >
            🔍
          </button>
        </Link>
      </div>
    </>
  );
};

export default SearchBar;
