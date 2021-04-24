const express = require('express');

const mongoose = require('mongoose');
const UserEndPoints = require('./UserEndPoints');
const PostEndPoints = require('./PostEndPoints');
const MessageEndPoints = require('./MessageEndPoints');

const bodyParser = require('body-parser');
const multer = require('multer');
const cors = require('cors');
const moment = require('moment');

// const fs = require('fs');

const verifyToken = require('./verifyToken');

// If you want to store it locally then 
// Uncomment this code and the files will be written
// In your filesystem
const postStorage = multer.diskStorage({
    // destination: (req, file, cb) => {
    //     if(req.route.path === '/user-update-profile-picture') {
    //         if(fs.existsSync('./posts/profilePictures')) {
    //             cb(null, `./posts/profilePictures`);
    //         } else {
    //             fs.mkdir('./posts/profilePictures', { recursive: true}, (err) => {
    //                 cb(null, `./posts/profilePictures`);
    //             });
    //         }
    //     }
    //     else if (req.route.path === '/create-post') {
    //         if(fs.existsSync(`./posts/${req.user.username}`)) {
    //             cb(null, `./posts/${req.user.username}`);
    //         } else {
    //             fs.mkdir(`./posts/${req.user.username}`, { recursive: true }, (err) => {
    //                 cb(null, `./posts/${req.user.username}`);
    //             });
    //         }
    //     }
    // },
    filename: (req, file, cb) => {
        if(req.route.path === '/user-update-profile-picture') {
            cb(null, `${req.user.username}`);
        } else if (req.route.path === '/create-post') {
            cb(null, `${file.originalname}-${moment().format('DD.MM.YYYY HH:mm')}`);
        }
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png'
        || file.mimetype === 'image/jpg'
    ) {
        cb(null, true);
    } else {
        cb(null, false);
    }
}

const upload = multer({
    storage: postStorage,
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter,
});

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// This means that my posts dir is visible and can be accessed
app.use('/posts', express.static('posts'));

mongoose.connect(`mongodb+srv://FakegramChad:${process.env.FAKEGRAM_CLUSTER_PASSWORD}@fakegram-cluster.qpt2g.mongodb.net/fakegram?retryWrites=true&w=majority`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
    .then(() => {
        console.log('CONNECTED!');
    }).catch(() => {
    console.log('CONNECTION FAILED!');
});

//GET REQUESTS
app.get('/profile/username', verifyToken, UserEndPoints.getLoggedInUsersUsername);
app.get('/users', UserEndPoints.getUsers);
app.post('/login/user', UserEndPoints.loginUser);
app.get('/users/:id', verifyToken, UserEndPoints.getUserById);
app.get('/users/search/:username', UserEndPoints.getUsernames);
app.get('/users/username/:username', UserEndPoints.getUserByUsername);
app.get('/posts/:username', PostEndPoints.getPostsForUser);
app.get('/profile', verifyToken, UserEndPoints.getLoggedInUser);
app.get('/profile/posts', verifyToken, PostEndPoints.getLoggedInUsersPosts);
app.get('/profile/:postId/likedBy',verifyToken, PostEndPoints.getLikesForPost);
app.get('/profile/:postId/commentedBy',verifyToken, PostEndPoints.getCommentsForPosts);
app.get('/feed/:totalPosts', verifyToken, UserEndPoints.getFeed);
app.get('/user/delete/profilePicture', verifyToken, UserEndPoints.deleteProfilePicture);
app.get('/user/notifications', verifyToken, UserEndPoints.getNotifications);
app.get('/post/:id', verifyToken, PostEndPoints.getPostById);
app.get('/messages/:username', verifyToken, MessageEndPoints.getMessages);
app.get('/verify/:userId/:verificationId', UserEndPoints.verifyEmail);

//POST REQUESTS
app.post('/post-comment', verifyToken, PostEndPoints.comment);
app.post('/user-create', UserEndPoints.createUser);
app.post('/create-post', [verifyToken, upload.single('image')], PostEndPoints.AWSCreatePost);
app.post('/messages/:username', verifyToken, MessageEndPoints.sendMessage);

//PUT REQUESTS
app.put('/user-update', verifyToken, UserEndPoints.updateProfile);
app.put('/user-update-profile-picture', [verifyToken, upload.single('profilePicture')], UserEndPoints.AWSProfilePicture);
app.put('/follow/:username', verifyToken, UserEndPoints.follow);
app.put('/unfollow/:username', verifyToken, UserEndPoints.unfollow);

app.put('/post/delete/:id', verifyToken, PostEndPoints.deletePost);
app.put('/post/like/:id', verifyToken, PostEndPoints.likePost);
app.put('/post/unlike/:id', verifyToken, PostEndPoints.unlikePost);
app.put('/post/comment/delete/:id', verifyToken, PostEndPoints.deleteComment);

const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log(`Listening at Port:${port}`);
});
