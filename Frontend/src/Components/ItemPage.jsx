import React, { useState, useEffect } from "react";
import "../css/itempage.css";
import Axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { Spinner } from "react-bootstrap";
import { Flip, ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link } from "react-router-dom";
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

const serverUrl = import.meta.env.VITE_SERVER_URL;


function ItemPage(props) {
  const navigate = useNavigate();
  const [ItemData, setItemData] = useState([]);
  const [item, setItem] = useState([]);
  const [Itemname, setItemname] = useState("");
  const [ActivationRequest, setActivationRequest] = useState(false);
  const [Createdby, setCreatedby] = useState("");
  const [show, setShow] = useState(false);
  const [showEmailModel, setShowEmailModel] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [alreadyAnswered, setAlreadyAnswered] = useState(false);
  const [showQuestion, setshowQuestion] = useState(false);
  const [answer, setAnswer] = useState("");
  const [itemid, setItemid] = useState("");
  const [Question, setQuestion] = useState(false);
  const [isOwner, setIsOwner] = useState();
  const [isSaved, setIsSaved] = useState(false);
  const [emailMessage, setEmailMessage] = useState("");
  const [creator_info, setCreatorInfo] = useState("");
  const [itemname, setItemnameState] = useState("");
  const [description, setDescription] = useState("");
  const [emailSubject, setemailSubject] = useState("");
  const [itemquestion, setItemQuestion] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(true);
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

  setConstraint(true);
  const location = useLocation(); // Use the useLocation hook to get the current location object
  const queryParams = new URLSearchParams(location.search); // Create a URLSearchParams object from the query string

  const item_id = queryParams.get("cid"); // Extract the item ID from the 'cid' parameter
  const item_owner = ItemData.createdBy;
  // alert(item_owner);

  const [user_info, setUserInfo] = useState(() => {
    return JSON.parse(localStorage.getItem("user")) || {};
  });
  const user_id = user_info._id;

  const temp = [];
  const validation = [];
  const admin = "67075569252b464e56db8e31";
  
  // Fetching item data on component mount
  useEffect(() => {
    
    Axios.get(`${serverUrl}/item/${item_id}`)
      .then((response) => {
        const data = response.data.Item;
        const answersData = response.data.Answers;
        setItem(data);
        // console.log(item);
        setItemAnswers(answersData);
        setItemData(data);
        setIsOwner(user_id == item_owner || user_id == admin ? true : false);
        Axios.get(
          `${serverUrl}/responseData/${user_id}/${item_id}`
        ).then((response) => {
          const hasAnswered = response.data.answered;
          setAlreadyAnswered(hasAnswered);
        });

        const saveItem = () => {
          Axios.post(`${serverUrl}/savePost/${user_id}/${item_id}`)
            .then((response) => {
              const message = response.data.message;
              setIsSaved(true); // Assume item saved successfully
            })
            .catch((error) => {
              console.error("Error saving item:", error);
              // Optional: Handle error, maybe show an alert or log it
            });
        };
        const unsaveItem = () => {
          Axios.post(`${serverUrl}/unsavePost/${user_id}/${item_id}`)
            .then((response) => {
              const message = response.data.message;
              setIsSaved(false); // Assume item saved successfully
            })
            .catch((error) => {
              console.error("Error unsaving item:", error);
              // Optional: Handle error, maybe show an alert or log it
            });
        };

        Axios.get(`${serverUrl}/isSaved/${user_id}/${item_id}`)
          .then((response) => {
            const isPostSaved = response.data.saved;
            setIsSaved(isPostSaved);
          })
          .catch((error) => {
            console.error("Error checking if item is saved:", error);
            // Optional: Handle error, maybe set an error state
          });

        setItemid(data._id);
        setItemnameState(data.name);
        setDescription(data.description);
        setItemQuestion(data.question);
        setType(data.type);
        setCreatedby(data.createdBy);
        setItemImage(data.itemPictures);

        temp.push(
          <div className="itemDescription">
            <h3 className="attributes">
              <span>
                Posted By:&nbsp;
              </span>
              <Link to={`/userProfile/${Createdby}`}>
                <span
                  style={{
                    fontFamily: "DynaPuff, system-ui",
                    fontWeight: "500",
                    fontSize: "1.25rem",
                    textTransform: "uppercase",
                    textDecoration: "none",
                    textShadow: "1px 1px 2px black",
                    color: "#ff8b4d",
                  }}
                >
                  {creator_info.firstname} {creator_info.lastname}
                </span>
              </Link>
            </h3>
            <h3 className="attributes">
              <span>Item name:</span>
              <span className="details"> {data.name} </span>
              <Button
                onClick={() =>
                  navigator.clipboard.writeText(
                    `http://localhost:5173/item/${item.name}?cid=${item._id}&type=${item.type}`
                  )
                }
                style={{
                  border: "none",
                  background: "none",
                }}
              >
                <span style={{ fontSize: "1.5rem" }}>🔗</span>{" "}
              </Button>
            </h3>
            <h3 className="attributes">
              Item description :{" "}
              <span className="details">{data.description}</span>
            </h3>
            <hr />
            <h3 className="attributes">
              Item type : <span className="details">{data.type}</span>
            </h3>
            <hr />
            <h3 className="attributes">
              Item Location : <span className="details">{data.location}</span>
            </h3>
            <hr />
            <h3 className="attributes">
              Status :{" "}
              <span className="details">
                {data.status ? "Active" : "Inactive"}
              </span>
            </h3>
            <hr />
            <h6 className="attributes">
              Created at:{" "}
              <span className="details">
                {new Date(data.createdAt).toLocaleString()}
              </span>
            </h6>
            {isOwner && user_id && (
              <span className="ed-button">
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
                {user_id == admin ? (
                  <Button
                    variant="primary"
                    onClick={() => setShowEmailModel(true)}
                    style={{
                      marginTop: "0px",
                      backgroundColor: "#ffa200",
                      border: "none",
                      fontFamily: "DynaPuff",
                      fontWeight: "400",
                      fontSize: "1.05rem",
                      textShadow: "0.5px 0.5px 2px black",
                    }}
                  >
                    Send Mail to Owner
                  </Button>
                ) : (
                  <></>
                )}
              </span>
            )}
            <span>
              <span>
                {alreadyAnswered ? (
                  <span className="ed-button">
                    <Button
                      variant="secondary"
                      disabled
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
                  </span>
                ) : (
                  <span className="ed-button">
                    {!isOwner && user_id ? (
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
                  </span>
                )}
              </span>

              {/* Only show the save button if the user is not the owner */}
              {!isOwner && user_id && (
                <span>
                  {isSaved ? (
                    <span className="ed-button">
                      <Button
                        variant="secondary"
                        onClick={unsaveItem}
                        style={{
                          fontFamily: "DynaPuff",
                          fontWeight: "400",
                          fontSize: "1.05rem",
                          backgroundColor: "#d19a02",
                          border: "none",
                          color: "#0c151d",
                          textShadow: "0.5px 0.5px 0.2px black",
                          boxShadow: "2px 2px 2px black",
                          marginLeft: "80px",
                        }}
                      >
                        Unsave
                      </Button>
                    </span>
                  ) : (
                    <span className="ed-button">
                      <Button
                        variant="primary"
                        onClick={saveItem}
                        style={{
                          fontFamily: "DynaPuff",
                          fontWeight: "400",
                          fontSize: "1.05rem",
                          backgroundColor: "#fcba03",
                          border: "none",
                          color: "#0c151d",
                          textShadow: "0.5px 0.5px 0.2px black",
                          boxShadow: "2px 2px 2px black",
                          marginLeft: "80px",
                        }}
                      >
                        Save Item
                      </Button>
                    </span>
                  )}
                </span>
              )}
            </span>
          </div>
        );
        setItemname(temp);
      })
      .catch((err) => console.log(err));
    validation.push(
      <span key="validation-wrapper">
        {" "}
        {/* Wrap with a unique key for the outer div */}
        {isOwner && user_id ? (
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
                          width: "100%",
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
                              <p>
                                Already Submitted as{" "}
                                <span
                                  style={{
                                    fontFamily: "DynaPuff, system-ui",
                                    fontWeight: "400",
                                    textShadow: "0.2px 0.2px 1px black",
                                    color: "#ff8b4d",
                                    textTransform: "uppercase",
                                  }}
                                >
                                  "{answer.response}"{" "}
                                </span>
                              </p>
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
      </span>
    );
    setauthenication(validation);
  }, [alreadyAnswered, item_id, isOwner, isSaved, creator_info]);

  // Submit Functions

  const submitActivate = (item_id) => {
    Axios.post(`${serverUrl}/activateItem/${item_id}`)
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
    Axios.post(`${serverUrl}/deactivateItem/${item_id}`)
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
    Axios.post(`${serverUrl}/deleteitem`, { item_id })
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
        setTimeout(() => navigate("/mylistings"), 1500);
      })
      .catch((err) => console.log(err));
  };
  //HANDLE EDIT
  const sendMail = () => {
    const mailData = {
      subject: emailSubject,
      emailBody: emailMessage,
      userId: item_owner,
    };

    Axios.post(`${serverUrl}/sendMail`, mailData)
      .then(() => {
        toast.success("Mail Sent successfully!", {
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
      })
      .catch((err) => console.log(err));
    setShowEmailModel(false);
    setEmailMessage("");
    setemailSubject("");
  };

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

    Axios.post(`${serverUrl}/edititem`, formData)
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
    Axios.post(`${serverUrl}/submitAnswer`, {
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
    Axios.post(`${serverUrl}/confirmResponse/${id}`, {
      response: answer,
    }) // Fix URL and key
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

  const fetchCreator = async () => {
    try {
      const response = await Axios.get(
        `${serverUrl}/user/${item_owner}`
      );
      const data = response.data.items;
      console.log(response.data.user);
      setCreatorInfo(response.data.user);
    } catch (err) {
      console.error("Error fetching items:", err);
    }
  };
  useEffect(()=>{
    fetchCreator();
  },[Createdby])

  return (
    <>
      <div style={{ marginTop: "120px" }}>
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
                  src={`${serverUrl}/${ItemData.itemPictures[0].img}`}
                  alt="item"
                />
              ) : (
                <div>
                  <img
                    style={{
                      padding: "15px 15px 0px 15px",
                      borderRadius: "10px",
                      marginBottom: "0.10px",
                      borderBottom: "8px solid #ff8b4d",
                      height: "250px",
                    }}
                    src={`/default-img.png`}
                    alt="item"
                  />
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
              <Modal.Title
                style={{ fontFamily: "DynaPuff", fontWeight: "400" }}
              >
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

          <Modal show={showEmailModel} onHide={() => setShowEmailModel(false)}>
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
              <Modal.Title
                style={{ fontFamily: "DynaPuff", fontWeight: "400" }}
              >
                Send Mail
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
                    Subject
                  </Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter subject"
                    value={emailSubject}
                    onChange={(e) => setemailSubject(e.target.value)}
                    required
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
                    Email
                  </Form.Label>
                  <Form.Control
                    as="textarea"
                    placeholder="Enter Email"
                    value={emailMessage}
                    onChange={(e) => setEmailMessage(e.target.value)}
                    style={{
                      height: "250px",
                    }}
                    required
                  />
                </Form.Group>
                <Button
                  variant="primary"
                  onClick={sendMail}
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
      </div>
    </>
  );
}
export default ItemPage;
