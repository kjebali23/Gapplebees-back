const mongoose = require('mongoose');

var MessagesSchema = new mongoose.Schema({
        content: String,
        from: String,
        to: String,

}, { timestamps: { createdAt: 'created_at' } } );
const Message = mongoose.model('message' , MessagesSchema  );
module.exports = Message;