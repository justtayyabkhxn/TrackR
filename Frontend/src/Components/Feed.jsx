import React, { useEffect, useState, useRef, useCallback } from "react";
import { setConstraint } from "../constraints";
import Navbar from "../Components/Navbar";
import "../css/feed.css";
import "../css/item_card.css";
import Axios from "axios";
import {
  Card,
  Col,
  Container,
  Row,
  Spinner,
  ButtonGroup,
  Button,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import SearchBar from "./SearchBar";

const serverUrl = import.meta.env.VITE_SERVER_URL;

export default function Feed() {
  const [user_info, setUserInfo] = useState(() => {
    return JSON.parse(localStorage.getItem("user")) || {};
  });

  const [itemsData, setItemsData] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("all"); // New state for filter
  const observer = useRef();

  const ReadMore = ({ children }) => {
    const [isReadMore, setIsReadMore] = useState(true);
    const toggleReadMore = () => setIsReadMore(!isReadMore);
    const text = children;
    const charLimit = 20;

    if (text.length <= charLimit) {
      return <span>{text}</span>;
    }

    return (
      <span>
        {isReadMore
          ? text.slice(0, text.slice(0, charLimit).lastIndexOf(" "))
          : text}{" "}
        <span
          onClick={toggleReadMore}
          className="read-or-hide"
          style={{ cursor: "pointer", color: "grey" }}
        >
          {isReadMore ? "..." : ""}
        </span>
      </span>
    );
  };

  useEffect(() => {
    setConstraint(true);
  }, []);

  const fetchItems = useCallback(async () => {
    setLoading(true);
    try {
      const response = await Axios.get(`${serverUrl}/getitem`); // Fetch all items
      if (!response.data || !response.data.postitems) {
        throw new Error("Invalid response structure");
      }
  
      const data = response.data.postitems.reverse();
      const validItems = data.filter((item) => item.status === true);
  
      setItemsData(validItems); // Set all items at once
    } catch (error) {
      console.error("Error fetching items:", error);
      setError("Failed to load items. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, []);
  

  const renderItemCard = (item, index) => {
    const created_date = new Date(item.createdAt);
    const createdAt = `${created_date.getDate()}/${
      created_date.getMonth() + 1
    }/${created_date.getFullYear()} ${created_date.getHours()}:${created_date.getMinutes()}`;

    const imageSrc =
      item.itemPictures && item.itemPictures.length > 0
        ? `${serverUrl}/${item.itemPictures[0].img}`
        : "/default-img.png";

    return (
      <Col
        key={`${item.type.toLowerCase()}-${item._id}-${index}`}
        md={3}
        xs={12}
        style={{ marginTop: "5%" }}
      >
        <Link
          to={`/item/${item.name}?cid=${item._id}&type=${item.type}`}
          style={{ textDecoration: "none" }}
        >
          <Card
            className="itemCard"
            bsPrefix="item-card"
            style={{ height: "420px", width: "350px" }}
          >
            <Card.Img
              variant="top"
              src={imageSrc}
              style={{
                padding: "5px",
                borderRadius: "10px",
                marginBottom: "10px",
              }}
            />
            <Card.Body bsPrefix="card-body">
              <Card.Title
                style={{
                  fontFamily: "Concert One, sans-serif",
                  fontSize: "1.5rem",
                  textTransform: "uppercase",
                  textDecoration: "underline",
                }}
              >
                Item: <ReadMore>{item.name}</ReadMore>
              </Card.Title>
              {item.description && (
                <Card.Text
                  style={{
                    fontFamily: "DynaPuff",
                    fontWeight: "400",
                    color: "rgb(149, 149, 149)",
                    marginBottom: "5px",
                  }}
                >
                  Description: <ReadMore>{item.description}</ReadMore>
                </Card.Text>
              )}
              <Card.Text
                style={{
                  fontFamily: "DynaPuff, system-ui",
                  fontWeight: "200",
                  fontSize: "1.05rem",
                  color: "rgb(149, 149, 149)",
                  marginBottom: "10px",
                }}
              >
                Created at: {createdAt}
              </Card.Text>
            </Card.Body>
          </Card>
        </Link>
      </Col>
    );
  };


  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  // Filter items based on activeFilter
  const filteredItems = itemsData.filter((item) => {
    if (activeFilter === "all") return true;
    return item.type.toLowerCase() === activeFilter;
  });

  // Separate lost and found items
  const lostItems = filteredItems
    .filter((item) => item.type === "Lost")
    .map((item, index) => renderItemCard(item, index));

  const foundItems = filteredItems
    .filter((item) => item.type === "Found")
    .map((item, index) => renderItemCard(item, index));

  return (
    <div style={{ marginTop: "120px" }}>
      <Navbar />
      <center>
        <span className="welcomeText">
          Welcome {user_info.firstname} {user_info.lastname}!
        </span>
      </center>

      {error && (
        <div style={{ color: "red", textAlign: "center" }}>{error}</div>
      )}
      <center>
        <SearchBar />
      </center>

      {/* Filter Buttons */}
      <Container className="mt-4 mb-4">
        <Row className="justify-content-center">
          <Col xs="auto" >
            <ButtonGroup style={{ 
              backgroundColor: "#0c151d",
              boxShadow:"0px 0px 10px black",
              
              }}>
              <Button
                variant={activeFilter === "all" ? "alert" : "outline-primary"}
                onClick={() => setActiveFilter("all")}
                style={{
                  color: "#ff8b4d",
                  textTransform:"uppercase",
                  fontFamily: "Concert One, sans-serif",
                  fontSize: "1.52rem",
                  textShadow:"1px 1px 2px black",
                  borderRight: "1px solid #ff8b4d ",
                }}
              >
                All Items
              </Button>
              <Button
                variant={
                  activeFilter === "lost" ? "success" : "outline-primary"
                }
                onClick={() => setActiveFilter("lost")}
                style={{
                  color: "#ff8b4d",
                  textTransform:"uppercase",
                  fontFamily: "Concert One, sans-serif",
                  fontSize: "1.52rem",
                  textShadow:"1px 1px 2px black",
                  border: "none",
                }}
              >
                Lost Items
              </Button>
              <Button
                variant={
                  activeFilter === "found" ? "success" : "outline-primary"
                }
                onClick={() => setActiveFilter("found")}
                style={{
                  color: "#ff8b4d",
                  textTransform:"uppercase",
                  fontFamily: "Concert One, sans-serif",
                  fontSize: "1.52rem",
                  borderLeft: "1px solid #ff8b4d",
                  borderTop: "none",
                  borderRight: "none",
                  borderBottom: "none",
                  textShadow: "1px 1px 2px black",
                }}
                
              >
                Found Items
              </Button>
            </ButtonGroup>
          </Col>
        </Row>
      </Container>

      {loading ? (
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
          />
        </div>
      ) : (
        <>
          {(activeFilter === "all" || activeFilter === "lost") &&
            lostItems.length > 0 && (
              <Container fluid>
                <h2
                  style={{
                    textAlign: "center",
                    fontFamily: "Concert One, sans-serif",
                    fontSize: "35px",
                    fontWeight: "600",
                    textDecoration: "uppercase",
                  }}
                >
                  LOST ITEMS:
                </h2>
                <div className="title-border"></div>
                <Row>{lostItems}</Row>
              </Container>
            )}

          {(activeFilter === "all" || activeFilter === "found") &&
            foundItems.length > 0 && (
              <Container fluid>
                <h2
                  style={{
                    textAlign: "center",
                    fontFamily: "Concert One, sans-serif",
                    fontSize: "35px",
                    fontWeight: "600",
                  }}
                >
                  FOUND ITEMS:
                </h2>
                <div className="title-border"></div>
                <Row>{foundItems}</Row>
              </Container>
            )}

          {filteredItems.length === 0 && !loading && (
            <div
              style={{
                textAlign: "center",
                fontFamily: "Concert One, sans-serif",
                fontSize: "24px",
                marginTop: "40px",
                color: "#666",
              }}
            >
              No items found for the selected filter.
            </div>
          )}
        </>
      )}
      {!loading && (
        <div
          style={{ height: "20px", marginBottom: "20px" }}
        />
      )}
    </div>
  );
}
