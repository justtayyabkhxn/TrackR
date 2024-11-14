import React, { useEffect, useState, useRef, useCallback } from "react";
import { setConstraint } from "../constraints";
import Navbar from "../Components/Navbar";
import "../css/feed.css";
import "../css/item_card.css";
import Axios from "axios";
import { Card, Col, Container, Row, Spinner } from "react-bootstrap";
import { Link } from "react-router-dom";
import SearchBar from "./SearchBar";

export default function Feed() {
  const [user_info, setUserInfo] = useState(() => {
    return JSON.parse(localStorage.getItem("user")) || {};
  });

  const [items, setItems] = useState([]);
  const [foundItems, setFoundItems] = useState([]);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0); // Track page for batch loading
  const [hasMore, setHasMore] = useState(true); // Track if there are more items to load
  const [loading, setLoading] = useState(true); // Track loading state
  const observer = useRef(); // Ref for the intersection observer

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

  // Fetch items in batches based on the page
  const fetchItems = useCallback(async () => {
    setLoading(true); // Set loading to true when fetching data
    try {
      const response = await Axios.get(
        `http://localhost:5000/getitem?page=${page}`
      );
      if (!response.data || !response.data.postitems) {
        throw new Error("Invalid response structure");
      }

      const data = response.data.postitems.reverse();

      const newItems = [];
      const newFoundItems = [];

      data.forEach((item) => {
        if (item.status === true) {
          const created_date = new Date(item.createdAt);
          const createdAt = `${created_date.getDate()}/${
            created_date.getMonth() + 1
          }/${created_date.getFullYear()} ${created_date.getHours()}:${created_date.getMinutes()}`;
          const imageSrc =
            item.itemPictures && item.itemPictures.length > 0
              ? `http://localhost:5000/${item.itemPictures[0].img}`
              : "/default-img.png";

          const card = (
            <Col key={item._id} md={3} xs={12} style={{ marginTop: "5%" }}>
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

          if (item.type === "Lost") {
            newItems.push(card);
          } else if (item.type === "Found") {
            newFoundItems.push(card);
          }
        }
      });

      setItems((prevItems) => [...prevItems, ...newItems]);
      setFoundItems((prevFoundItems) => [...prevFoundItems, ...newFoundItems]);
      setHasMore(response.data.hasMore); // Update if there are more items to load
    } catch (error) {
      console.error("Error fetching items:", error);
      setError("Failed to load items. Please try again later.");
    } finally {
      setLoading(false); // Set loading to false once data is fetched
    }
  }, [page]);

  // Load more items when the observer element comes into view
  const lastItemRef = useCallback(
    (node) => {
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prevPage) => prevPage + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [hasMore]
  );

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  return (
    <div style={{ marginTop: "120px" }}>
      <Navbar />
      <center>
        <span
          className="welcomeText"
          style={{
            fontFamily: "Concert One, sans-serif",
            textTransform: "uppercase",
            margin: "25px",
            fontSize: "3rem",
            borderBottom: "5px solid #ff8b4d",
          }}
        >
          Welcome {user_info.firstname} {user_info.lastname}!
        </span>
      </center>

      {error && (
        <div style={{ color: "red", textAlign: "center" }}>{error}</div>
      )}
      <center>
        <SearchBar />
      </center>
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
          >
            {/* Loading spinner */}
          </Spinner>
        </div>
      ) : (
        <>
          <Container fluid>
            <h2
              style={{
                textAlign: "center",
                fontFamily: "Concert One, sans-serif",
                fontSize: "35px",
                fontWeight: "600",
                textDecoration:"uppercase"
              }}
            >
              LOST ITEMS:
            </h2>
            <div className="title-border"></div>
            <Row>{items}</Row>
          </Container>

          {foundItems.length > 0 && (
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
        </>
      )}

      {/* Ref to track the last item */}
      <div ref={lastItemRef} style={{ height: "20px", marginBottom: "20px" }} />
    </div>
  );
}
