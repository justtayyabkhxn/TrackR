import React, { useState } from "react";
import axios from "axios";
import lodash from "lodash";
import "bootstrap/dist/css/bootstrap.min.css";
import { Button, Modal, Form, Spinner } from "react-bootstrap";

function LostItem() {
  const [show, setShow] = useState(false);
  const token = window.localStorage.getItem("token");
  const [loading, setLoading] = useState(false);
  const [itemName, setItemName] = useState("");
  const [description, setDescription] = useState("");
  const [itemQuestion, setItemQuestion] = useState("");
  const [itemImage, setItemImage] = useState([]);
  const [type, setType] = useState("");

  const handleShow = () => setShow(true);
  const handleClose = () => setShow(false);

  const handleSubmit = () => {
    if (itemName && description && type) {
      const info = new FormData();
      info.append("name", itemName);
      info.append("description", description);
      info.append("question", itemQuestion);
      info.append("type", type);

      itemImage.forEach((image) => {
        info.append("itemPictures", image, image.name);
      });

      setLoading(true);

      axios.post("http://localhost:5000/postitem", info, {
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
        onUploadProgress: (ProgressEvent) => {
          console.log(
            `Upload progress: ${Math.round(
              (ProgressEvent.loaded / ProgressEvent.total) * 100
            )}%`
          );
        },
      })
        .then((response) => {
          alert("Wohoo 🤩! Item listed successfully.", { appearance: "success" });
          setItemName("");
          setDescription("");
          setType("");
          setItemQuestion("");
          setItemImage([]);
          handleClose();
        })
        .catch((err) => {
          alert("Oops 😞! Check internet connection or try again later.", { appearance: "error" });
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      alert("Did you miss any of the required fields 🙄?", { appearance: "error" });
    }
  };

  return (
    <div>
      <Button variant="primary" onClick={handleShow}
      style={{backgroundColor:"#ff8b4d",color:"#0c151d",border:"none",height:"53px",fontSize:"20px",boxShadow:"2px 2px 2px black",textShadow:"0.2px 0.25px .1px black",marginRight:"0px"}}>
        POST ITEM
      </Button>

      <Modal show={show} onHide={handleClose} backdrop="static" keyboard={false}>
        <Modal.Header closeButton>
          <Modal.Title>Post item</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>
                Item name<span style={{ color: "red" }}>*</span>
              </Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter item"
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>
                Description<span style={{ color: "red" }}>*</span>
              </Form.Label>
              <Form.Control
                as="textarea"
                placeholder="Enter Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>Enter a question based on the item</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ex:- What is the color of the phone ?"
                value={itemQuestion}
                onChange={(e) => setItemQuestion(e.target.value)}
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>
                Item type<span style={{ color: "red" }}>*</span>
              </Form.Label>
              <Form.Control
                as="select"
                value={type}
                onChange={(e) => setType(e.target.value)}
                required
              >
                <option value="">Choose...</option>
                <option value="Lost">Lost It</option>
                <option value="Found">Found It</option>
              </Form.Control>
            </Form.Group>
            
            <Form.Group>
              <Form.Label>Upload Image</Form.Label>
              <Form.Control
                type="file"
                multiple
                onChange={(e) => {
                  setItemImage([...e.target.files]);
                }}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            {loading ? (
              <>
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                />
                <span className="visually-hidden">Loading...</span>
              </>
            ) : (
              <>Submit</>
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default LostItem;
