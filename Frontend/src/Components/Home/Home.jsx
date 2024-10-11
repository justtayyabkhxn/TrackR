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
// import linkedin from "../img/linkedin.svg";
import mail from "../../img/mail.svg";
import { Container, Row, Button, Form } from "react-bootstrap";
import { Link } from "react-router-dom";

export default function Home() {
  const ref = useRef();

  useEffect(() => {
    AOS.init({
      // Global settings:
      disable: false, // accepts values: 'phone', 'tablet', 'mobile', boolean, expression or function
      startEvent: "DOMContentLoaded", // name of the event dispatched on the document, that AOS should initialize on
      initClassName: "aos-init", // class applied after initialization
      animatedClassName: "aos-animate", // class applied on animation
      useClassNames: false, // if true, will add content of `data-aos` as classes on scroll
      disableMutationObserver: false, // disables automatic mutations' detections (advanced)
      debounceDelay: 50, // delay on debounce used while resizing window (advanced)
      throttleDelay: 99, // delay on throttle used while scrolling the page (advanced)
      // Settings that can be overridden on per-element basis, by `data-aos-*` attributes:
      offset: 120, // offset (in px) from the original trigger point
      delay: 0, // values from 0 to 3000, with step 50ms
      duration: 700, // values from 0 to 3000, with step 50ms
      easing: "ease", // default easing for AOS animations
      once: false, // whether animation should happen only once - while scrolling down
      mirror: false, // whether elements should animate out while scrolling past them
      anchorPlacement: "top-bottom", // defines which position of the element regarding window should trigger the animation
    });
  }, []);
  return (
    <>
      <Navbar />
      <div data-aos="fade-right" className="main">
        <div className="intro">
          <div className="part-1">
            <div className="title">
              <h1 id="title-h">TRACK IT</h1>
              <p>Where lost items find their home.</p>
              <Button
                variant="custom"
                size="lg"
                className="getStartedButton"
                onClick={() => {
                  ref.current.scrollIntoView({ behavior: "smooth" });
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
              {" "}
              <span>WHAT IS THIS ?</span>
            </h6>
            <p>
              Colleges are often the place where we return home wondering if
              we've lost our new earphones, maybe left on a desk, unsure if
              they're still there. This is a situation many college students can
              relate to. Problems like these persist until someone comes up with
              a solution.
            </p>
          </Row>
        </Container>
      </div>

      <div data-aos="fade-left">
        <Container fluid>
          <div className="total-about">
            <div ref={ref} className="about-heading">
              <h6 className="section-heading">
                {" "}
                <span>HOW IT WORKS.</span>{" "}
              </h6>
            </div>
            <div className="about-card">
              <div className="info">
                <img src={list_item} alt="" />
                <h4>
                  <span>CREATE AN ACCOUNT</span>
                </h4>
                <p>Initially, you have to create an account to get started.</p>
                <Link to="/sign-up">
                  <Button
                    variant="custom"
                    size="lg"
                    className="signupCircle"
                  >
                    Sign Up
                  </Button>
                </Link>
              </div>
              <div className="info">
                <img
                  src={list_item2}
                  alt=""
                />
                <h4>
                  <span>List Item</span>
                </h4>
                <p>
                  List your item on the wall by filling certain details and
                  image. That's it!
                </p>
              </div>
              <div className="info">
                <img
                  src={notification}
                  alt=""
                />
                <h4>
                  <span>PRIVACY INTEGRATED</span>
                </h4>
                <p>
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
            href="https://github.com/justtayyabkhxn/Track-It"
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
        <div className="personal-info">
          <h5>
            Track It By Tayyab Khan
          </h5>
        </div>
      </div>
    </>
  );
}
