import React, { useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { Button, Modal, Form, Spinner } from "react-bootstrap";
import { Flip, ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../css/lost_item.css";

function PostItem() {
  const [show, setShow] = useState(false);
  const token = window.localStorage.getItem("token");
  const [loading, setLoading] = useState(false);
  const [itemName, setItemName] = useState("");
  const [description, setDescription] = useState("");
  const [itemQuestion, setItemQuestion] = useState("");
  const [itemImage, setItemImage] = useState([]);
  const [type, setType] = useState("");
  const [location, setLocation] = useState("");

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
      toast.warn("Please upload only image files (jpg, jpeg, png).", {
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
    }

    setItemImage(validImages);
  };

  const handleSubmit = () => {
    if (itemName && description && type && location) {
      const info = new FormData();
      info.append("name", itemName);
      info.append("description", description);
      info.append("question", itemQuestion);
      info.append("type", type);
      info.append("location",location)

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
          toast.success("Wohoo 🤩! Item listed successfully.", {
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
          handleClose();
          window.location.reload();
        })
        .catch((err) => {
          if (err.response) {
            toast.error(
              `Error: ${err.response.data.message || "Something went wrong!"}`,
              {
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
              }
            );
          } else {
            toast.error(
              "Oops 😞! Check internet connection or try again later.",
              {
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
              }
            );
          }
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      toast.error("Did you miss any of the required fields 🙄?", {
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
        className: "toastNotif",
      });
    }
  };

  return (
    <div>
      <Button className="postButton" onClick={handleShow}>
        POST ITEM
      </Button>
      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
        style={{
          marginTop: "50px",
        }}
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
          <Modal.Title
            style={{ fontSize: "2rem", textShadow: "0.5px 0.5px 1px black" }}
          >
            Post item
          </Modal.Title>
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
                  textShadow: "0.5px 0.5px 1px black",
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
                  textShadow: "0.5px 0.5px 1px black",
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
                  textShadow: "0.5px 0.5px 1px black",
                }}
              >
                Enter a question based on the item
                <span style={{ color: "red" }}>*</span>
              </Form.Label>
              <Form.Control
                type="text"
                placeholder="Ex:- What is the color of the phone ?"
                value={itemQuestion}
                onChange={(e) => setItemQuestion(e.target.value)}
                required
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
                  textShadow: "0.5px 0.5px 1px black",
                }}
              >
                Upload image
              </Form.Label>
              <Form.Control
                type="file"
                accept=".jpg, .jpeg, .png"
                onChange={handleFileChange}
                multiple
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
                  textShadow: "0.5px 0.5px 1px black",
                }}
              >
                Type<span style={{ color: "red" }}>*</span>
              </Form.Label>
              <Form.Select
                value={type}
                onChange={(e) => setType(e.target.value)}
              >
                <option value="">Select Type</option>
                <option value="Lost">Lost</option>
                <option value="Found">Found</option>
              </Form.Select>
            </Form.Group>
            <Form.Group>
              <Form.Label
                style={{
                  color: "#ff8b4d",
                  textTransform: "uppercase",
                  marginTop: "7.5px",
                  fontFamily: "DynaPuff, system-ui",
                  fontWeight: "400",
                  textShadow: "0.5px 0.5px 1px black",
                }}
              >
                Location<span style={{ color: "red" }}>*</span>
              </Form.Label>
              <Form.Control
                as="select"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                required
              >
                <option value="">Select location</option>
                <option value="Library">Library</option>
                <option value="Main Hall">Main Hall</option>
                <option value="Cafeteria">Cafeteria</option>
                {/* Add more locations as needed */}
              </Form.Control>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer style={{ backgroundColor: "#0c151d" }}>
          <Button
            variant="secondary"
            onClick={handleClose}
            style={{ background: "red", border: "none" }}
          >
            <span
              style={{
                fontFamily: "DynaPuff, system-ui",
                fontWeight: "400",
                textTransform: "uppercase",
                textShadow: "0.5px 0.5px 1px black",
                color: "white",
              }}
            >
              Close
            </span>
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            disabled={loading}
            style={{ background: "green", border: "none" }}
          >
            {loading ? (
              <Spinner as="span" animation="border" size="sm" role="status" />
            ) : (
              <span
                style={{
                  fontFamily: "DynaPuff, system-ui",
                  fontWeight: "400",
                  textTransform: "uppercase",
                  textShadow: "0.5px 0.5px 1px black",
                  color: "white",
                }}
              >
                Submit
              </span>
            )}
          </Button>
        </Modal.Footer>
      </Modal>
      <ToastContainer />
    </div>
  );
}

export default PostItem;
