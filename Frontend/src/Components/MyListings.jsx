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
      <p className="text">
        {isReadMore ? text.slice(0, 15) : text}
        <span onClick={toggleReadMore} className="read-or-hide">
          {isReadMore ? "...." : " show less"}
        </span>
      </p>
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
          `${createdDate.getDate()}/${createdDate.getMonth() + 1}/${createdDate.getFullYear()} ` +
          `${createdDate.getHours()}:${createdDate.getMinutes()}`;

        return (
          <Col key={item._id} style={{ marginTop: "2%" }} md={3}>
            <a href={`/${item.name}?cid=${item._id}&type=${item.type}/true`}>
              <Card bsPrefix="item-card" style={{ maxHeight: "465px" }}>
                <Card.Img
                  variant="top"
                  src={`http://localhost:5000/${item.itemPictures[0].img}`}
                />
                <Card.Body bsPrefix="card-body">
                  <Badge pill variant={item.status ? "success" : "secondary"}>
                    {item.status ? "Active" : "Inactive"}
                  </Badge>
                  <Card.Title>Item : {item.name}</Card.Title>
                  {item.description && (
                    <Card.Text>
                      Description : <ReadMore>{item.description}</ReadMore>
                    </Card.Text>
                  )}
                  <Card.Text>Type : {item.type}</Card.Text>
                  <Card.Text>Created at : {createdAt}</Card.Text>
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
