const mongoose = require('mongoose');

const commentSchema = mongoose.Schema({
    comment: String,
    commentedBy: {type: String, ref: 'User'},
    onPost: {type: String, ref: 'Post'},
    date: Date
});

module.exports = mongoose.model('Comment', commentSchema);
