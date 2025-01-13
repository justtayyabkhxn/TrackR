import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import { useLocation } from "react-router-dom";
import "../css/feed.css";
import "../css/item_card.css";
import Axios from "axios";
import { Card, Col, Container, Row, Spinner, ButtonGroup, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { setConstraint } from "../constraints";

const serverUrl = import.meta.env.VITE_SERVER_URL;

const SearchPage = () => {
  const [query, setQuery] = useState("");
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const queryValue = params.get("query");

  const [user_info, setUserInfo] = useState(() => {
    return JSON.parse(localStorage.getItem("user")) || {};
  });

  const [itemsData, setItemsData] = useState([]); // Changed to store raw data
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all'); // New filter state

  const ReadMore = ({ children }) => {
    const text = children;
    const [isReadMore, setIsReadMore] = useState(true);
    const toggleReadMore = () => setIsReadMore(!isReadMore);

    return (
      <span>
        {isReadMore ? text.slice(0, 10) : text}
        <span
          onClick={toggleReadMore}
          className="read-or-hide"
          style={{ cursor: "pointer" }}
        >
          {isReadMore ? "...." : " show less"}
        </span>
      </span>
    );
  };

  useEffect(() => {
    setConstraint(true);
    setLoading(true);
    if (queryValue) {
      setQuery(queryValue);
    } else {
      console.error("Query is missing or undefined");
    }

    const fetchItems = async () => {
      try {
        const response = await Axios.get(
          `${serverUrl}/searchItem/${queryValue}`
        );
        if (!response.data || !response.data.data) {
          throw new Error("Invalid response structure");
        }
        const data = response.data.data.reverse();
        if (!data.length) {
          setError("NO ITEMS FOUND");
        }

        // Store raw data instead of rendered components
        const validItems = data.filter(item => item.status === true);
        setItemsData(validItems);
      } catch (error) {
        console.error("Error fetching items:", error);
        setError("Failed to load items. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, [queryValue]);

  const renderItemCard = (item) => {
    const created_date = new Date(item.createdAt);
    const createdAt = `${created_date.getDate()}/${
      created_date.getMonth() + 1
    }/${created_date.getFullYear()} ${created_date.getHours()}:${created_date.getMinutes()}`;

    const imageSrc =
      item.itemPictures && item.itemPictures.length > 0
        ? `${serverUrl}/${item.itemPictures[0].img}`
        : "/default-img.png";

    return (
      <Col key={`${item.type.toLowerCase()}-${item._id}`} md={3} xs={12} style={{ marginTop: "2%" }}>
        <Link
          to={`/item/${item.name}?cid=${item._id}&type=${item.type}`}
          style={{ textDecoration: "none" }}
        >
          <Card
            bsPrefix="item-card"
            style={{
              cursor: "pointer",
              boxShadow: "1px 1px 5px black",
              padding: "10px",
              marginLeft: "30px",
              marginBottom: "30px",
              backgroundColor: "#0c151d",
              borderBottom: "5px solid #ff8b4d",
            }}
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
                  fontWeight: "1.5rem",
                  fontSize: "1.5rem",
                  textTransform: "uppercase",
                  textDecoration: "underline",
                  textShadow: "1px 1px 2px black",
                  marginBottom: "20px",
                }}
              >
                Item: <ReadMore>{item.name}</ReadMore>
              </Card.Title>
              {item.description && (
                <Card.Text
                  style={{
                    fontFamily: "DynaPuff",
                    fontWeight: "400",
                    textShadow: "1px 1px 2px black",
                    color: "rgb(149, 149, 149)",
                    letterSpacing: "0.75px",
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
                  textShadow: "1px 1px 2px black",
                  color: "rgb(149, 149, 149)",
                  letterSpacing: "0.85px",
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

  // Filter items based on activeFilter
  const filteredItems = itemsData.filter(item => {
    if (activeFilter === 'all') return true;
    return item.type.toLowerCase() === activeFilter;
  });

  // Separate lost and found items
  const lostItems = filteredItems
    .filter(item => item.type === "Lost")
    .map(item => renderItemCard(item));

  const foundItems = filteredItems
    .filter(item => item.type === "Found")
    .map(item => renderItemCard(item));

  return (
    <div>
      <Navbar />
      <div style={{ marginTop: "120px" }}>
        <span
          style={{
            fontFamily: "Concert One, sans-serif",
            marginLeft: "5px",
            textTransform: "uppercase",
            margin: "25px",
            fontSize: "45px",
            borderBottom: "5px solid #ff8b4d",
          }}
        >
          You Searched for "{query}" !
        </span>

        {/* Filter Buttons */}
        <Container className="mt-4 mb-4">
          <Row className="justify-content-center">
            <Col xs="auto">
              <ButtonGroup>
                <Button
                  variant={activeFilter === 'all' ? 'primary' : 'outline-primary'}
                  onClick={() => setActiveFilter('all')}
                  style={{
                    fontFamily: "Concert One, sans-serif",
                    fontSize: "1.2rem",
                    backgroundColor: activeFilter === 'all' ? '#0c151d' : 'transparent',
                    borderColor: '#0c151d',
                    color: activeFilter === 'all' ? '#fff' : '#0c151d'
                  }}
                >
                  All Items
                </Button>
                <Button
                  variant={activeFilter === 'lost' ? 'primary' : 'outline-primary'}
                  onClick={() => setActiveFilter('lost')}
                  style={{
                    fontFamily: "Concert One, sans-serif",
                    fontSize: "1.2rem",
                    backgroundColor: activeFilter === 'lost' ? '#0c151d' : 'transparent',
                    borderColor: '#0c151d',
                    color: activeFilter === 'lost' ? '#fff' : '#0c151d'
                  }}
                >
                  Lost Items
                </Button>
                <Button
                  variant={activeFilter === 'found' ? 'primary' : 'outline-primary'}
                  onClick={() => setActiveFilter('found')}
                  style={{
                    fontFamily: "Concert One, sans-serif",
                    fontSize: "1.2rem",
                    backgroundColor: activeFilter === 'found' ? '#0c151d' : 'transparent',
                    borderColor: '#0c151d',
                    color: activeFilter === 'found' ? '#fff' : '#0c151d'
                  }}
                >
                  Found Items
                </Button>
              </ButtonGroup>
            </Col>
          </Row>
        </Container>

        {error && (
          <div
            style={{
              color: "red",
              textAlign: "center",
              fontSize: "2rem",
              fontFamily: "DynaPuff",
              fontWeight: "400",
              textShadow: "1px 1px 2px black",
            }}
          >
            {error}
          </div>
        )}

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
            {(activeFilter === 'all' || activeFilter === 'lost') && lostItems.length > 0 && (
              <Container fluid>
                <h2
                  style={{
                    textAlign: "center",
                    fontFamily: "Concert One, sans-serif",
                    marginLeft: "5px",
                    textTransform: "uppercase",
                    fontSize: "35px",
                    fontWeight: "600",
                  }}
                >
                  Lost items:
                </h2>
                <div className="title-border"></div>
                <Row>{lostItems}</Row>
              </Container>
            )}

            {(activeFilter === 'all' || activeFilter === 'found') && foundItems.length > 0 && (
              <Container fluid>
                <h2
                  style={{
                    textAlign: "center",
                    fontFamily: "Concert One, sans-serif",
                    marginLeft: "5px",
                    textTransform: "uppercase",
                    fontSize: "35px",
                    fontWeight: "600",
                  }}
                >
                  Found items:
                </h2>
                <div className="title-border"></div>
                <Row>{foundItems}</Row>
              </Container>
            )}

            {filteredItems.length === 0 && !loading && !error && (
              <div 
                style={{
                  textAlign: "center",
                  fontFamily: "Concert One, sans-serif",
                  fontSize: "24px",
                  marginTop: "40px",
                  color: "#666",
                  textShadow: "1px 1px 2px rgba(0,0,0,0.1)"
                }}
              >
                No items found for the selected filter.
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default SearchPage;