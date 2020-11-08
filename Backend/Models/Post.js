const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const postSchema = mongoose.Schema({
    postedBy: {type: String, ref: 'User'},
    image: String,
    description: String,
    dateCreated: Date,
    likedBy: [{type: String, ref: 'User'}],
    comments: [{type: String, ref: 'Comment'}],
    savedBy: [{type: String, ref: 'User'}],
});

postSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Post', postSchema);
