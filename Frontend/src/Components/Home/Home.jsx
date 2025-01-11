import React, { useState, useRef, useEffect } from "react";
import Navbar from "../Navbar";
import "../../css/landing.css";
import Axios from "axios";
import AOS from "aos";
import "aos/dist/aos.css";
import image from "../../img/lost-2.jpg";
import developer from "../../img/developer.jpg";
import list_item from "../../img/list-item.jpg";
import list_item2 from "../../img/list-item2.jpg";
import notification from "../../img/notification.jpg";
import github from "../../img/github.svg";
import mail from "../../img/mail.svg";
import { Container, Row, Button, Form } from "react-bootstrap";
import { Link } from "react-router-dom";

export default function Home() {
  const ref = useRef();
  const [title, setTitle] = useState("");
  const typingText = "TrackR";
  const [typingDirection, setTypingDirection] = useState(1);

  useEffect(() => {
    let index = 0;
    const typingInterval = setInterval(() => {
      setTitle(typingText.slice(0, index));
      index += typingDirection;
    }, 250); // Adjust typing speed here

    return () => clearInterval(typingInterval);
  }, [typingDirection]);

  useEffect(() => {
    AOS.init({
      offset: 100,
      delay: 0,
      duration: 600,
      once: true,
      mirror: false,
    });
  }, []);

  return (
    <>
      <div className="main">
        <Navbar />
        <div data-aos="fade-right" className="main">
          <div className="intro">
            <div className="part-1">
              <div className="title">
                <h1 id="title-h">{title}</h1>
                <p>Where lost items find their home.</p>
                <Button
                  variant="custom"
                  size="lg"
                  className="getStartedButton"
                  onClick={() => {
                    ref.current?.scrollIntoView({ behavior: "smooth" });
                  }}
                >
                  <span>DIVE IN</span>
                </Button>
              </div>
            </div>

            <div className="part-2">
              <div className="image">
                <img src={image} alt="" />
              </div>
            </div>
          </div>
        </div>

        <div data-aos="fade-right">
          <Container fluid className="total-inspiration">
            <div>
              <img className="developer-img" src={developer} alt="" />
            </div>
            <Row className="inspiration">
              <h6 className="section-heading">
                <span>WHAT IS THIS ?</span>
              </h6>
              <p>
                Colleges are often the place where we return home wondering if
                we've lost our new earphones, maybe left on a desk, unsure if
                they're still there. This is a situation many college students
                can relate to. Problems like these persist until someone comes
                up with a solution.
              </p>
              <Button
                variant="custom"
                size="lg"
                className="faqButton"
                onClick={() => {
                  ref.current.scrollIntoView({ behavior: "smooth" });
                }}
              >
                <span>Questions?</span>
              </Button>
            </Row>
          </Container>
        </div>

        <div data-aos="none">
          <Container fluid>
            <div className="total-about">
              <div ref={ref} className="about-heading">
                <h6 className="section-heading">
                  <span>HOW IT WORKS.</span>
                </h6>
              </div>
              <div className="about-card">
                <div className="info">
                  <img src={list_item} alt="" />
                  <div className="circletext">
                    <span>CREATE AN ACCOUNT</span>
                  </div>
                  <p>
                    Initially, you have to create an account to get started.
                  </p>
                  <Link to="/sign-up">
                    <Button variant="custom" size="lg" className="signupCircle">
                      Sign Up
                    </Button>
                  </Link>
                </div>
                <div className="info">
                  <img src={list_item2} alt="" />
                  <div className="circletext">
                    <span>List Item</span>
                  </div>
                  <p>
                    List your item on the wall by filling certain details and
                    image. That's it!
                    <Link to="/faqs">
                      <Button variant="custom" size="sm" className="faqCircle">
                        FAQs
                      </Button>
                    </Link>
                  </p>
                </div>
                <div className="info">
                  <img src={notification} alt="" />
                  <div className="circletext">
                    <span>PRIVACY INTEGRATED</span>
                  </div>
                  <p className="roundtext">
                    Your contact info is shared only with those who answer your
                    security question, ensuring your privacy.
                  </p>
                </div>
              </div>
            </div>
          </Container>
        </div>

        <div className="footer">
          <div className="social-icon">
            <a
              href="https://github.com/justtayyabkhxn/TrackR"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img src={github} className="icon github" alt="" />
            </a>
            <a
              href="mailto:tayyabkhangk4734@gmail.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img src={mail} className="icon" alt="" />
            </a>
          </div>
          <div className="personal-info" >
            <h5 style={{textDecoration:"none"}}> TRACKR BY &nbsp;
            <a
              href="https://justtayyabkhan.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              
            >
             TAYYAB KHAN
            </a>
            </h5>
             
          </div>
        </div>
      </div>
    </>
  );
}
