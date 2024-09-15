const mongoose = require('mongoose');
const { Schema } = mongoose;

const messageSchema = new Schema({
    itemId: {
        type: Schema.Types.ObjectId,
        ref: 'CategorySchema',
        required: true,
    },
    belongsTo: {
        type: Schema.Types.ObjectId,
        ref: 'SignUpSchema',
        required: true,
    },
    question: {
        type: String,
        required: true,
    },
    answer: {
        type: String,
        required: true,
    },
    response: {
        type: String,
        default: 'Moderation',
    },
    givenBy: {
        type: Schema.Types.ObjectId,
        ref: 'SignUpSchema',
        required: true,
    }
}, {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
});

const Message = mongoose.model('Message', messageSchema);
module.exports = Message;
