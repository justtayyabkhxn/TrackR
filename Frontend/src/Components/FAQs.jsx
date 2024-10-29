import React from "react";
import Navbar from "../Components/Navbar";
import "../css/faqs.css";
import image from "../img/faq.jpg";
import developer from "../img/developer.jpg";
import list_item from "../img/list-item.jpg";
import list_item2 from "../img/list-item2.jpg";
import notification from "../img/notification.jpg";
import github from "../img/github.svg";
import mail from "../img/mail.svg";
import { Container, Row, Button, Form } from "react-bootstrap";
import { Link } from "react-router-dom";

export default function FAQs() {
  return (
    <>
    <div style={{marginTop:"120px"}}>
      <Navbar />

      <div
        className="faqs-container"
        style={{ textAlign: "center" }}
      >
          <div className="mainDiv">
            <div>
              <img src={image} alt="" srcset="" />
            </div>
          </div>

        <div
          className="faq-section"
          style={{ maxWidth: "90%", margin: "0 auto" }}
        >
          <details>
            <summary>
              <span className="heading">1. What is TrackIt?</span>
            </summary>
            <section>
              <p className="para">
                TrackIt is a web-based platform specifically designed to help
                users manage lost and found items in an organized and efficient
                way. Whether you’ve lost something or found an item, TrackIt
                provides a central place to report and search for lost
                belongings. The platform allows users to submit detailed
                descriptions of items, including images and locations, making it
                easier for others to identify and retrieve their lost property.
                TrackIt also ensures a smooth user experience by offering
                real-time notifications, anonymous submissions, and secure
                contact options, all aimed at simplifying the process of
                recovering lost items.
              </p>
            </section>
          </details>

          <details>
            <summary>
              <span className="heading">2. How do I report a lost item?</span>
            </summary>
            <section>
              <p className="para">
                Reporting a lost item on TrackIt is simple and user-friendly.
                First, you’ll need to sign up for an account. Once registered,
                navigate to the 'Lost Items' section, where you will find an
                easy-to-use form. This form allows you to enter important
                details about your lost item, such as its name, a brief
                description, the location where it was lost, and any relevant
                images. After submitting the form, your lost item listing will
                be posted publicly on the platform, making it available for
                others to see. TrackIt will notify you if someone finds or
                reports an item matching your description.
              </p>
            </section>
          </details>

          <details>
            <summary>
              <span className="heading">
                3. Can I report a found item anonymously?
              </span>
            </summary>
            <section>
              <p className="para">
                Yes, TrackIt offers an option for users to report found items
                anonymously. This feature is designed to encourage more people
                to report found items without feeling obligated to share
                personal information. When submitting a found item, you can
                choose whether to include your contact details or remain
                anonymous. Even in anonymous mode, users can still interact with
                you securely through the platform, allowing the rightful owner
                to claim their lost property without compromising your privacy.
              </p>
            </section>
          </details>

          <details>
            <summary>
              <span className="heading">
                4. Is there a way to contact the person who found my item?
              </span>
            </summary>
            <section>
              <p className="para">
                Yes, TrackIt provides a secure and private communication system
                for users to contact each other regarding lost and found items.
                If someone finds your item and reports it on TrackIt, their
                contact details will either be visible (if they chose not to
                remain anonymous), or you can send them a message through the
                in-app messaging feature. This messaging system ensures that
                communication happens securely within the platform, and both
                parties can choose how much information to share during the
                conversation. This feature is key to keeping users connected
                while maintaining privacy.
              </p>
            </section>
          </details>

          <details>
            <summary>
              <span className="heading">
                5. What kind of items can I report?
              </span>
            </summary>
            <section>
              <p className="para">
                TrackIt allows you to report a wide variety of lost and found
                items. From everyday items like keys, wallets, mobile phones,
                and clothing to more specific things like documents, IDs, or
                valuable electronics, TrackIt’s flexible system can accommodate
                almost anything. There is also an option to categorize your
                items, making it easier for others to filter and search for
                specific types of belongings. Whether your item is of high value
                or just a personal memento, TrackIt offers a platform to try and
                get it back to its owner.
              </p>
            </section>
          </details>

          <details>
            <summary>
              <span className="heading">6. Is TrackIt free to use?</span>
            </summary>
            <section>
              <p className="para">
                Yes, TrackIt is completely free for all users. Whether you are
                reporting a lost or found item or searching for one, you do not
                need to pay anything to access the platform’s core features. Our
                goal is to help communities and individuals easily reconnect
                with their lost items without introducing unnecessary costs or
                barriers. The platform may introduce premium features in the
                future, but all essential functionalities—such as posting
                listings, searching, and receiving notifications—are and will
                remain free to use.
              </p>
            </section>
          </details>

          <details>
            <summary>
              <span className="heading">
                7. How does the notification system work?
              </span>
            </summary>
            <section>
              <p className="para">
                TrackIt’s notification system is designed to keep you updated in
                real-time. After submitting a lost item report, you will
                automatically receive notifications if someone reports finding
                an item that matches your description. Likewise, if you report a
                found item, you’ll be notified if someone believes it matches
                what they’ve lost. Notifications are sent both via email and
                through the in-app messaging system, ensuring that you stay
                informed no matter where you are. This real-time notification
                system helps streamline the process of reconnecting lost items
                with their rightful owners.
              </p>
            </section>
          </details>

          <details>
            <summary>
              <span className="heading">
                8. How do I update or delete my listing?
              </span>
            </summary>
            <section>
              <p className="para">
                Managing your lost or found listings is easy. Simply log into
                your TrackIt account and navigate to the 'My Listings' section
                in your dashboard. From there, you can view all the items you’ve
                reported and choose to update or delete any listing. Updating
                allows you to add more details or change information if new
                facts come to light, while deleting a listing removes it from
                public view if the item has been recovered or is no longer
                relevant. The platform is designed to give users full control
                over their listings at any time.
              </p>
            </section>
          </details>

          <details>
            <summary>
              <span className="heading">
                9. Is my personal information safe on TrackIt?
              </span>
            </summary>
            <section>
              <p className="para">
                TrackIt places a strong emphasis on protecting users’ personal
                information. When you sign up and use TrackIt, your personal
                data is securely stored and is not shared with anyone unless you
                explicitly allow it. Additionally, we use encryption to protect
                sensitive information, and all communication through the
                platform is conducted securely. TrackIt complies with global
                privacy standards and regulations to ensure that your data
                remains private and that you have full control over how your
                information is shared with others.
              </p>
            </section>
          </details>

          <details>
            <summary>
              <span className="heading">
                10. How do I search for lost items?
              </span>
            </summary>
            <section>
              <p className="para">
                TrackIt offers a powerful and intuitive search feature that
                helps you locate lost items quickly. On the homepage, you’ll
                find a search bar where you can input keywords related to your
                lost item, such as item type, location, or description. You can
                also use filters to narrow down your search based on specific
                categories or timeframes. Once you submit your search query,
                TrackIt will display all matching listings, giving you the
                opportunity to contact the person who found your item if
                applicable.
              </p>
            </section>
          </details>

          <details>
            <summary>
              <span className="heading">
                11. Can I use TrackIt on my mobile device?
              </span>
            </summary>
            <section>
              <p className="para">
                Yes, TrackIt is fully responsive and optimized for mobile use.
                Whether you’re on a smartphone or tablet, you can easily access
                the platform, report items, or search for lost belongings while
                on the go. All of TrackIt’s features are available on mobile
                devices, ensuring a seamless experience regardless of the device
                you’re using. This allows users to quickly report or find items
                in real-time, wherever they are.
              </p>
            </section>
          </details>

          <details>
            <summary>
              <span className="heading">
                12. What should I do if I find a suspicious listing?
              </span>
            </summary>
            <section>
              <p className="para">
                If you encounter a listing on TrackIt that appears suspicious,
                fraudulent, or violates our community guidelines, you can report
                it directly to our support team. There is a “Report” button
                available on each listing, which will send the listing to our
                moderation team for review. We take reports seriously and aim to
                investigate all suspicious activity promptly. By keeping
                TrackIt’s listings safe and trustworthy, we ensure that the
                platform remains a reliable resource for lost and found items.
              </p>
            </section>
          </details>

          <details>
            <summary>
              <span className="heading">
                13. How long will my lost item listing stay active?
              </span>
            </summary>
            <section>
              <p className="para">
                By default, lost item listings on TrackIt stay active for 30
                days. After this period, you will receive a reminder to either
                renew or deactivate your listing if the item has not been found.
                If needed, you can extend the listing’s duration by updating it
                through your dashboard. TrackIt also allows you to manually
                deactivate listings once the item is recovered. This system
                ensures that only current and relevant listings remain visible
                on the platform, making it easier for users to find and
                reconnect with lost items.
              </p>
            </section>
          </details>

          <details>
            <summary>
              <span className="heading">
                14. Can businesses use TrackIt to report lost items?
              </span>
            </summary>
            <section>
              <p className="para">
                Yes, TrackIt is designed for use by both individuals and
                businesses. Businesses like cafes, gyms, hotels, and other
                establishments where lost items are common can create accounts
                to report items found on their premises. By using TrackIt,
                businesses can help reconnect customers with their lost
                belongings in a streamlined and organized manner. Businesses can
                post found items on behalf of their customers, and TrackIt’s
                notification system will ensure that those searching for items
                can easily connect with the business.
              </p>
            </section>
          </details>

          <details>
            <summary>
              <span className="heading">
                15. What happens if no one claims a found item?
              </span>
            </summary>
            <section>
              <p className="para">
                If an item you’ve reported as found on TrackIt goes unclaimed
                after a certain period, it’s up to you to decide how to handle
                it. You can choose to keep the item, donate it to charity, or
                follow local laws and regulations regarding found property.
                TrackIt does not impose any specific rules on what to do with
                unclaimed items, leaving that decision to the person who found
                it. However, we encourage users to follow ethical practices and
                make reasonable efforts to return the item to its rightful
                owner.
              </p>
            </section>
          </details>
        </div>
      </div>

      <div className="footer" style={{ textAlign: "center" }}>
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
          <h5>Track It By Tayyab Khan</h5>
        </div>
      </div>
      </div>
    </>
  );
}
