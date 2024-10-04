import React, { useState, useEffect } from "react";
import "../css/itempage.css";
import Axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { Spinner } from "react-bootstrap";
import { Flip, ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import {
  Button,
  Modal,
  Form,
  Container,
  Card,
  ListGroup,
  ListGroupItem,
} from "react-bootstrap";
import Navbar from "./Navbar";
import { LOGGED_IN, setConstraint } from "../constraints";

function ItemPage(props) {
  const navigate = useNavigate();

  const [ItemData, setItemData] = useState([]);
  // console.log("Item Data", ItemData);
  const [Itemname, setItemname] = useState("");
  const [ActivationRequest, setActivationRequest] = useState(false);
  const [Createdby, setCreatedby] = useState("");
  const [show, setShow] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [alreadyAnswered, setAlreadyAnswered] = useState(false);
  const [showQuestion, setshowQuestion] = useState(false);
  const [answer, setAnswer] = useState("");
  const [itemid, setItemid] = useState("");
  const [Question, setQuestion] = useState(false);
  const [isOwner, setIsOwner] = useState();

  const [itemname, setItemnameState] = useState("");
  const [description, setDescription] = useState("");
  const [itemquestion, setItemQuestion] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [itemAnswers, setItemAnswers] = useState([]);
  const [itemImage, setItemImage] = useState([]);
  const [newitemimage, setNewItemImage] = useState([]);
  const [type, setType] = useState("");
  const [authenticationPage, setauthenication] = useState("");
  const [validateUser, setvalidateUser] = useState(false);
  const [messageId, setMessageId] = useState("");
  const [response, setResponse] = useState("");

  // Modal Controls
  const handleCloseDelete = () => setShowDelete(false);
  const handleShowQuestion = () => setshowQuestion(true);

  const handleCloseActivation = () => setActivationRequest(false);
  const handleActivateConfirm = () => {
    setActivationRequest(true); // Open confirmation modal
  };
  const handleDeactivateConfirm = () => {
    setShowConfirmation(true); // Open confirmation modal
  };

  const handleCloseQuestion = () => setshowQuestion(false);
  const handleShowDelete = () => setShowDelete(true);
  const handleCloseprompt = () => setvalidateUser(false);

  const handleShowprompt = (id, answer) => {
    console.log("Selected message ID is :", id);
    console.log("Answer is :", answer);
    setMessageId(id);
    setResponse(answer);
    setvalidateUser(true);
  };


  // const handleShowQuestion = () => setQuestion(true);
  // const handleShowQuestion = () => setShowQuestion(true);

  // Constants and Data Extraction from URL
  setConstraint(true);
  const location = useLocation(); // Use the useLocation hook to get the current location object
  const queryParams = new URLSearchParams(location.search); // Create a URLSearchParams object from the query string

  const item_id = queryParams.get("cid"); // Extract the item ID from the 'cid' parameter
  // const item_type = queryParams.get("type").split("/")[0]; // Extract the item type from the 'type' parameter and split it
  const item_owner = ItemData.createdBy;
  // console.log("Item Data: ",ItemData)

  // const current_user = queryParams.get("type").split("/")[1]; // Extract the current user info from the 'type' parameter

  const [user_info, setUserInfo] = useState(() => {
    return JSON.parse(localStorage.getItem("user")) || {};
  });
  const user_id = user_info._id;
  // console.log("User: ", user_id);
  // console.log("Post owner: ", item_owner);
  const temp = [];
  const validation = [];
  // Fetching item data on component mount
  useEffect(() => {
    Axios.get(`http://localhost:5000/item/${item_id}`)
      .then((response) => {
        const data = response.data.Item;
        const answersData = response.data.Answers;
        setItemAnswers(answersData);
        // console.log("Data is: ", data);

        setItemData(data);
        // const current_user = ;
        setIsOwner(user_id == item_owner ? true : false);
        // console.log("img id: ", ItemData);
        Axios.get(
          `http://localhost:5000/responseData/${user_id}/${item_id}`
        ).then((response) => {
          const hasAnswered = response.data.answered;
          setAlreadyAnswered(hasAnswered);
        });
        setItemid(data._id);
        setItemnameState(data.name);
        setDescription(data.description);
        setItemQuestion(data.question);
        setType(data.type);
        setCreatedby(data.createdBy);
        setItemImage(data.itemPictures);

        temp.push(
          <div
            className="itemDescription"
            style={{
              cursor: "pointer",
              boxShadow: "1px 1px 5px black",
              padding: "10px",
              marginLeft: "30px",
              marginBottom: "0.30px",
              backgroundColor: "#0c151d",
              borderBottom: "5px solid #ff8b4d",
              maxHeight: "650px",
              maxWidth: "650px",
            }}
          >
            <h3
              className="attributes"
              style={{
                fontFamily: "Concert One, sans-serif",
                fontWeight: "1.5rem",
                fontSize: "1.55rem",
                textTransform: "uppercase",
                textDecoration: "underline",
                textShadow: "1px 1px 2px black",
              }}
            >
              Item name : <span className="details">{data.name}</span>
            </h3>
            <hr />
            <h3
              className="attributes"
              style={{
                fontFamily: "DynaPuff, system-ui",
                fontWeight: "400",
                textShadow: "1px 1px 2px black",
                color: "rgb(149, 149, 149)",
                letterSpacing: "0.75px",
                marginBottom: "0.5px",
                textTransform: "capitalize",
              }}
            >
              Item description :{" "}
              <span className="details">{data.description}</span>
            </h3>
            <hr />
            <h3
              className="attributes"
              style={{
                fontFamily: "DynaPuff, system-ui",
                fontWeight: "400",
                fontSize: "1.25rem",
                textShadow: "1px 1px 2px black",
                color: "rgb(149, 149, 149)",
                letterSpacing: "0.85px",
                marginBottom: "0.10px",
                textTransform: "capitalize",
              }}
            >
              Item type : <span className="details">{data.type}</span>
            </h3>
            <hr />
            <h3
              className="attributes"
              style={{
                fontFamily: "DynaPuff, system-ui",
                fontWeight: "400",
                fontSize: "1.25rem",
                textShadow: "1px 1px 2px black",
                color: "rgb(149, 149, 149)",
                letterSpacing: "0.85px",
                marginBottom: ".10px",
                textTransform: "capitalize",
              }}
            >
              Status :{" "}
              <span className="details">
                {data.status ? "Active" : "Inactive"}
              </span>
            </h3>
            <hr />
            <h6
              className="attributes"
              style={{
                fontFamily: "DynaPuff, system-ui",
                fontWeight: "200",
                fontSize: "1.25rem",
                textShadow: "1px 1px 2px black",
                color: "rgb(149, 149, 149)",
                letterSpacing: "0.85px",
                marginBottom: "10px",
                textTransform: "capitalize",
              }}
            >
              Created at:{" "}
              <span className="details">
                {new Date(data.createdAt).toLocaleString()}
              </span>
            </h6>
            {isOwner && (
              <div className="ed-button">
                <Button
                  variant="danger"
                  onClick={handleShowDelete}
                  style={{
                    fontFamily: "DynaPuff",
                    fontWeight: "400",
                    fontSize: "1.05rem",
                    textShadow: "0.5px 0.5px 2px black",
                  }}
                >
                  Delete Item
                </Button>
                <Button
                  variant="primary"
                  onClick={() => setShow(true)}
                  style={{
                    fontFamily: "DynaPuff",
                    fontWeight: "400",
                    fontSize: "1.05rem",
                    textShadow: "0.5px 0.5px 2px black",
                  }}
                >
                  Edit Item
                </Button>
                {/* Activate/Deactivate Buttons */}

                {data.status ? (
                  <>
                    <Button
                      variant="primary"
                      onClick={() => submitDeactivate(item_id)}
                      style={{
                        backgroundColor: "#8ccc03",
                        border: "none",
                        marginLeft: "5px",
                        fontFamily: "DynaPuff",
                        fontWeight: "400",
                        fontSize: "1.05rem",
                        textShadow: "0.5px 0.5px 2px black",
                      }}
                    >
                      Deactivate Item
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      variant="primary"
                      onClick={() => submitActivate(item_id)}
                      style={{
                        marginTop: "0px",
                        backgroundColor: "green",
                        border: "none",
                        fontFamily: "DynaPuff",
                        fontWeight: "400",
                        fontSize: "1.05rem",
                        textShadow: "0.5px 0.5px 2px black",
                      }}
                    >
                      Reactivate Item
                    </Button>
                  </>
                )}
              </div>
            )}

            <div>
              {alreadyAnswered ? (
                <div className="ed-button">
                  <Button
                    variant="secondary"
                    disabled
                    onClick={handleShowQuestion}
                    style={{
                      backgroundColor: "#ff8b4d",
                      color: "#0c151d",
                    }}
                  >
                    {data.type === "Lost" ? "Found Item" : "Claim Item"}
                  </Button>
                </div>
              ) : (
                <div className="ed-button">
                  {!isOwner ? (
                    <Button
                      variant="primary"
                      onClick={handleShowQuestion}
                      style={{
                        fontFamily: "DynaPuff",
                        fontWeight: "400",
                        fontSize: "1.05rem",
                        backgroundColor: "#ff8b4d",
                        border: "none",
                        color: "#0c151d",
                        textShadow: "0.5px 0.5px 0.2px black",
                        boxShadow: "2px 2px 2px black",
                      }}
                    >
                      {data.type === "Lost" ? "Found Item" : "Claim Item"}
                    </Button>
                  ) : (
                    <></>
                  )}
                </div>
              )}
            </div>
          </div>
        );
        setItemname(temp);
      })
      .catch((err) => console.log(err));
    validation.push(
      <div key="validation-wrapper">
        {" "}
        {/* Wrap with a unique key for the outer div */}
        {isOwner ? (
          <div
            key="owner-section"
            style={{
              boxShadow: "1px 1px 5px black",
              padding: "10px",
              marginLeft: "30px",
              marginBottom: "30px",
              borderBottom: "5px solid #ff8b4d",
              borderRadius: "10px",
              marginTop: "10px",
            }}
          >
            {" "}
            {/* Add key for the owner section */}
            <div
              style={{
                marginBottom: "10px",
              }}
            >
              <span
                className="attributes"
                style={{
                  fontFamily: "DynaPuff, system-ui",
                  fontWeight: "400",
                  textShadow: "1px 1px 2px black",
                  color: "#0c151d",
                  letterSpacing: "0.75px",
                  marginBottom: "15px",
                  textTransform: "capitalize",
                  fontSize: "1.5rem",
                  textDecoration: "underline",
                }}
              >
                Your Question :
              </span>
              <span
                style={{
                  fontFamily: "DynaPuff, system-ui",
                  fontWeight: "400",
                  textShadow: "1px 1px 2px black",
                  color: "#0c151d",
                  letterSpacing: "0.75px",
                  marginBottom: "15px",
                  textTransform: "capitalize",
                  fontSize: "1.5rem",
                  textDecoration: "underline",
                }}
              >
                {" "}
                {ItemData.question}
              </span>
            </div>
            <div>
              <h2
                className="attributes"
                style={{
                  fontFamily: "DynaPuff, system-ui",
                  fontWeight: "400",
                  textShadow: "1px 1px 2px black",
                  color: "#0c151d",
                  letterSpacing: "0.75px",
                  marginBottom: "15px",
                  textTransform: "capitalize",
                  fontSize: "1.5rem",
                  textDecoration: "underline",
                }}
              >
                Answers Submitted :
              </h2>
              {itemAnswers.length === 0 ? (
                <h3
                  style={{
                    fontFamily: "DynaPuff, system-ui",
                    fontWeight: "400",
                    textShadow: "1px 1px 2px black",
                    color: "#ff8b4d",
                    letterSpacing: "0.75px",
                    marginBottom: "0.5px",
                    marginLeft: "5px",
                    textTransform: "capitalize",
                  }}
                >
                  No Answers Yet.
                </h3>
              ) : (
                <div style={{ display: "flex", flexWrap: "wrap" }}>
                  {itemAnswers.map((answer) => (
                    <div className="responses" key={answer._id}>
                      {" "}
                      {/* Add key here */}
                      <Card
                        style={{
                          width: "18rem",
                          // border: "solid 0.22px #0c151d",
                          boxShadow: "0.1px 0.1px 5px black",
                          borderBottom: "5px solid #ff8b4d",
                        }}
                      >
                        <Card.Body>
                          <Card.Title
                            style={{
                              fontFamily: "DynaPuff, system-ui",
                              fontWeight: "400",
                              textShadow: "0.2px 0.2px 1px black",
                              color: "#ff8b4d",
                              letterSpacing: "0.75px",
                              marginBottom: "0.5px",
                              marginLeft: "5px",
                              textTransform: "capitalize",
                            }}
                          >
                            Answer: {answer.answer}
                          </Card.Title>
                        </Card.Body>
                        <ListGroup className="list-group-flush">
                          <ListGroupItem
                            style={{
                              fontFamily: "DynaPuff, system-ui",
                              fontWeight: "400",
                              textShadow: "0.1px 0.1px 1px black",
                              letterSpacing: "0.75px",
                              marginBottom: "0.5px",
                              marginLeft: "5px",
                              textTransform: "capitalize",
                            }}
                          >
                            Date:{" "}
                            {new Date(answer.createdAt).toLocaleDateString()}
                          </ListGroupItem>{" "}
                          {/* Format Date */}
                          <ListGroupItem
                            style={{
                              fontFamily: "DynaPuff, system-ui",
                              fontWeight: "400",
                              textShadow: "0.1px 0.1px 1px black",
                              letterSpacing: "0.75px",
                              marginBottom: "0.5px",
                              marginLeft: "5px",
                              textTransform: "capitalize",
                            }}
                          >
                            Validate:
                            {answer.response === "Moderation" ? (
                              <div
                                className="ed-button"
                                style={{ marginLeft: "-7px" }}
                              >
                                <Button
                                  variant="danger"
                                  onClick={() =>
                                    validate_answer(answer._id, "No")
                                  }
                                  style={{
                                    fontFamily: "DynaPuff, system-ui",
                                    fontWeight: "400",
                                    textShadow: "0.1px 0.1px 1px black",
                                    boxShadow: "0.5px 0.5px 2px black",
                                  }}
                                >
                                  No
                                </Button>
                                <Button
                                  variant="primary"
                                  onClick={() =>
                                    validate_answer(answer._id, "Yes")
                                  }
                                  style={{
                                    backgroundColor: "#52a302",
                                    border: "none",
                                    boxShadow: "0.5px 0.5px 2px black",
                                    fontFamily: "DynaPuff, system-ui",
                                    fontWeight: "400",
                                    textShadow: "0.1px 0.1px 1px black",
                                  }}
                                >
                                  Yes
                                </Button>
                              </div>
                            ) : (
                              <p>Already Submitted as <span
                              style={{
                                fontFamily: "DynaPuff, system-ui",
                                fontWeight: "400",
                                textShadow: "0.2px 0.2px 1px black",
                                color: "#ff8b4d",
                                textTransform: "uppercase",
                              }}>
                                 "{answer.response}" </span></p>
                            )}
                          </ListGroupItem>
                        </ListGroup>
                      </Card>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div key="non-owner-section"></div>
        )}
      </div>
    );
    setauthenication(validation);
  }, [alreadyAnswered, item_id, isOwner]);

  // Submit Functions
  const submitActivate = (item_id) => {
    Axios.post(`http://localhost:5000/activateItem/${item_id}`)
      .then(() => {
        toast.success("Item Activated!", {
          position: "bottom-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
          transition: Flip,
          style: {
            fontSize: "1.05rem",
            textTransform: "uppercase",
            textShadow: "0.5px 0.5px 2px black",
            color: "#ff8b4d",
            backgroundColor: "#0c151d",
          },
        });
        setTimeout(() => window.location.reload(), 2000);
      })
      .catch((err) => console.log(err));
    setActivationRequest(false);
  };

  //Deactivate Item
  const submitDeactivate = (item_id) => {
    Axios.post(`http://localhost:5000/deactivateItem/${item_id}`)
      .then(() => {
        toast.success("Item Deactivated!", {
          position: "bottom-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
          transition: Flip,
          style: {
            fontSize: "1.05rem",
            textTransform: "uppercase",
            textShadow: "0.5px 0.5px 2px black",
            color: "#ff8b4d",
            backgroundColor: "#0c151d",
          },
        });
        setTimeout(() => window.location.reload(), 2000);
      })
      .catch((err) => console.log(err));
    setShowConfirmation(false);
  };
  //DELETE ITEM
  const delete_item = () => {
    Axios.post("http://localhost:5000/deleteitem", { item_id })
      .then(() => {
        handleCloseDelete();
        toast.success("Item deleted successfully!", {
          position: "bottom-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
          transition: Flip,
          style: {
            fontSize: "1.05rem",
            textTransform: "uppercase",
            textShadow: "0.5px 0.5px 2px black",
            color: "#ff8b4d",
            backgroundColor: "#0c151d",
          },
        });
        setTimeout(() => navigate("/feed"), 1500);
      })
      .catch((err) => console.log(err));
  };
  //HANDLE EDIT
  const handleEdit = () => {
    const formData = new FormData();
    formData.append("name", itemname);
    formData.append("description", description);
    formData.append("question", itemquestion);
    formData.append("type", type);
    formData.append("id", item_id);
    formData.append("createdBy", Createdby);

    if (newitemimage && newitemimage.length > 0) {
      // If new images are provided, append them
      newitemimage.forEach((img) => {
        formData.append("itemPictures", img, img.name);
      });
    } else if (itemImage && itemImage.length > 0) {
      // If no new images, append old images
      itemImage.forEach((img) => {
        formData.append("olditemPictures", img.img);
      });
    }

    Axios.post("http://localhost:5000/edititem", formData)
      .then(() => {
        toast.success("Item edited successfully!", {
          position: "bottom-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
          transition: Flip,
          style: {
            fontSize: "1.05rem",
            textTransform: "uppercase",
            textShadow: "0.5px 0.5px 2px black",
            color: "#ff8b4d",
            backgroundColor: "#0c151d",
          },
        });
        setTimeout(() => window.location.reload(), 2000);
      })
      .catch((err) => console.log(err));
    setShow(false);
  };

  const show_question = () => {
    setshowQuestion(true);
  };
  //SUBMIT  ANSWER
  const submitAnswer = () => {
    Axios.post("http://localhost:5000/submitAnswer", {
      itemId: item_id,
      question: itemquestion,
      answer: answer,
      givenBy: JSON.parse(localStorage.getItem("user")),
      belongsTo: Createdby,
    })
      .then(() => {
        handleCloseQuestion();
        toast.success("Response saved ✔️", {
          position: "bottom-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
          transition: Flip,
          style: {
            fontSize: "1.05rem",
            textTransform: "uppercase",
            textShadow: "0.5px 0.5px 2px black",
            color: "#ff8b4d",
            backgroundColor: "#0c151d",
          },
        });
        setTimeout(() => window.location.reload(), 2000);
      })
      .catch((err) => console.log(err));
    setAnswer("");
  };
  //VALIDATE ANSWER
  const validate_answer = (id, answer) => {
    Axios.post(`http://localhost:5000/confirmResponse/${id}`, { response: answer }) // Fix URL and key
      .then(() => {
        handleShowprompt();
        toast.success("Validation saved successfully!", {
          position: "bottom-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
          transition: Flip,
          style: {
            fontSize: "1.05rem",
            textTransform: "uppercase",
            textShadow: "0.5px 0.5px 2px black",
            color: "#ff8b4d",
            backgroundColor: "#0c151d",
          },
        });
        setTimeout(() => window.location.reload(), 2000);
      })
      .catch((err) => console.log(err));
  };
  


  return (
    <>
      <Navbar />
      <Container fluid>
        <div className="parent">
          <div style={{ marginTop: "20px" }}>
            {ItemData.itemPictures &&
            Array.isArray(ItemData.itemPictures) &&
            ItemData.itemPictures.length > 0 ? (
              <img
                style={{
                  padding: "15px 15px 0px 15px",
                  borderRadius: "10px",
                  marginBottom: "0.10px",
                  borderBottom: "8px solid #ff8b4d",
                }}
                src={`http://localhost:5000/${ItemData.itemPictures[0].img}`}
                alt="item"
              />
            ) : (
              <div>
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                  style={{ color: "#0c151d" }}
                />
                <span
                  className="sr-only"
                  style={{ fontSize: "1.2rem", color: "#0c151d" }}
                >
                  {" "}
                  No Image...
                </span>
              </div>
            )}
          </div>
          <div className="itempage">
            <div>{Itemname}</div>
          </div>
        </div>
        <div>{authenticationPage}</div>
        {/* Modals */}
        <Modal show={ActivationRequest} onHide={handleCloseActivation}>
          <Modal.Body>Are you sure?</Modal.Body>
          <Modal.Footer>
            <Button variant="primary" onClick={handleCloseActivation}>
              No
            </Button>
            <Button variant="danger" onClick={() => submitActivate(item_id)}>
              Yes
            </Button>
          </Modal.Footer>
        </Modal>

        <Modal show={showDelete} onHide={handleCloseDelete}>
          <Modal.Body
            style={{
              fontFamily: "DynaPuff",
              fontWeight: "400",
              fontSize: "1.35rem",
              backgroundColor: "#0c151d",
              border: "none",
              color: "#ff8b4d",
              textShadow: "0.5px 0.5px 0.2px black",
            }}
          >
            Are you sure?
          </Modal.Body>
          <Modal.Footer
            style={{
              fontFamily: "DynaPuff",
              fontWeight: "400",
              fontSize: "1.05rem",
              backgroundColor: "#0c151d",
              border: "none",
              color: "#ff8b4d",
              textShadow: "0.5px 0.5px 0.2px black",
              marginTop: "0px",
            }}
          >
            <Button
              variant="primary"
              onClick={handleCloseDelete}
              style={{
                backgroundColor: "#a80303",
                border: "none",
                textShadow: "0.5px 0.5px 2px black",
                boxShadow: "0.5px 0.5px 2px black",
              }}
            >
              No
            </Button>
            <Button
              variant="danger"
              onClick={delete_item}
              style={{
                backgroundColor: "#52a302",
                border: "none",
                textShadow: "0.5px 0.5px 2px black",
                boxShadow: "0.5px 0.5px 2px black",
              }}
            >
              Yes
            </Button>
          </Modal.Footer>
        </Modal>

        <Modal show={show} onHide={() => setShow(false)}>
          <Modal.Header
            closeButton
            closeVariant="white"
            style={{
              fontFamily: "DynaPuff",
              fontWeight: "400",
              fontSize: "1.35rem",
              backgroundColor: "#0c151d",
              border: "none",
              color: "#ff8b4d",
              textShadow: "0.5px 0.5px 0.2px black",
            }}
          >
            <Modal.Title style={{ fontFamily: "DynaPuff", fontWeight: "400" }}>
              Edit Item
            </Modal.Title>
          </Modal.Header>
          <Modal.Body
            style={{
              fontSize: "1.05rem",
              backgroundColor: "#0c151d",
              border: "none",
              color: "#ff8b4d",
              textShadow: "0.5px 0.5px 0.2px black",
              marginTop: "0px",
            }}
          >
            <Form>
              <Form.Group>
                <Form.Label
                  style={{
                    fontFamily: "DynaPuff",
                    fontWeight: "400",
                    marginBottom: "1px",
                    marginTop: "8px",
                  }}
                >
                  Item name
                </Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter item"
                  value={itemname}
                  onChange={(e) => setItemnameState(e.target.value)}
                />
              </Form.Group>
              <Form.Group>
                <Form.Label
                  style={{
                    fontFamily: "DynaPuff",
                    fontWeight: "400",
                    marginBottom: "1px",
                    marginTop: "8px",
                  }}
                >
                  Description
                </Form.Label>
                <Form.Control
                  as="textarea"
                  placeholder="Enter description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </Form.Group>
              <Form.Group>
                <Form.Label
                  style={{
                    fontFamily: "DynaPuff",
                    fontWeight: "400",
                    marginBottom: "1px",
                    marginTop: "8px",
                  }}
                >
                  Question
                </Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter question"
                  value={itemquestion}
                  onChange={(e) => setItemQuestion(e.target.value)}
                />
              </Form.Group>
              <Button
                variant="primary"
                onClick={handleEdit}
                style={{
                  backgroundColor: "#52a302",
                  border: "none",
                  marginTop: "15px",
                  textShadow: "0.5px 0.5px 2px black",
                  boxShadow: "0.5px 0.5px 2px black",
                }}
              >
                Submit
              </Button>
            </Form>
          </Modal.Body>
        </Modal>

        <Modal
          show={showQuestion}
          onHide={handleCloseQuestion}
          backdrop="static"
        >
          {showQuestion ? (
            <div>
              {/* Question and answer form */}
              <Modal.Body
                style={{
                  backgroundColor: "#0c151d",
                  color: "#ff8b4d",
                  border: "none",
                  fontSize: "1.52rem",
                  textShadow: "0.2px 0.25px 2px black",
                  marginRight: "0px",
                  marginBottom: "0px",
                  textTransform: "capitalize",
                }}
              >
                <Form.Group>
                  <Form.Label>QUESTION: {itemquestion} ?</Form.Label>{" "}
                  {/* Display the question */}
                  <Form.Control
                    as="textarea"
                    placeholder="Enter Answer"
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    style={{
                      backgroundColor: "#dbd9d9",
                      border: "none",
                      color: "#0c151d",
                    }}
                  />
                </Form.Group>
              </Modal.Body>
              <Modal.Footer
                style={{
                  backgroundColor: "#0c151d",
                  color: "#ff8b4d",
                  border: "none",
                  fontSize: "1.52rem",
                  boxShadow: "2px 2px 2px black",
                  textShadow: "0.2px 0.25px 2px black",
                  marginRight: "0px",
                  marginTop: "0px",
                  textTransform: "capitalize",
                }}
              >
                <Button
                  variant="primary"
                  onClick={handleCloseQuestion}
                  style={{
                    backgroundColor: "#52a302",
                    border: "none",
                    textShadow: "0.5px 0.5px 2px black",
                    boxShadow: "0.5px 0.5px 2px black",
                  }}
                >
                  Close
                </Button>
                <Button
                  variant="primary"
                  onClick={submitAnswer}
                  style={{
                    backgroundColor: "#a80303",
                    border: "none",
                    textShadow: "0.5px 0.5px 2px black",
                    boxShadow: "0.5px 0.5px 2px black",
                  }}
                >
                  {" "}
                  {/* Submit the answer */}
                  Submit
                </Button>
              </Modal.Footer>
            </div>
          ) : (
            <div>
              {/* Initial confirmation */}
              <Modal
                show={showConfirmation}
                onHide={() => setShowConfirmation(false)}
                backdrop="static"
              >
                <Modal.Body>
                  <p>Are you sure you found the item?</p>
                </Modal.Body>
                <Modal.Footer>
                  <Button
                    variant="primary"
                    onClick={() => setShowConfirmation(false)}
                  >
                    No
                  </Button>
                  <Button
                    variant="danger"
                    onClick={() => {
                      setShowConfirmation(false);
                      show_question();
                    }}
                  >
                    Yes
                  </Button>
                </Modal.Footer>
              </Modal>
            </div>
          )}
        </Modal>
      </Container>
      <ToastContainer
        position="bottom-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        transition:Flip
      />
    </>
  );
}

export default ItemPage;