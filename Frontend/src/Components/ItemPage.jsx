import React, { useState, useEffect } from "react";
import "../css/itempage.css";
import Axios from "axios";
import { useNavigate,useLocation } from "react-router-dom";
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

  const [Itemname, setItemname] = useState("");
  const [ActivationRequest, setActivationRequest] = useState(false);
  const [Createdby, setCreatedby] = useState("");
  const [show, setShow] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [alreadyAnswered, setAlreadyAnswered] = useState(false);
  const [showQuestion, setShowQuestion] = useState(false);
  const [answer, setAnswer] = useState("");
  const [itemid, setItemid] = useState("");
  const [itemname, setItemnameState] = useState("");
  const [description, setDescription] = useState("");
  const [itemquestion, setItemQuestion] = useState("");
  const [itemimage, setItemImage] = useState([]);
  const [newitemimage, setNewItemImage] = useState([]);
  const [type, setType] = useState("");
  const [messageId, setMessageId] = useState("");
  const [response, setResponse] = useState("");

  // Modal Controls
  const handleCloseDelete = () => setShowDelete(false);
  const handleCloseActivation = () => setActivationRequest(false);
  const handleCloseQuestion = () => setShowQuestion(false);
  const handleShowDelete = () => setShowDelete(true);
  const handleShowQuestion = () => setShowQuestion(true);

  // Constants and Data Extraction from URL
  setConstraint(true);
//   const item_type = props.location.search.split("=")[2].split("/")[0];
//   const item_id = props.location.search.split("=")[1].split("&")[0];
//   const current_user = props.location.search.split("/")[1];
const location = useLocation(); // Use the useLocation hook to get the current location object
const queryParams = new URLSearchParams(location.search); // Create a URLSearchParams object from the query string

const item_id = queryParams.get('cid'); // Extract the item ID from the 'cid' parameter
const item_type = queryParams.get('type').split('/')[0]; // Extract the item type from the 'type' parameter and split it
const current_user = queryParams.get('type').split('/')[1]; // Extract the current user info from the 'type' parameter

// Use the extracted values in your component logic
console.log(item_id, item_type, current_user);

  // Fetching item data on component mount
  useEffect(() => {
    Axios.get(`http://localhost:5000/item/${item_id}`)
      .then((response) => {
        const data = response.data.Item;
        const answers = response.data.Answers;
        console.log("Data is: ",data);

        if (JSON.parse(localStorage.getItem("user"))._id === data.givenBy) {
          setAlreadyAnswered(true);
        }
        setItemid(data._id);
        setItemnameState(data.name);
        setDescription(data.description);
        setItemQuestion(data.question);
        setType(data.type);
        setCreatedby(data.createdBy);
        setItemImage(data.itemPictures);

        setItemname(
          <div className="itemDescription">
            <h3 className="attributes">
              Item name : <span className="details">{data.name}</span>
            </h3>
            <hr />
            <h3 className="attributes">
              Item description : <span className="details">{data.description}</span>
            </h3>
            <hr />
            <h3 className="attributes">
              Item type : <span className="details">{data.type}</span>
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
            {current_user === "true" && (
              <div className="ed-button">
                <Button variant="danger" onClick={handleShowDelete}>
                  Delete item
                </Button>
                <Button variant="primary" onClick={() => setShow(true)}>
                  Edit item
                </Button>
                {!data.status && (
                  <Button
                    variant="primary"
                    onClick={() => setActivationRequest(true)}
                  >
                    Reactivate Item
                  </Button>
                )}
              </div>
            )}
          </div>
        );
      })
      .catch((err) => console.log(err));
  }, [alreadyAnswered, item_id]);

  // Submit Functions
  const submitActivate = () => {
    Axios.post(`http://localhost:5000/activateItem/${item_id}`)
      .then(() => {
        alert("Item Activated 👍");
        setTimeout(() => window.location.reload(), 2000);
      })
      .catch((err) => console.log(err));
    setActivationRequest(false);
  };

  const delete_item = () => {
    Axios.post("http://localhost:5000/deleteitem", { item_id })
      .then(() => {
        handleCloseDelete();
        alert("Item deleted successfully!");
        setTimeout(() => navigate("/feed"), 2000);
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

    newitemimage.length > 0
      ? newitemimage.forEach((img) =>
          formData.append("itemPictures", img, img.name)
        )
      : itemimage.forEach((img) => formData.append("olditemPictures", img.img));

    Axios.post("http://localhost:5000/edititem", formData)
      .then(() => {
        alert("Item edited successfully!");
        setTimeout(() => window.location.reload(), 2000);
      })
      .catch((err) => console.log(err));
    setShow(false);
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
        alert("Response saved ✔️");
        setTimeout(() => window.location.reload(), 2000);
      })
      .catch((err) => console.log(err));
    setAnswer("");
  };

  return (
    <>
      <Navbar />
      <Container fluid>
        <div className="itempage">
          <div>{Itemname}</div>
        </div>

        {/* Modals */}
        <Modal show={ActivationRequest} onHide={handleCloseActivation}>
          <Modal.Body>Are you sure?</Modal.Body>
          <Modal.Footer>
            <Button variant="primary" onClick={handleCloseActivation}>
              No
            </Button>
            <Button variant="danger" onClick={submitActivate}>
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

        <Modal show={showQuestion} onHide={handleCloseQuestion}>
          <Modal.Header closeButton>
            <Modal.Title>Submit Answer</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group>
                <Form.Label>{itemquestion}</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter your answer"
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                />
              </Form.Group>
              <Button variant="primary" onClick={submitAnswer}>
                Submit
              </Button>
            </Form>
          </Modal.Body>
        </Modal>
      </Container>
    </>
  );
}

export default ItemPage;
