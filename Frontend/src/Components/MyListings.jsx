import React, { useEffect, useState } from "react";
import Navbar from "../Components/Navbar";
import "../css/item_card.css";
import "../css/mylisting.css";
import Axios from "axios";
import { Card, Col, Container, Row, Badge } from "react-bootstrap";

const Feed = () => {
  const [items, setItems] = useState([]);

  const ReadMore = ({ children }) => {
    const text = children;
    const [isReadMore, setIsReadMore] = useState(true);

    const toggleReadMore = () => {
      setIsReadMore(!isReadMore);
    };

    return (
      <span
        className="text"
        style={{ color: "rgb(149, 149, 149)", letterSpacing: "0.1px" }}
      >
        {isReadMore ? text.slice(0, 15) : text}
        <span onClick={toggleReadMore} className="read-or-hide">
          {isReadMore ? "...." : " show less"}
        </span>
      </span>
    );
  };

  const fetchItems = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const response = await Axios.get(
        `http://localhost:5000/mylistings/${user._id}`
      );

      const data = response.data.item;
      const itemList = data.reverse().map((item) => {
        const createdDate = new Date(item.createdAt);
        const createdAt =
          `${createdDate.getDate()}/${
            createdDate.getMonth() + 1
          }/${createdDate.getFullYear()} ` +
          `${createdDate.getHours()}:${createdDate.getMinutes()}`;

        return (
          <Col key={item._id} style={{ marginTop: "2%" }} md={3}>
            <a href={`/${item.name}?cid=${item._id}&type=${item.type}/true`}>
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
                  maxHeight: "650px",
                  maxWidth: "650px",
                }}
              >
                <Card.Img
                  variant="top"
                  style={{
                    padding: "5px",
                    borderRadius: "10px",
                    marginBottom: "10px",
                  }}
                  src={`http://localhost:5000/${item.itemPictures[0].img}`}
                />
                <Card.Body bsPrefix="card-body">
                  <Badge pill variant={item.status ? "success" : "secondary"}>
                    {item.status ? "Active" : "Inactive"}
                  </Badge>
                  <Card.Title
                    style={{
                      fontFamily: "Concert One, sans-serif",
                      fontWeight: "1.5rem",
                      fontSize: "1.15rem",
                      textTransform: "uppercase",
                      textDecoration: "underline",
                      textShadow: "1px 1px 2px black",
                    }}
                  >
                    Item : {item.name}
                  </Card.Title>
                  {item.description && (
                    <Card.Text
                      style={{
                        fontFamily: "Concert One, sans-serif",
                        fontSize: "1.15rem",
                        textShadow: "1px 1px 2px black",
                        color: "rgb(149, 149, 149)",
                        letterSpacing: "0.75px",
                        fontWeight: "500",
                        marginBottom: "5px",
                      }}
                    >
                      Description:{" "}
                      <ReadMore
                        style={{
                          fontFamily: "Concert One, sans-serif",
                          fontWeight: "500",
                          fontSize: "1.05rem",
                          textShadow: "1px 1px 2px black",
                          color: "rgb(149, 149, 149)",
                          letterSpacing: "0.85px",
                          marginBottom: "10px",
                        }}
                      >
                        {item.description}
                      </ReadMore>
                    </Card.Text>
                  )}
                  <Card.Text
                    style={{
                      fontFamily: "Concert One, sans-serif",
                      fontWeight: "500",
                      fontSize: "1.05rem",
                      textShadow: "1px 1px 2px black",
                      color: "rgb(149, 149, 149)",
                      letterSpacing: "0.85px",
                      marginBottom: "10px",
                    }}
                  >
                    Type : {item.type}
                  </Card.Text>
                  <Card.Text
                    style={{
                      fontFamily: "Concert One, sans-serif",
                      fontWeight: "500",
                      fontSize: "1.05rem",
                      textShadow: "1px 1px 2px black",
                      color: "rgb(149, 149, 149)",
                      letterSpacing: "0.85px",
                      marginBottom: "10px",
                    }}
                  >
                    Created at : {createdAt}
                  </Card.Text>
                </Card.Body>
              </Card>
            </a>
          </Col>
        );
      });

      setItems(itemList);
    } catch (err) {
      console.error("Error fetching items:", err);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  return (
    <div>
      <Navbar />
      <div className="listing-title">
        <h2>My Listings</h2>
        <div className="title-border"></div>
      </div>
      <Container fluid>
        <Row>{items}</Row>
      </Container>
    </div>
  );
};

export default Feed;
