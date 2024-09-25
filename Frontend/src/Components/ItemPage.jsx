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
  // const [Itemname, setItemname] = useState("");
  const [ActivationRequest, setActivationRequest] = useState(false);
  const [Createdby, setCreatedby] = useState("");
  const [show, setShow] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [alreadyAnswered, setAlreadyAnswered] = useState(false);
  const [showQuestion, setshowQuestion] = useState(false);
  const [answer, setAnswer] = useState("");
  const [itemid, setItemid] = useState("");
  const [Question, setQuestion] = useState(false);

  const [itemname, setItemnameState] = useState("");
  const [description, setDescription] = useState("");
  const [itemquestion, setItemQuestion] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [itemImage, setItemImage] = useState([]);
  const [newitemimage, setNewItemImage] = useState([]);
  const [type, setType] = useState("");
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
  // const handleShowQuestion = () => setQuestion(true);
  // const handleShowQuestion = () => setShowQuestion(true);

  // Constants and Data Extraction from URL
  setConstraint(true);
  const location = useLocation(); // Use the useLocation hook to get the current location object
  const queryParams = new URLSearchParams(location.search); // Create a URLSearchParams object from the query string

  const item_id = queryParams.get("cid"); // Extract the item ID from the 'cid' parameter
  const item_type = queryParams.get("type").split("/")[0]; // Extract the item type from the 'type' parameter and split it
  const current_user = queryParams.get("type").split("/")[1]; // Extract the current user info from the 'type' parameter

  const [user_info, setUserInfo] = useState(() => {
    return JSON.parse(localStorage.getItem("user")) || {};
  });
  const user_id = user_info._id;

  // Use the extracted values in your component logic
  // console.log(item_id, item_type, current_user);
  const validation = [];
  // Fetching item data on component mount
  useEffect(() => {
    // Axios.get(`http://localhost:5000/responseData/${item_id} & ${}`).then((response) =>{

    // })
    Axios.get(`http://localhost:5000/item/${item_id}`)
      .then((response) => {
        const data = response.data.Item;
        const answers = response.data.Answers;
        console.log("Data is: ", data);

        setItemData(data);

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

        setItemnameState(
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
            {current_user === "true" && (
              <div className="ed-button">
                <Button
                  variant="danger"
                  onClick={handleShowDelete}
                  style={{
                    fontFamily: "DynaPuff",
                    fontWeight: "400",
                    fontSize: "1.05rem",
                    textShadow:"0.5px 0.5px 2px black",

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
                    textShadow:"0.5px 0.5px 2px black",

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
                        textShadow:"0.5px 0.5px 2px black",

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
                        textShadow:"0.5px 0.5px 2px black",

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
                  >
                    {data.type === "Lost" ? "Found Item" : "Claim Item"}
                  </Button>
                </div>
              ) : (
                <div className="ed-button">
                  {current_user === "false" ? (
                    <Button
                      variant="primary"
                      onClick={handleShowQuestion}
                      style={{
                        fontFamily: "DynaPuff",
                        fontWeight: "400",
                        fontSize: "1.05rem",
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
      })
      .catch((err) => console.log(err));
  }, [alreadyAnswered, item_id]);

  // Submit Functions
  const submitActivate = (item_id) => {
    Axios.post(`http://localhost:5000/activateItem/${item_id}`)
      .then(() => {
        toast.success("Item Activated 👍", {
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
            textShadow:"0.5px 0.5px 2px black",
            color:"#ff8b4d",
            backgroundColor:"#0c151d"
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
        toast.success("Item Deactivated 👍", {
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
            textShadow:"0.5px 0.5px 2px black",
            color:"#ff8b4d",
            backgroundColor:"#0c151d"
          },
        });
        setTimeout(() => window.location.reload(), 2000);
      })
      .catch((err) => console.log(err));
    setShowConfirmation(false);
  };

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
            textShadow:"0.5px 0.5px 2px black",
            color:"#ff8b4d",
            backgroundColor:"#0c151d"
          },
        });
        setTimeout(() => navigate("/feed"), 1500);
      })
      .catch((err) => console.log(err));
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
            textShadow:"0.5px 0.5px 2px black",
            color:"#ff8b4d",
            backgroundColor:"#0c151d"
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
            textShadow:"0.5px 0.5px 2px black",
            color:"#ff8b4d",
            backgroundColor:"#0c151d"
          },
        });
        setTimeout(() => window.location.reload(), 2000);
      })
      .catch((err) => console.log(err));
    setAnswer("");
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
                  Loading...
                </span>
              </div>
            )}
          </div>
          <div className="itempage">
            <div>{itemname}</div>
          </div>
        </div>
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
          <Modal.Body>Are you sure?</Modal.Body>
          <Modal.Footer>
            <Button variant="primary" onClick={handleCloseDelete}>
              No
            </Button>
            <Button variant="danger" onClick={delete_item}>
              Yes
            </Button>
          </Modal.Footer>
        </Modal>

        <Modal show={show} onHide={() => setShow(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Edit Item</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group>
                <Form.Label>Item name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter item"
                  value={itemname}
                  onChange={(e) => setItemnameState(e.target.value)}
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Description</Form.Label>
                <Form.Control
                  as="textarea"
                  placeholder="Enter description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Question</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter question"
                  value={itemquestion}
                  onChange={(e) => setItemQuestion(e.target.value)}
                />
              </Form.Group>
              <Button variant="primary" onClick={handleEdit}>
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
              <Modal.Body>
                <Form.Group>
                  <Form.Label>{itemquestion}</Form.Label>{" "}
                  {/* Display the question */}
                  <Form.Control
                    as="textarea"
                    placeholder="Enter Answer"
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                  />
                </Form.Group>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="primary" onClick={handleCloseQuestion}>
                  Close
                </Button>
                <Button variant="primary" onClick={submitAnswer}>
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

{
  /* Activation Confirmation Modal */
}
{
  /* <Modal
                      show={ActivationRequest}
                      onHide={handleCloseActivation}
                    >
                      <Modal.Body>
                        Are you sure you want to activate this item?
                      </Modal.Body>
                      <Modal.Footer>
                        <Button
                          variant="primary"
                          onClick={handleCloseActivation}
                        >
                          No
                        </Button>
                        <Button
                          variant="danger"
                          onClick={() => submitActivate(item_id)}
                        >
                          Yes
                        </Button>
                      </Modal.Footer>
                    </Modal>

                    {/* Deactivation Confirmation Modal */
}
{
  /* <Modal
                      show={showConfirmation}
                      onHide={() => setShowConfirmation(false)}
                    >
                      <Modal.Body>
                        Are you sure you want to deactivate this item?
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
                          onClick={() => submitDeactivate(item_id)}
                        >
                          Yes
                        </Button>
                      </Modal.Footer>
                    </Modal> */
}
