const mongoose = require('mongoose');

const messageSchema = mongoose.Schema({
    sender: {type: String, ref: 'User'},
    content: { type: String, min: 1},
    receiver: {type: String, ref: 'User'},
    date: Date
});

module.exports = mongoose.model('Message', messageSchema);
