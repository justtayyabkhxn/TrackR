const mongoose = require('mongoose');
const { Schema } = mongoose;

// Schema Definition
const signUpSchema = new Schema({
    firstname: {
        type: String,
        required: true,
    },
    lastname: {
        type: String,
    },
    email: {
        type: String,
        required: true,
        unique: true, // shorthand for index: { unique: true }
    },
    number: {
        type: Number,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now,
    }
}, {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
});

// Model Creation
const SignUp = mongoose.model('SignUp', signUpSchema);

module.exports = SignUp;
