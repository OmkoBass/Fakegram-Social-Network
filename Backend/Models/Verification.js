const mongoose = require('mongoose');

const verificationSchema = mongoose.Schema({
    for: {type: mongoose.Types.ObjectId, ref: 'User'}
});

module.exports = mongoose.model('Verification', verificationSchema);
