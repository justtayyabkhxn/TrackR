import React, { useState } from "react";
import axios from "axios";
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

  const handleClose = () => {
    setShow(false);
    setItemName("");
    setDescription("");
    setType("");
    setItemQuestion("");
    setItemImage([]);
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    const validImages = selectedFiles.filter((file) =>
      ["image/jpeg", "image/png", "image/jpg"].includes(file.type)
    );
    if (validImages.length !== selectedFiles.length) {
      alert("Please upload only image files (jpg, jpeg, png).");
    }
    setItemImage(validImages);
  };

  const handleSubmit = () => {
    if (itemName && description && type) {
      const info = new FormData();
      info.append("name", itemName);
      info.append("description", description);
      info.append("question", itemQuestion);
      info.append("type", type);

      if (itemImage.length > 0) {
        itemImage.forEach((image) => {
          info.append("itemPictures", image, image.name);
        });
      }

      setLoading(true);

      axios
        .post("http://localhost:5000/postitem", info, {
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
          alert("Wohoo 🤩! Item listed successfully.");
          handleClose();
          window.location.reload();
        })
        .catch((err) => {
          if (err.response) {
            alert(
              `Error: ${err.response.data.message || "Something went wrong!"}`
            );
          } else {
            alert("Oops 😞! Check internet connection or try again later.");
          }
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      alert("Did you miss any of the required fields 🙄?");
    }
  };

  return (
    <div>
      <Button
        variant="primary"
        onClick={handleShow}
        style={{
          backgroundColor: "#ff8b4d",
          color: "#0c151d",
          border: "none",
          height: "53px",
          fontSize: "20px",
          boxShadow: "2px 2px 2px black",
          textShadow: "0.2px 0.25px .1px black",
          marginRight: "0px",
        }}
      >
        POST ITEM
      </Button>

      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header
          closeButton
          closeVariant="white"  
          style={{
            backgroundColor: "#0c151d",
            color: "#ff8b4d",
            textTransform: "uppercase",
            borderBottom: "5px solid #ff8b4d",
            
          }}
        >
          <Modal.Title style={{ fontSize: "2rem" }}>Post item</Modal.Title>
        </Modal.Header>
        <Modal.Body
          style={{
            backgroundColor: "#0c151d",
           
          }}
        >
          <Form>
            <Form.Group style={{ color: "#ff8b4d" }}>
              <Form.Label
                style={{
                  fontFamily: "DynaPuff, system-ui",
                  fontWeight: "400",
                  textTransform: "uppercase",
                }}
              >
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
              <Form.Label
                style={{
                  color: "#ff8b4d",
                  textTransform: "uppercase",
                  marginTop: "7.5px",
                  marginBottom: "1px",
                  fontFamily: "DynaPuff, system-ui",
                  fontWeight: "400",
                }}
              >
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
              <Form.Label
                style={{
                  color: "#ff8b4d",
                  textTransform: "uppercase",
                  marginTop: "7.5px",
                  marginBottom: "1px",
                  fontFamily: "DynaPuff, system-ui",
                  fontWeight: "400",
                }}
              >
                Enter a question based on the item
              </Form.Label>
              <Form.Control
                type="text"
                placeholder="Ex:- What is the color of the phone ?"
                value={itemQuestion}
                onChange={(e) => setItemQuestion(e.target.value)}
              />
            </Form.Group>

            <Form.Group>
              <Form.Label
                style={{
                  color: "#ff8b4d",
                  textTransform: "uppercase",
                  marginTop: "7.5px",
                  marginBottom: "1px",
                  fontFamily: "DynaPuff, system-ui",
                  fontWeight: "400",
                }}
              >
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
              <Form.Label
                style={{
                  color: "#ff8b4d",
                  textTransform: "uppercase",
                  marginTop: "7.5px",
                  marginBottom: "1px",
                  fontFamily: "DynaPuff, system-ui",
                  fontWeight: "400",
                }}
              >
                Upload Image
              </Form.Label>
              <Form.Control type="file" multiple onChange={handleFileChange} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer
          style={{ backgroundColor: "#0c151d", textTransform: "uppercase" }}
        >
          <Button
            variant="secondary"
            onClick={handleClose}
            style={{
              textTransform: "uppercase",
              marginTop: "7.5px",
              marginBottom: "1px",
              fontFamily: "DynaPuff, system-ui",
              fontWeight: "400",
            }}
          >
            Close
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            style={{
              textTransform: "uppercase",
              marginTop: "7.5px",
              marginBottom: "1px",
              fontFamily: "DynaPuff, system-ui",
              fontWeight: "400",
              backgroundColor:"green",
              border:"none"
            }}
          >
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
