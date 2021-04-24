const User = require('./Models/User');
const Post = require('./Models/Post');
const Notification = require('./Models/Notification');
const Verification = require('./Models/Verification');

const aws = require('aws-sdk')
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const fs = require('fs');

dotenv.config();

aws.config.update({
    accessKeyId: process.env.AWS_S3_fakegramfs_ACCESS_KEY,
    secretAccessKey: process.env.AWS_S3_fakegramfs_SECRET_ACCESS_KEY,
    region: process.env.AWS_S3_fakegramfs_REGION
});

const createUser = async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);

        const createdUser = new User({
            email: req.body.email,
            username: req.body.username,
            password: hashedPassword,
            bio: 'Tell people about yourself.',
            profilePicture: '',
            sex: req.body.sex,
            posts: [],
            followers: [],
            following: [],
            likedPosts: [],
            savedPosts: [],
            verifiedEmail: false
        });

        createdUser.save((err, user) => {
            if (err) {
                res.json(400);
            } else {
                const createdVerification = new Verification({
                    for: user._id
                });

                createdVerification.save((err, verification) => {
                   if (err) {
                       res.json(401);
                   } else {
                       const transporter = nodemailer.createTransport({
                           service: 'Hotmail',
                           auth: {
                               user: process.env.FAKEGRAM_EMAIL,
                               pass: process.env.FAKEGRAM_PASSWORD
                           }
                       });

                       const mailOptions = {
                           from: process.env.FAKEGRAM_EMAIL,
                           to: user.email,
                           subject: 'Verify your account',
                           text: `To verify your account click this link! \n
                            yourFrontend/${user._id}/${verification._id}`
                       }

                       transporter.sendMail(mailOptions, (err, _) => {
                           if(err) {
                               console.log(err);
                               res.json(400);
                           } else {
                               res.json(200);
                           }
                       });
                   }
                });
            }
        })
    } catch {
        await res.json(500);
    }
}

const verifyEmail = async (req, res) => {
    Verification.findById(req.params.verificationId)
        .lean().exec((err, verification) => {
            if(err) {
                res.json(404);
            } else {
                User.findByIdAndUpdate(verification.for, {
                    verifiedEmail: true
                }).lean().exec((err, _) => {
                   if(err) {
                       res.json(500);
                   } else {
                       res.json(200);
                   }
                });
            }
    })
}

const loginUser = async (req, res) => {
    const user = await User.findOne({ username: req.body.username }).lean().exec();

    if(user) {
        if(user.verifiedEmail) {
            if (await bcrypt.compare(req.body.password, user.password)) {
                const token = jwt.sign({
                    _id: user._id,
                    username: user.username
                }, process.env.TOKEN_SECRET);

                res.header("token", token).send(token);
            } else {
                res.json(401);
            }
        } else {
            res.json(403);
        }
    } else {
        res.json(401);
    }
};

const getUsers = async (req, res) => {
    const users = await User.find().exec();

    await res.json(users);
}

const getUserById = async (req, res) => {
    User.findById(req.params.id)
        .lean().exec((err, result) => {
        if (err)
            res.json(401);
        else
            res.json(result)
    })
}

const getUsernames = async (req, res) => {
    User.find({ username: { '$regex': req.params.username, '$options': 'i' } })
        .lean().exec((err, result) => {
        if (err)
            res.json(401);
        else {
            res.json(result.map(user => user.username));
        }
    });
}

const getUserByUsername = async (req, res) => {
    User.findOne({ username: req.params.username })
        .lean().exec((err, result) => {
        if (err)
            res.json(401);
        else {
            res.json(result);
        }
    });
}

const getLoggedInUser = async (req, res) => {
    User.findById(req.user._id)
        .lean().exec((err, result) => {
        if (err) {
            res.json(401);
        } else {
            res.json(result);
        }
    });
}

const getLoggedInUsersUsername = async (req, res) => {
    User.findById(req.user._id)
        .lean().exec((err, result) => {
        if (err) {
            res.json(401);
        } else {
            res.json(result.username);
        }
    });
}

const follow = async (req, res) => {
    User.findById(req.user._id).then(user => {
        if(!user.following.includes(req.params.username)) {
            User.findOneAndUpdate({ username: req.params.username }, {
                "$push": { "followers": req.user.username }
            }).then(() => User.findByIdAndUpdate(req.user._id , {
                "$push": { "following": req.params.username }
            }).lean().exec((err, _) => {
                if (err) {
                    res.json(401);
                } else {
                    const createdNotification = new Notification({
                        belongsTo: req.params.username,
                        who: req.user.username,
                        action: 'started following you',
                        what: null,
                        dateCreated: new Date()
                    });

                    Notification.find( { belongsTo: req.params.username }).then(notifications => {
                        notifications.map((notification) => {
                            if(notification.who === req.user.username && notification.action === 'started following you') {
                                Notification.deleteOne({ _id: notification._id }).lean().exec((err, _) => {
                                    if(err) {
                                        res.json(400);
                                    }

                                    User.findOne( { username: req.params.username} ).then(user => {
                                        user.notifications.pull(notification._id);

                                        user.save();
                                    });
                                });
                            }
                        });
                    });

                    createdNotification.save((err, result) => {
                       if(err) {
                           res.json(400);
                       } else {
                           User.findOne( { username: result.belongsTo } ).then(user => {
                               // If the notification limit is reached remove the first one, just like a queue
                               if (user.notifications.length >= 40) {
                                   user.notifications.pull(user.notifications[0]);

                                   user.save();

                                   Notification.deleteOne({ _id: user.notifications[0]}).lean().exec((err, _) => {
                                       if(err) {
                                           res.json(400);
                                       }
                                   });
                               }
                           });

                           User.findOneAndUpdate({ username: result.belongsTo }, {
                               "$push": { "notifications": result._id }
                           }).lean().exec((err, result) => {
                               if(err) {
                                   res.json(400);
                               } else {
                                   res.json(result);
                               }
                           });
                       }
                    });
                }
            }));
        } else {
            res.json(500);
        }
    });
}

