const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const userSchema = mongoose.Schema({
    email: {
        type: String,
        unique: true,
        lowercase: true,
    },
    username: {
        type: String,
        unique: true,
        lowercase: true,
    },
    password: String,
    bio: String,
    profilePicture: String,
    sex: Boolean,
    posts: [{type: mongoose.Types.ObjectId, ref: 'Post'}],
    followers: [{type: String, ref: 'User'}],
    following: [{type: String, ref: 'User'}],
    likedPosts: [{type: mongoose.Types.ObjectId, ref: 'Post'}],
    notifications: [{type: mongoose.Types.ObjectId, ref: 'Notification'}],
    verifiedEmail: Boolean
});

userSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('User', userSchema);
