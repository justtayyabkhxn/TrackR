import React, { useEffect, useState } from "react";
import { setConstraint } from "../constraints";
import Navbar from "../Components/Navbar";
import "../css/feed.css";
import "../css/item_card.css";
import Axios from "axios";
import { Card, Col, Container, Row } from "react-bootstrap";

export default function Feed() {
  // Fetch user information from localStorage
  const [user_info, setUserInfo] = useState(() => {
    return JSON.parse(localStorage.getItem("user")) || {};
  });

  const [items, setItems] = useState([]);
  const [foundItems, setFoundItems] = useState([]);

  const ReadMore = ({ children }) => {
    const text = children;
    const [isReadMore, setIsReadMore] = useState(true);
    const toggleReadMore = () => setIsReadMore(!isReadMore);

    return (
      <p style={{ fontSize: "1rem" }} className="text">
        {isReadMore ? text.slice(0, 15) : text}
        <span onClick={toggleReadMore} className="read-or-hide">
          {isReadMore ? "...." : " show less"}
        </span>
      </p>
    );
  };

  // Fetch lost and found items
  useEffect(() => {
    setConstraint(true);

    const fetchItems = async () => {
      try {
        const response = await Axios.get("http://localhost:5000/getitem");
        const data = response.data.postitems.reverse();

        const lostItems = [];
        const foundItemsList = [];

        data.forEach((item) => {
          const created_date = new Date(item.createdAt);
          const createdAt = `${created_date.getDate()}/${created_date.getMonth()}/${created_date.getFullYear()} ${created_date.getHours()}:${created_date.getMinutes()}`;

          const userIsOwner = item.createdBy === user_info._id;

          const card = (
            <a
              key={item._id}
              href={`/${item.name}?cid=${item._id}&type=${item.type}/${userIsOwner}`}
            >
              <Col style={{ marginTop: "2%" }} md={3}>
                <Card bsPrefix="item-card">
                  <Card.Img
                    variant="top"
                    src={`http://localhost:5000/${item.itemPictures[0].img}`}
                  />
                  <Card.Body bsPrefix="card-body">
                    <Card.Title
                      style={{
                        fontFamily: "'Noto Sans JP', sans-serif",
                        fontWeight: "1.35rem",
                      }}
                    >
                      Item: {item.name}
                    </Card.Title>
                    {item.description && (
                      <Card.Text
                        style={{
                          fontFamily: "'Noto Sans JP', sans-serif",
                          fontSize: "1rem",
                        }}
                      >
                        Description: <ReadMore>{item.description}</ReadMore>
                      </Card.Text>
                    )}
                    <Card.Text
                      style={{
                        fontFamily: "'Noto Sans JP', sans-serif",
                        fontSize: "1rem",
                      }}
                    >
                      Created at: {createdAt}
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            </a>
          );

          // Categorize items into Lost and Found
          if (item.type === "Lost" && item.status === true) {
            lostItems.push(card);
          } else {
            foundItemsList.push(card);
          }
        });

        setItems(lostItems);
        setFoundItems(foundItemsList);
      } catch (error) {
        console.error("Error fetching items:", error);
      }
    };

    fetchItems();
  }, [user_info._id]);

  return (
    <div>
      <Navbar />
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
        Welcome {user_info.firstname} {user_info.lastname}!
      </span>

      <Container fluid>
        <h2
          style={{
            textAlign: "center",
            fontFamily: "Concert One, sans-serif",
            marginLeft: "5px",
            textTransform: "uppercase",
            fontSize:"35px",
            fontWeight:"600"
          }}
        >
          Lost items :
        </h2>
        <div className="title-border"></div>
        <Row>{items}</Row>
      </Container>

      {foundItems.length > 0 && (
        <Container fluid>
          <h2 style={{ textAlign: "center" }}>Found items:</h2>
          <div className="title-border"></div>
          <Row>{foundItems}</Row>
        </Container>
      )}
    </div>
  );
}
