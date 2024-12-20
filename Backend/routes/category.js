const express = require("express");
const multer = require("multer");
const shortid = require("shortid");
const path = require("path");
const nodemailer = require("nodemailer");

const SignUp = require("../models/signup");
const { PostItem } = require("../models/category");
const messageschema = require("../models/messages");
const { requireSignin, userMiddleware } = require("../middleware");

require("dotenv").config({ path: '../../.env' });

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads");
  },
  filename: (req, file, cb) => {
    cb(null, `${shortid.generate()}-${file.originalname}-${Date.now()}`);
  },
});

const sendEmail = async (recipientEmail, message, subject) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER, // Your Gmail email
      pass: process.env.EMAIL_PASS, // Your Gmail password or App password
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: recipientEmail,
    subject: subject,
    text: message,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully!");
  } catch (error) {
    console.log("Error sending email:", error);
  }
};


const upload = multer({ storage });

// POST /postitem
router.post("/postitem", requireSignin, userMiddleware, upload.array("itemPictures"), async (req, res) => {
  try {
    const { name, description, question, type, location } = req.body;
    let itemPictures = [];
    if (req.files.length > 0) {
      itemPictures = req.files.map((file) => ({ img: file.filename }));
    }
    // console.log(req.user);
    const newPost = await PostItem.create({
      name,
      description,
      question,
      type,
      createdBy: req.user.id,
      itemPictures,
      location,
    });
    console.log("New post: ", newPost);

    res.status(201).json({ item: newPost });
  } catch (err) {
    res.status(401).json({ message: err.message });
  }
});

// GET /getitem
router.get("/getitem", async (req, res) => {
  try {
    const postitems = await PostItem.find({});
    if (postitems)
      res.status(200).json({ postitems });
    // console.log("Here");
  } catch (err) {
    // console.log("Here in the error")
    res.status(400).json({ err });
  }
});

// GET /item/:id
router.get("/item/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const item = await PostItem.findById(id);
    if (!item) return res.status(404).json({ message: "Item not found" });

    const answers = await messageschema.find({ itemId: id });
    res.status(200).json({ Item: item, Answers: answers });
  } catch (err) {
    res.status(400).json({ Error: err });
  }
});

// GET /:user_id/:item_id Check if User has answered
router.get("/responseData/:user_id/:item_id", async (req, res) => {
  try {
    const user_id = req.params.user_id;
    const item_id = req.params.item_id;
    // Find all answers where itemId matches and the givenBy field matches the user_id
    const answers = await messageschema.find({ itemId: item_id, givenBy: user_id });
    // Check if there are any answers
    if (answers.length === 0) {
      return res.status(200).json({ answered: false });
    }
    // Check if the answers contain empty or non-empty responses
    const answered = answers.some(answer => answer.answer !== "");
    res.status(200).json({ answered });
  } catch (err) {
    res.status(400).json({ Error: err.message });
  }
});


// GET /isSaved
router.get("/isSaved/:user_id/:item_id", async (req, res) => {
  try {
    const user_id = req.params.user_id;
    const item_id = req.params.item_id;

    // Find the user by user_id in the Signup schema
    const user = await SignUp.findById(user_id);

    // Check if the user exists
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the item_id exists in the savedPosts array
    const isSaved = user.savedPosts.includes(item_id);

    // Return the result
    res.status(200).json({ saved: isSaved });
  } catch (err) {
    res.status(400).json({ Error: err.message });
  }
});

router.post("/savePost/:user_id/:item_id", async (req, res) => {
  try {
    const user_id = req.params.user_id;
    const item_id = req.params.item_id;

    // Find the user by user_id in the Signup schema
    const user = await SignUp.findById(user_id);

    // Check if the user exists
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the item_id already exists in the savedPosts array
    if (user.savedPosts.includes(item_id)) {
      return res.status(400).json({ message: "Item is already saved" });
    }

    // Add the item_id to the savedPosts array
    user.savedPosts.push(item_id);

    // Save the updated user document
    await user.save();

    res.status(200).json({ message: "Item saved successfully" });
  } catch (err) {
    res.status(400).json({ Error: err.message });
  }
});

//      /users

