const mongoose = require('mongoose');
const { Schema } = mongoose;

const CategorySchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true, // Ensures the 'name' field is unique
    },
    description: {
        type: String,
        required: false,
    },
    type: {
        type: String,
        required: true,
    },
    itemPictures: [{
        img: {
            type: String,
            required: false,
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
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'SignUpSchema',
        required: true,
    },
}, {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
});

// Remove unnecessary fields from schema definition
const PostItem = mongoose.model('PostItem', CategorySchema);

module.exports = PostItem;
