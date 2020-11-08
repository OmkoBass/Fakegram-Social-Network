const mongoose = require('mongoose');

const notificationSchema = mongoose.Schema({
    // Who's notification
    belongsTo: {type: String, ref: 'User'},
    // Someone
    who: {type: String, ref: 'User'},
    // What did they do
    action: String,
    // Which post
    what: {type: mongoose.Types.ObjectId, ref: 'Post'},
    // When it was created
    dateCreated: Date,
});

module.exports = mongoose.model('Notification', notificationSchema);
