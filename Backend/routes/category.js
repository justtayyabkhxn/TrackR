const express = require("express");
const multer = require("multer");
const shortid = require("shortid");
const path = require("path");
const log = console.log;

const SignUp = require("../models/signup");
const { postitem } = require("../models/category");
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

const upload = multer({ storage });

// POST /postitem
router.post("/postitem", requireSignin, userMiddleware, upload.array("itemPictures"), async (req, res) => {
  try {
    const { name, description, question, type } = req.body;
    let itemPictures = [];
    if (req.files.length > 0) {
      itemPictures = req.files.map((file) => ({ img: file.filename }));
    }

    const newPost = await postitem.create({
      name,
      description,
      question,
      type,
      createdBy: req.user._id,
      itemPictures,
    });

    res.status(201).json({ item: newPost });
  } catch (err) {
    res.status(401).json({ message: err.message });
  }
});

// GET /getitem
router.get("/getitem", async (req, res) => {
  try {
    const postitems = await postitem.find({});
    res.status(200).json({ postitems });
  } catch (err) {
    res.status(400).json({ err });
  }
});

// GET /item/:id
router.get("/item/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const item = await postitem.findById(id);
    if (!item) return res.status(404).json({ message: "Item not found" });

    const answers = await messageschema.find({ itemId: id });
    res.status(200).json({ Item: item, Answers: answers });
  } catch (err) {
    res.status(400).json({ Error: err });
  }
});

// POST /edititem
router.post("/edititem", upload.array("itemPictures"), async (req, res) => {
  try {
    const { id, name, description, question, type, createdBy, olditemPictures } = req.body;
    let itemPictures = [];
    if (req.files.length > 0) {
      itemPictures = req.files.map((file) => ({ img: file.filename }));
    }

    const updateData = {
      name,
      description,
      type,
      question,
      createdBy,
      itemPictures: olditemPictures ? olditemPictures.map(pic => ({ img: pic })).concat(itemPictures) : itemPictures,
    };

    const updatedItem = await postitem.findByIdAndUpdate(id, updateData, { new: true });
    res.status(200).json({ updateItem: updatedItem });
  } catch (err) {
    res.status(400).json({ Error: err });
  }
});

// POST /deleteitem
router.post("/deleteitem", async (req, res) => {
  try {
    const { item_id } = req.body;
    await postitem.findByIdAndDelete(item_id);
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
    const item = await postitem.findById(id);
    if (!item) return res.status(404).json({ message: "Item not found" });

    const user = await SignUp.findById(item.createdBy);
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ Question: user.number });
  } catch (err) {
    res.status(400).json({ Error: err });
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

// GET /mylistings/:id
router.get("/mylistings/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const listings = await postitem.find({ createdBy: id });
    res.status(200).json({ item: listings });
  } catch (err) {
    res.status(400).json({ Error: err });
  }
});

// POST /confirmResponse/:id
router.post("/confirmResponse/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { response } = req.body;

    await messageschema.updateOne({ _id: id }, { $set: { response } });
    res.status(200).json({ msg: "Updated" });
  } catch (err) {
    res.status(400).json({ msg: err.message });
  }
});

module.exports = router;