router.get('/users', async (req, res) => {
  try {
    const users = await SignUp.find({}); // Fetch only the required fields
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Server error, could not retrieve users' });
  }
});
// POST /edititem
router.post("/edititem", upload.array("itemPictures"), async (req, res) => {
  try {
    const { id, name, description, question, type, createdBy, olditemPictures } = req.body;

    let itemPictures = [];

    // Check if new files are provided
    if (req.files && req.files.length > 0) {
      itemPictures = req.files.map((file) => ({ img: file.filename }));
    }

    // Check if old pictures are provided
    const oldPicturesArray = olditemPictures
      ? Array.isArray(olditemPictures)
        ? olditemPictures.map(pic => ({ img: pic }))
        : [{ img: olditemPictures }] // Handling the case where only one old image is passed
      : [];

    // Combine old and new pictures, if any
    const finalPictures = oldPicturesArray.concat(itemPictures);

    const updateData = {
      name,
      description,
      type,
      question,
      createdBy,
      itemPictures: finalPictures,
    };

    // Update the item
    const updatedItem = await PostItem.findByIdAndUpdate(id, updateData, { new: true });

    res.status(200).json({ updateItem: updatedItem });
  } catch (err) {
    res.status(400).json({ Error: err.message });
  }
});

// POST /deleteitem
router.post("/deleteitem", async (req, res) => {
  try {
    const { item_id } = req.body;
    await PostItem.findByIdAndDelete(item_id);
    await messageschema.deleteMany({ itemId: item_id });

    res.status(200).json({ body: req.body });
  } catch (err) {
    res.status(400).json({ Error: err });
  }
});

// GET /getnumber/:id
router.get("/getnumber/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const user = await SignUp.findById(id);
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ Number: user.number });
  } catch (err) {
    res.status(400).json({ Error: err });
  }
});

// GET /getquestion/:id
router.get("/getquestion/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const item = await PostItem.findById(id);
    if (!item) return res.status(404).json({ message: "Item not found" });

    const user = await SignUp.findById(item.createdBy);
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ Question: user.number });
  } catch (err) {
    res.status(400).json({ Error: err });
  }
});

//getItemName
router.get("/getItemName/:id", async (req, res) => {
  try {
    const { id } = req.params;  // Get the item ID from the request parameters

    // Find the item in the PostItem schema using the item ID
    const item = await PostItem.findById(id);
    if (!item) return res.status(404).json({ message: "Item not found" });

    // Assuming the field for the post name is 'name'
    const postName = item.name;

    // Respond with the post name
    res.status(200).json({ postName });
  } catch (err) {
    // Send error if something goes wrong
    res.status(400).json({ Error: err.message });
  }
});

// POST /submitAnswer
router.post("/submitAnswer", async (req, res) => {
  try {
    const { itemId, question, answer, givenBy, belongsTo } = req.body;

    const newmessage = await messageschema.create({
      itemId,
      belongsTo,
      question,
      answer,
      givenBy,
    });

    res.status(201).json({ item: newmessage });
  } catch (err) {
    res.status(400).json({ Error: err });
  }
});

// GET /myresponses/:id
router.get("/myresponses/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const responses = await messageschema.find({ givenBy: id });
    res.status(200).json({ item: responses });
  } catch (err) {
    res.status(400).json({ Error: err });
  }
});

// POST /activateItem/:id
router.post("/activateItem/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Find the item by id and update its status to true (activate the item)
    const activatedItem = await PostItem.findByIdAndUpdate(
      id,
      { $set: { status: true } }, // Use the 'status' field for activation
      { new: true }
    );

    if (!activatedItem) return res.status(404).json({ message: "Item not found" });

    res.status(200).json({ msg: "Item activated successfully", item: activatedItem });
  } catch (err) {
    res.status(400).json({ msg: err.message });
  }
});

// POST /deactivateItem/:id
router.post("/deactivateItem/:id", async (req, res) => {
  try {
    const itemId = req.params.id;
    const updatedItem = await PostItem.findByIdAndUpdate(
      itemId,
      { status: false }, // Set status to false for deactivation
      { new: true }
    );

    if (!updatedItem) {
      return res.status(404).json({ error: "Item not found" });
    }

    return res.status(200).json({ message: "Item deactivated successfully", item: updatedItem });
  } catch (error) {
    console.error("Error deactivating item: ", error);
    return res.status(500).json({ error: "Failed to deactivate item" });
  }
});

// GET /mylistings/:id
router.get("/mylistings/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const listings = await PostItem.find({ createdBy: id });
    res.status(200).json({ item: listings });
  } catch (err) {
    res.status(400).json({ Error: err });
  }
});

