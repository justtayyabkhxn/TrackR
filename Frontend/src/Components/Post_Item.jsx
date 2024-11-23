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
      info.append("location", location);

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
                <option value="Abdullah School">Abdullah School</option>
                <option value="Advanced Centre for Women's Studies">
                  Advanced Centre for Women's Studies
                </option>
                <option value="Ahmadi School for the Visually Challenged">
                  Ahmadi School for the Visually Challenged
                </option>
                <option value="Ajmal Khan Tibbiya College">
                  Ajmal Khan Tibbiya College
                </option>
                <option value="Department of Agricultural Eco. & Business Mngt.">
                  Department of Agricultural Eco. & Business Mngt.
                </option>
                <option value="Department of Agricultural Microbiology">
                  Department of Agricultural Microbiology
                </option>
                <option value="Department of Amraze Jild wa Zohrawiya">
                  Department of Amraze Jild wa Zohrawiya
                </option>
                <option value="Department of Anaesthesiology">
                  Department of Anaesthesiology
                </option>
                <option value="Department of Anatomy">
                  Department of Anatomy
                </option>
                <option value="Department of Applied Chemistry">
                  Department of Applied Chemistry
                </option>
                <option value="Department of Applied Mathematics">
                  Department of Applied Mathematics
                </option>
                <option value="Department of Applied Physics">
                  Department of Applied Physics
                </option>
                <option value="Department of Arabic">
                  Department of Arabic
                </option>
                <option value="Department of Architecture">
                  Department of Architecture
                </option>
                <option value="Department of Bio-chemistry (JNMC)">
                  Department of Bio-chemistry (JNMC)
                </option>
                <option value="Department of Bio-chemistry (Life Sciences)">
                  Department of Bio-chemistry (Life Sciences)
                </option>
                <option value="Department of Botany">
                  Department of Botany
                </option>
                <option value="Department of Business Administration">
                  Department of Business Administration
                </option>
                <option value="Department of Business Administration - Malappuram">
                  Department of Business Administration - Malappuram
                </option>
                <option value="Department of Business Administration - Murshidabad">
                  Department of Business Administration - Murshidabad
                </option>
                <option value="Department of Cardiology">
                  Department of Cardiology
                </option>
                <option value="Department of Cardiothoracic Surgery">
                  Department of Cardiothoracic Surgery
                </option>
                <option value="CEC">CEC</option>
                <option value="Department of Chemical Engineering">
                  Department of Chemical Engineering
                </option>
                <option value="Department of Chemistry">
                  Department of Chemistry
                </option>
                <option value="Department of Civil Engineering">
                  Department of Civil Engineering
                </option>
                <option value="College of Nursing, JNMC">
                  College of Nursing, JNMC
                </option>
                <option value="Department of Commerce">
                  Department of Commerce
                </option>
                <option value="Community College">Community College</option>
                <option value="Department of Community Medicine">
                  Department of Community Medicine
                </option>
                <option value="Department of Computer Engineering">
                  Department of Computer Engineering
                </option>
                <option value="Department of Computer Science">
                  Department of Computer Science
                </option>
                <option value="Department of Conservative Dentistry & Endodontics">
                  Department of Conservative Dentistry & Endodontics
                </option>
                <option value="Department of Dermatology">
                  Department of Dermatology
                </option>
                <option value="Dr. Ziauddin Ahmad Dental College">
                  Dr. Ziauddin Ahmad Dental College
                </option>
                <option value="Department of Economics">
                  Department of Economics
                </option>
                <option value="Department of Education">
                  Department of Education
                </option>
                <option value="Department of Education - Malappuram">
                  Department of Education - Malappuram
                </option>
                <option value="Department of Education - Murshidabad">
                  Department of Education - Murshidabad
                </option>
                <option value="Department of Electrical Engineering">
                  Department of Electrical Engineering
                </option>
                <option value="Department of Electronics Engineering">
                  Department of Electronics Engineering
                </option>
                <option value="Department of English">
                  Department of English
                </option>
                <option value="Department of Fine Arts">
                  Department of Fine Arts
                </option>
                <option value="Department of Foreign Languages">
                  Department of Foreign Languages
                </option>
                <option value="Department of Forensic Medicine">
                  Department of Forensic Medicine
                </option>
                <option value="Department of Geography">
                  Department of Geography
                </option>
                <option value="Department of Geology">
                  Department of Geology
                </option>
                <option value="Department of Hindi">Department of Hindi</option>
                <option value="Department of History">
                  Department of History
                </option>
                <option value="Department of Home Sciences">
                  Department of Home Sciences
                </option>
                <option value="Department of Ilaj-Bit-Tadbeer">
                  Department of Ilaj-Bit-Tadbeer
                </option>
                <option value="Department of Ilmul Advia">
                  Department of Ilmul Advia
                </option>
                <option value="Department of Ilmul Amraz">
                  Department of Ilmul Amraz
                </option>
                <option value="Department of Ilmul Atfal">
                  Department of Ilmul Atfal
                </option>
                <option value="Department of Industrial Chemistry">
                  Department of Industrial Chemistry
                </option>
                <option value="Department of Interdisciplinary Biotechnology Unit">
                  Department of Interdisciplinary Biotechnology Unit
                </option>
                <option value="Department of Interdisciplinary Department of Remote Sensing and GIS Applications">
                  Department of Interdisciplinary Department of Remote Sensing
                  and GIS Applications
                </option>
                <option value="Department of Islamic Studies">
                  Department of Islamic Studies
                </option>
                <option value="Department of Jarahat">
                  Department of Jarahat
                </option>
                <option value="Jawaharlal Nehru Medical College">
                  Jawaharlal Nehru Medical College
                </option>
                <option value="Department of K. A. Nizami Centre for Quranic Studies">
                  Department of K. A. Nizami Centre for Quranic Studies
                </option>
                <option value="Kennedy Auditorium">Kennedy Auditorium</option>
                <option value="Kulliyat">Kulliyat</option>
                <option value="Department of Law">Department of Law</option>
                <option value="Department of Law - Malappuram">
                  Department of Law - Malappuram
                </option>
                <option value="Department of Law - Murshidabad">
                  Department of Law - Murshidabad
                </option>
                <option value="Library and Information Science">
                  Library and Information Science
                </option>
                <option value="Library Canteen">Library Canteen</option>
                <option value="Department of Linguistics">
                  Department of Linguistics
                </option>
                <option value="Department of Mass Communication">
                  Department of Mass Communication
                </option>
                <option value="Department of Mathematics">
                  Department of Mathematics
                </option>
                <option value="Maulana Azad Library">
                  Maulana Azad Library
                </option>
                <option value="Department of Mechanical Engineering">
                  Department of Mechanical Engineering
                </option>
                <option value="Department of Medicine">
                  Department of Medicine
                </option>
                <option value="Department of Microbiology">
                  Department of Microbiology
                </option>
                <option value="Department of Moalejat">
                  Department of Moalejat
                </option>
                <option value="Department of Modern Indian Languages">
                  Department of Modern Indian Languages
                </option>
                <option value="Department of Museology">
                  Department of Museology
                </option>
                <option value="Department of Neuro Surgery">
                  Department of Neuro Surgery
                </option>
                <option value="Department of Niswan wa Qabalat">
                  Department of Niswan wa Qabalat
                </option>
                <option value="Department of Obstetrics and Gynaecology">
                  Department of Obstetrics and Gynaecology
                </option>
                <option value="Department of Ophthalmology">
                  Department of Ophthalmology
                </option>
                <option value="Department of Oral & Dental Pathology and Microbiology/Oral Medicine & Dental Radiology">
                  Department of Oral & Dental Pathology and Microbiology/Oral
                  Medicine & Dental Radiology
                </option>
                <option value="Department of Oral & Maxillofacial Surgery">
                  Department of Oral & Maxillofacial Surgery
                </option>
                <option value="Department of Orthodontics and Dentofacial Orthopedics and Dental Anatomy">
                  Department of Orthodontics and Dentofacial Orthopedics and
                  Dental Anatomy
                </option>
                <option value="Department of Orthopaedic Surgery">
                  Department of Orthopaedic Surgery
                </option>
                <option value="Department of OTO-Rhino-Laryngology (E.N.T.)">
                  Department of OTO-Rhino-Laryngology (E.N.T.)
                </option>
                <option value="Department of Paediatric Surgery">
                  Department of Paediatric Surgery
                </option>
                <option value="Department of Paediatrics">
                  Department of Paediatrics
                </option>
                <option value="Department of Paediatrics & Preventive Dentistry">
                  Department of Paediatrics & Preventive Dentistry
                </option>
                <option value="Department of Pathology">
                  Department of Pathology
                </option>
                <option value="Department of Periodontia & Community Dentistry">
                  Department of Periodontia & Community Dentistry
                </option>
                <option value="Department of Persian">
                  Department of Persian
                </option>
                <option value="Department of Petroleum Studies">
                  Department of Petroleum Studies
                </option>
                <option value="Department of Pharmacology">
                  Department of Pharmacology
                </option>
                <option value="Department of Philosophy">
                  Department of Philosophy
                </option>
                <option value="Department of Physical Education">
                  Department of Physical Education
                </option>
                <option value="Department of Physics">
                  Department of Physics
                </option>
                <option value="Department of Physiology">
                  Department of Physiology
                </option>
                <option value="Department of Plant Protection">
                  Department of Plant Protection
                </option>
                <option value="Department of Plastic Surgery">
                  Department of Plastic Surgery
                </option>
                <option value="Department of Political Science">
                  Department of Political Science
                </option>
                <option value="Department of Post Harvest Engineering and Technology">
                  Department of Post Harvest Engineering and Technology
                </option>
                <option value="Department of Prosthodontics/Dental Material">
                  Department of Prosthodontics/Dental Material
                </option>
                <option value="Department of Psychiatry">
                  Department of Psychiatry
                </option>
                <option value="Department of Psychology">
                  Department of Psychology
                </option>
                <option value="Department of Radio-Diagnosis">
                  Department of Radio-Diagnosis
                </option>
                <option value="Department of Radiotherapy">
                  Department of Radiotherapy
                </option>
                <option value="Department of Saidla">
                  Department of Saidla
                </option>
                <option value="Department of Sanskrit">
                  Department of Sanskrit
                </option>
                <option value="Department of Shia Theology">
                  Department of Shia Theology
                </option>
                <option value="Department of Social Work">
                  Department of Social Work
                </option>
                <option value="Department of Sociology">
                  Department of Sociology
                </option>
                <option value="Department of South African & Brazilian Studies">
                  Department of South African & Brazilian Studies
                </option>
                <option value="Department of Statistics and Operations Research">
                  Department of Statistics and Operations Research
                </option>
                <option value="Department of Strategic & Security Studies">
                  Department of Strategic & Security Studies
                </option>
                <option value="Department of Sunni Theology">
                  Department of Sunni Theology
                </option>
                <option value="Department of Surgery">
                  Department of Surgery
                </option>
                <option value="Department of Tahaffuzi-wa-Samaji-Tib">
                  Department of Tahaffuzi-wa-Samaji-Tib
                </option>
                <option value="Department of Tashreeh wa Munafeul Aza">
                  Department of Tashreeh wa Munafeul Aza
                </option>
                <option value="Department of Tashreehul Badan">
                  Department of Tashreehul Badan
                </option>
                <option value="Department of TB and Chest Diseases">
                  Department of TB and Chest Diseases
                </option>
                <option value="Department of Urdu">Department of Urdu</option>
                <option value="Department of West Asian Studies and North African Studies">
                  Department of West Asian Studies and North African Studies
                </option>
                <option value="Department of Wildlife Sciences">
                  Department of Wildlife Sciences
                </option>
                <option value="Women's College">Women's College</option>
                <option value="Department of Zoology">
                  Department of Zoology
                </option>
                <option value="Jawaharlal Nehru Medical College">
                  Jawaharlal Nehru Medical College
                </option>
                <option value="Library Canteen">Library Canteen</option>
                <option value="Maulana Azad Library">
                  Maulana Azad Library
                </option>
                <option value="Para Medical College">
                  Para Medical College
                </option>
                <option value="Raja Mahendra Pratap Singh AMU City School">
                  Raja Mahendra Pratap Singh AMU City School
                </option>
                <option value="Saiyyid Hamid Senior Secondary School (Boys)">
                  Saiyyid Hamid Senior Secondary School (Boys)
                </option>
                <option value="Senior Secondary School (Girls)">
                  Senior Secondary School (Girls)
                </option>
                <option value="S.T.S School">S.T.S School</option>
                <option value="AMU ABK High School (Boys)">
                  AMU ABK High School (Boys)
                </option>
                <option value="AMU ABK High School (Girls)">
                  AMU ABK High School (Girls)
                </option>
                <option value="AMU Girls School">AMU Girls School</option>
                <option value="City Girls High School (Qazi Para)">
                  City Girls High School (Qazi Para)
                </option>
                <option value="Tahaffuzi-wa-Samaji-Tib">
                  Department of Tahaffuzi-wa-Samaji-Tib
                </option>
                <option value="Tashreeh wa Munafeul Aza">
                  Department of Tashreeh wa Munafeul Aza
                </option>
                <option value="Tashreehul Badan">
                  Department of Tashreehul Badan
                </option>
                <option value="TB and Chest Diseases">
                  Department of TB and Chest Diseases
                </option>
                <option value="UGC HRDC (Formerly known as Academic Staff College)">
                  UGC HRDC (Formerly known as Academic Staff College)
                </option>
                <option value="Urdu">Department of Urdu</option>
                <option value="West Asian Studies and North African Studies">
                  Department of West Asian Studies and North African Studies
                </option>
                <option value="Wildlife Sciences">
                  Department of Wildlife Sciences
                </option>
                <option value="Women's College">Women's College</option>
                <option value="Zakir Husain College of Engineering and Technology">
                  Zakir Husain College of Engineering and Technology
                </option>
                <option value="Zoology">Department of Zoology</option>

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
