const mongoose = require('mongoose');

const { Schema } = mongoose;

const PostItemSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true, // Ensures the 'name' field is unique
  },
  description: {
    type: String,
    required: true, // Ensure description is always required, update based on your needs
  },
  type: {
    type: String,
    required: true,
    enum: ["Lost", "Found"], // Validates the type to be either "Lost" or "Found"
  },
  itemPictures: [{
    img: {
      type: String,
      required: true, // Ensure all items in the array have a valid image path
    }
  }],
  question: {
    type: String,
    required: true,
  },
  status: {
    type: Boolean,
    default: true,
  },
  location:{
    type: String,
    required: true,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SignUp', // Reference the actual model name, not the schema name
    required: true,
  },
}, {
  timestamps: true, // Automatically adds createdAt and updatedAt fields
});

// Create an index for performance on frequently queried fields
PostItemSchema.index({ createdBy: 1 });

const PostItem = mongoose.model('PostItem', PostItemSchema);

module.exports = {PostItem};