const unfollow = async (req, res) => {
    User.findById(req.user._id).then(user => {
        if(user.following.includes(req.params.username)) {
            User.findOneAndUpdate({ username: req.params.username }, {
                "$pull": { "followers": req.user.username }
            }).then(() => User.findByIdAndUpdate(req.user._id , {
                "$pull": { "following": req.params.username }
            }).lean().exec((err, result) => {
                if (err) {
                    res.json(401);
                } else {
                    Notification.find( { belongsTo: req.params.username }).then(notifications => {
                        notifications.map(notification => {
                            if(notification.who === req.user.username && notification.action === 'started following you') {
                                Notification.deleteOne({ _id: notification._id }).lean().exec((err, _) => {
                                    if(err) {
                                        res.json(400);
                                    }

                                    User.findOne( { username: req.params.username} ).then(user => {
                                        user.notifications.pull(notification._id);

                                        user.save();
                                    });
                                });
                            }
                        })
                    });

                    res.json(result);
                }
            }));
        } else {
            res.json(500);
        }
    });
}

const updateProfile = async (req, res) => {
    User.findByIdAndUpdate(req.user._id, {
        bio: req.body.bio,
        sex: req.body.sex
    }, function (err, _) {
        if (err) {
            res.json(401);
        } else {
            res.json(200);
        }
    });
}

const AWSProfilePicture = async (req, res) => {
    const s3 = new aws.S3();

    const params = {
        ACL: 'public-read',
        Bucket: process.env.AWS_BUCKETNAME,
        Body: fs.createReadStream(req.file.path),
        Key: `ProfilePictures_${req.user.username}_${req.file.originalname}`
    };

    s3.upload(params, (err, data) => {
        if (err) {
            console.log(err);
            res.json(403);
        } else {
            User.findByIdAndUpdate(req.user._id, {
                profilePicture: data.Location
            }, function (err, _) {
                if (err) {
                    res.json(401);
                } else {
                    // Deletes the previous profile picture then sets the new one
                    res.json(data.key);
                }
            });
        }
    });
}

const deleteProfilePicture = async (req, res) => {
    const s3 = new aws.S3();

    User.findById(req.user._id)
        .lean().exec((err, user) => {
        if(err) {
            res.json(401);
        } else {
            const params = {
                Bucket: process.env.AWS_BUCKETNAME,
                // Body: fs.createReadStream(req.file.path),
                Key: user.profilePicture
            };

            s3.deleteObject(params, (err, _) => {
                if (err) {
                    console.log(err);
                    res.json(400);
                } else {
                    User.findByIdAndUpdate(user._id, {
                        profilePicture: null
                    }).lean().exec((err, _) => {
                        if (err) {
                            res.json(500);
                        } else {
                            res.json(200);
                        }
                    })
                }
            });
        }
    });
}

const getFeed = async (req, res) => {
    User.findById(req.user._id)
        .lean().exec((err, result) => {
        if(err) {
            res.json(401);
        } else {
            result.following.push(req.user.username);

            Post.paginate({ postedBy: { $in: result.following.map(user => user)} }, {
                offset: req.params.totalPosts,
                limit: 10,
                sort: { dateCreated: 'desc' }
            }, (err, result) => {
                if(err) {
                    res.json(401);
                } else {
                    res.json(result);
                }
            });
        }
    });
}

const getNotifications = async (req, res) => {
    Notification.find( { belongsTo: req.user.username })
        .lean().exec((err, result) => {
       if(err) {
           res.json(400);
       } else {
           res.json(result);
       }
    });
}

exports.createUser = createUser;
exports.verifyEmail = verifyEmail;
exports.loginUser = loginUser;
exports.getUsers = getUsers;
exports.getUserById = getUserById;
exports.getUsernames = getUsernames;
exports.getUserByUsername = getUserByUsername;
exports.getLoggedInUser = getLoggedInUser;
exports.getLoggedInUsersUsername = getLoggedInUsersUsername;
exports.follow = follow;
exports.unfollow = unfollow;
exports.updateProfile = updateProfile;
exports.AWSProfilePicture = AWSProfilePicture;
exports.deleteProfilePicture = deleteProfilePicture;
exports.getFeed = getFeed;
exports.getNotifications = getNotifications;