// GET /mySaves/:id
router.get("/mySaves/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Find the user by their ID
    const user = await SignUp.findById(id);

    // Check if the user exists and has saved posts
    if (!user || !user.savedPosts || user.savedPosts.length === 0) {
      return res.status(200).json({ message: "No saved posts found." });
    }

    // Fetch details of each post in the savedPosts array from the PostItem schema
    const savedPostsData = await Promise.all(
      user.savedPosts.map(async (postId) => {
        // Find each post in the PostItem schema by ID
        const post = await PostItem.findById(postId);
        return post;
      })
    );

    // Filter out any null values (in case some post IDs are not found)
    const filteredPosts = savedPostsData.filter(post => post !== null);

    // Send the response with the detailed post data
    res.status(200).json({ items: filteredPosts });
  } catch (err) {
    res.status(400).json({ Error: err.message });
  }
});

//POST /unsavePost/:user_id/:item_id

router.post("/unsavePost/:user_id/:item_id", async (req, res) => {
  try {
    const { user_id, item_id } = req.params;

    // Find the user by user_id
    const user = await SignUp.findById(user_id);

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Check if the item is already saved
    if (!user.savedPosts.includes(item_id)) {
      return res.status(400).json({ message: "Post not saved." });
    }

    // Remove the item_id from the savedPosts array
    user.savedPosts = user.savedPosts.filter((postId) => postId.toString() !== item_id);

    // Save the updated user document
    await user.save();

    // Respond with success
    res.status(200).json({ message: "Post unsaved successfully." });
  } catch (err) {
    res.status(500).json({ message: "Error unsaving post.", error: err.message });
  }
});


// POST /confirmResponse/:id
router.post("/confirmResponse/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { response } = req.body;
    console.log(id, response);
    await messageschema.updateOne({ _id: id }, { $set: { response } });
    res.status(200).json({ msg: "Updated" });
  } catch (err) {
    res.status(400).json({ msg: err.message });
  }
});

//GET /search/:query
router.get("/searchItem/:query", async (req, res) => {
  try {
    const { query } = req.params;

    // Use a case-insensitive regex to search for items where 'name', 'description', or 'location' fields contain the query string
    const filteredPosts = await PostItem.find({
      $or: [
        { name: { $regex: query, $options: "i" } },
        { description: { $regex: query, $options: "i" } },
        { location: { $regex: query, $options: "i" } }
      ]
    });

    res.status(200).json({
      msg: "Items retrieved successfully",
      data: filteredPosts,
      query: query
    });
  } catch (err) {
    res.status(400).json({ msg: err.message });
  }
});


// POST /sendMail
router.post("/sendMail", async (req, res) => {
  try {
    const { subject, emailBody, userId } = req.body;
    console.log("Recieved: ", subject, emailBody, userId)
    if (!subject || !emailBody || !userId) {
      return res.status(200).json({ message: "Subject, email body, and userId are required." });
    }

    // Search for the user in the Signup schema by userId
    const user = await SignUp.findById(userId);
    console.log("User: ", user)
    if (!user) {
      return res.status(404).json({ message: "User not found for the given userId." });
    }

    const recievedEmail = user.email; // Get the email from the user object

    // Send email
    await sendEmail(recievedEmail, emailBody, subject);

    res.status(200).json({
      message: "Email sent successfully!",
    });

  } catch (err) {
    res.status(400).json({ Error: err.message });
  }
});

router.delete("/users/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    
    // Find and delete the user
    const deletedUser = await SignUp.findByIdAndDelete(userId);

    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Error deleting user" });
  }
});


router.get('/user/:userId', async (req, res) => {
  const { userId } = req.params;
  // console.log(userId);

  try {
    // Find all posts where createdBy matches userId
    const user = await SignUp.findById(userId);

    res.json({
      user:user
    });
  } catch (err) {
    console.error(err);
  }
});

router.get('/getUser/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    // Find all posts where createdBy matches userId
    const posts = await PostItem.find({ createdBy: userId });
    const user = await SignUp.findById(userId);
    if (posts.length === 0) {
      return res.status(404).json({ message: 'No posts found for this user.' });
    }

    res.json({
      items:posts,
      user:user
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching posts for this user.' });
  }
});

module.exports = router;
