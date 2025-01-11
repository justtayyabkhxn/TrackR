import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Axios from "axios";
import Navbar from "./Navbar";
import { Card, Col, Container, Row, Spinner } from "react-bootstrap";
import { Link } from "react-router-dom";

const serverUrl = import.meta.env.VITE_SERVER_URL;


export default function UserPosts() {
  const { userId } = useParams();
  const [items, setItems] = useState([]);
  const [info, setInfo] = useState("");
  const [userInfo, setUserInfo] = useState("");
  const [loading, setLoading] = useState(true); // New loading state

  const ReadMore = ({ children }) => {
    const text = children;
    const [isReadMore, setIsReadMore] = useState(true);

    const toggleReadMore = () => setIsReadMore(!isReadMore);

    return (
      <span
        style={{
          color: "rgb(149, 149, 149)",
          letterSpacing: "0.1px",
          fontFamily: "DynaPuff",
          fontWeight: "400",
          textTransform: "capitalize",
        }}
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
      const response = await Axios.get(`${serverUrl}/user/${userId}`);
      const data = response.data.items;
      console.log(response.data.user);
      setUserInfo(response.data.user);

      if (data && data.length > 0) {
        const itemList = data.reverse().map((item) => {
          const createdDate = new Date(item.createdAt);
          const createdAt = `${createdDate.getDate()}/${
            createdDate.getMonth() + 1
          }/${createdDate.getFullYear()} ${createdDate.getHours()}:${createdDate.getMinutes()}`;

          const imageSrc =
            item.itemPictures && item.itemPictures.length > 0
              ? `${serverUrl}/${item.itemPictures[0].img}`
              : "/default-img.png";

          return (
            <Col key={item._id} style={{ marginTop: "2%" }} md={3}>
              <Link to={`/item/${item.name}?cid=${item._id}&type=${item.type}`}>
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
                    height: "500px",
                    width: "350px",
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
                    src={imageSrc}
                  />
                  <Card.Body bsPrefix="card-body">
                    <span
                      style={{
                        marginTop: "15px",
                        marginBottom: "15px",
                        letterSpacing: "1px",
                        fontSize: "0.95rem",
                        backgroundColor: "#ff8b4d",
                        textShadow: "0px 0px 0.5px black",
                        fontFamily: "DynaPuff",
                        fontWeight: "400",
                        borderRadius: "15px",
                        color: "#0c151d",
                        boxShadow: "2px 2px 2px black",
                      }}
                      className="badge"
                    >
                      {item.status ? "Active" : "Inactive"}
                    </span>
                    <Card.Title
                      style={{
                        fontFamily: "Concert One, sans-serif",
                        fontWeight: "1.5rem",
                        fontSize: "1.15rem",
                        textTransform: "uppercase",
                        textDecoration: "underline",
                        textShadow: "1px 1px 2px black",
                        marginBottom: "15px",
                      }}
                    >
                      Item : {item.name}
                    </Card.Title>
                    {item.description && (
                      <Card.Text
                        style={{
                          fontFamily: "DynaPuff",
                          fontWeight: "400",
                          textShadow: "1px 1px 2px black",
                          color: "rgb(149, 149, 149)",
                          letterSpacing: "0.75px",
                          marginBottom: "15px",
                          fontSize: "0.95rem",
                        }}
                      >
                        Description: <ReadMore>{item.description}</ReadMore>
                      </Card.Text>
                    )}
                    <Card.Text
                      style={{
                        fontFamily: "DynaPuff",
                        fontWeight: "400",
                        textShadow: "1px 1px 2px black",
                        color: "rgb(149, 149, 149)",
                        letterSpacing: "0.75px",
                        marginBottom: "15px",
                        fontSize: "0.95rem",
                      }}
                    >
                      Type : {item.type}
                    </Card.Text>
                    <Card.Text
                      style={{
                        fontFamily: "DynaPuff",
                        fontWeight: "400",
                        textShadow: "1px 1px 2px black",
                        color: "rgb(149, 149, 149)",
                        letterSpacing: "0.75px",
                        marginBottom: "15px",
                        fontSize: "0.95rem",
                      }}
                    >
                      Created at : {createdAt}
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Link>
            </Col>
          );
        });

        setItems(itemList);
      } else {
        setInfo("No posts found for this user.");
      }
    } catch (err) {
      console.error("Error fetching items:", err);
      setInfo("An error occurred while fetching items.");
    } finally {
      setLoading(false); // Set loading to false after fetch completes
    }
  };

  useEffect(() => {
    fetchItems();
  }, [userId]);

  return (
    <div style={{ marginTop: "120px" }}>
      <Navbar />
      <div className="listing-title">
        <h2
          style={{
            textTransform: "uppercase",
            textAlign: "center",
            fontFamily: "Concert One, sans-serif",
            fontWeight: "600",
          }}
        >
          {userInfo
            ? `${userInfo.firstname} ${userInfo.lastname}'s Posts`
            : `User Posts`}
        </h2>
        <div className="title-border"></div>
        <div
          style={{
            color: "red",
            fontFamily: "DynaPuff",
            fontWeight: "400",
            marginTop: "20px",
            fontSize: "1.25rem",
            textShadow: "0.5px 0.5px 2px black",
          }}
        ></div>
      </div>
      <Container fluid>
        <Row>
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
                style={{ fontSize: "8rem", color:"black" }}
                animation="border"
                role="status"
                variant="dark"
              >
                {/* <span className="sr-only" style={{ fontSize: "1rem" }}>
                  Loading...
                </span> */}
              </Spinner>
            </div>
          ) : items.length > 0 ? (
            items
          ) : (
            <p
              style={{ textAlign: "center", color: "red", fontSize: "1.5rem" }}
            >
              No posts found.
            </p>
          )}
        </Row>
      </Container>
    </div>
  );
}
