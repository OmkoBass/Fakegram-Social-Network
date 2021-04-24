const User = require('./Models/User');
const Post = require('./Models/Post');
const Comment = require('./Models/Comment');
const Notification = require('./Models/Notification');

const aws = require('aws-sdk');
const fs = require('fs');
const moment = require('moment');

const getLoggedInUsersPosts = async (req, res) => {
    Post.find({ postedBy: req.user.username })
    .sort({ dateCreated: -1 })
    .lean().exec((err, result) => {
        if (err)
            res.json(401);
        else {
            res.json(result);
        }
    });
}

const AWSCreatePost = async (req, res) => {
    const s3 = new aws.S3();

    const params = {
        ACL: 'public-read',
        Bucket: process.env.AWS_BUCKETNAME,
        Body: fs.createReadStream(req.file.path),
        Key: `${req.user.username}_${req.file.originalname}_${moment().format('DD.MM.YYYY HH:mm')}`
    };

    s3.upload(params, (err, data) => {
        if (err) {
            console.log(err);
            res.json(403);
        } else {
            const createPost = new Post({
                postedBy: req.user.username,
                image: data.Location,
                description: req.body.description,
                dateCreated: new Date(),
                likes: 0,
                likedBy: [],
                comments: [],
                saves: 0,
                savedBy: [],
            });

            createPost.save((err, _) => {
                if (err)
                    res.json(404)
            });

             User.findByIdAndUpdate(req.user._id, {
                "$push": { "posts": createPost }
            }).lean().exec((err, _) => {
                if(err) {
                    res.json(400);
                } else {
                    res.json(createPost);
                }
            });
        }
    });
}

const getPostById = async (req, res) => {
    Post.findById(req.params.id)
        .lean()
        .exec((err, result) => {
            if(err) {
                res.json(400);
            } else {
                res.json(result);
            }
    });
}

const getPostsForUser = async (req, res) => {
    Post.find({ postedBy: req.params.username })
        .lean().exec((err, result) => {
        if (err)
            res.json(401);
        else {
            res.json(result);
        }
    });
}

const deletePost = async (req, res) => {
    const s3 = new aws.S3();

    Post.findById(req.params.id)
        .lean().exec((err, post) => {
            if(err) {
                res.json(404);
            } else {
                const params = {
                    Bucket: process.env.AWS_BUCKETNAME,
                    // Body: fs.createReadStream(req.file.path),
                    Key: post.image
                };

                s3.deleteObject(params, (err, _) => {
                    if (err) {
                        console.log(err);
                        res.json(400);
                    } else {
                        Post.deleteOne({ _id: req.params.id }, (err, _) => {
                            if(err) {
                                res.json(400);
                            } else {
                                User.findOneAndUpdate({ username: req.user.username }, {
                                    "$pull": { "posts" : req.params.id }
                                }).lean().exec((err, _) => {
                                    if(err) {
                                        res.json(400);
                                    } else {
                                        res.json(200);
                                    }
                                })
                            }
                        });
                    }
                });
            }
    });
}

const likePost = async (req, res) => {
    Post.findById(req.params.id).then(post => {
        if(post) {
            if(post.likedBy.includes(req.user.username)) {
                /*If it's already liked then just return 500*/
                res.json(500);
            } else {
                Post.findByIdAndUpdate(req.params.id, {
                    $inc: {'likes' : 1},
                    "$push": { likedBy: req.user.username }
                }).lean().exec((err, post) => {
                    if(err) {
                        res.json(500);
                    } else {
                        /*We add the post id to the users likedPosts array*/
                        User.findByIdAndUpdate(req.user._id, {
                            "$push": { likedPosts: req.params.id }
                        }).lean().exec((err, _) => {
                            if(err) {
                                res.json(500);
                            } else {
                                // If you like your own shit then there's no notification
                                if (post.postedBy === req.user.username) {
                                    res.json(200);
                                } else {
                                    const createdNotification = new Notification({
                                        belongsTo: post.postedBy,
                                        who: req.user.username,
                                        action: 'liked your post',
                                        what: post._id,
                                        dateCreated: new Date()
                                    });

                                    createdNotification.save((err, notification) => {
                                        if(err) {
                                            res.json(400);
                                        } else {
                                            User.findOne( { username: post.postedBy } ).then(user => {
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

                                            User.findOneAndUpdate({ username: post.postedBy }, {
                                                "$push": { "notifications": notification._id }
                                            }).lean().exec((err, _) => {
                                                if(err) {
                                                    res.json(400);
                                                } else {
                                                    res.json(200);
                                                }
                                            });
                                        }
                                    });
                                }
                            }
                        });
                    }
                });
            }
        }
    });
}

const unlikePost = async (req, res) => {
    Post.findById(req.params.id).then(post => {
        if(post) {
            if(post.likedBy.includes(req.user.username)) {
                Post.findByIdAndUpdate(req.params.id, {
                    $inc: {'likes' : -1},
                    "$pull": { likedBy: req.user.username }
                }).lean().exec((err, post) => {
                    if(err) {
                        res.json(500);
                    } else {
                        User.findByIdAndUpdate(req.user._id, {
                            "$pull": { likedPosts: req.params.id }
                        }).lean().exec((err, user) => {
                            if(err) {
                                res.json(500);
                            } else {
                                Notification.deleteOne( {
                                    belongsTo: post.postedBy,
                                    who: user.username,
                                    action: 'liked your post',
                                    what: post._id
                                }).lean().exec((err, _) => {
                                    if(err) {
                                        res.json(400);
                                    } else {
                                        res.json(200);
                                    }
                                })
                            }
                        });
                    }
                });
            } else {
                res.json(500);
            }
        }
    });
}

const getLikesForPost = async (req, res) => {
    Post.findById(req.params.postId)
        .lean().exec((err, result) => {
        if(err) {
            res.json(401);
        } else {
            res.json(result.likedBy);
        }
    });
}

const comment = async (req, res) => {
    const createComment = new Comment({
        comment: req.body.comment,
        commentedBy: req.user.username,
        onPost: req.body.postId,
        date: new Date()
    });

    createComment.save((err, comment) => {
        if(err) {
            res.json(500);
        } else {
            Post.findByIdAndUpdate(req.body.postId, {
                "$push": { comments: comment._id }
            }).lean().exec((err, post) => {
               if(err) {
                   res.json(401);
               } else {
                   if (req.user.username !== post.postedBy) {
                       const createdNotification = new Notification({
                           belongsTo: post.postedBy,
                           who: req.user.username,
                           action: 'commented on your post',
                           what: req.body.postId,
                           dateCreated: new Date()
                       });

                       Notification.find( { belongsTo: post.postedBy }).then(notifications => {
                           notifications.map((notification) => {
                               if(notification.who === req.user.username && notification.action === 'commented on your post') {
                                   Notification.deleteOne({ _id: notification._id }).lean().exec((err, _) => {
                                       if(err) {
                                           res.json(400);
                                       }

                                       User.findOne( { username: post.postedBy } ).then(user => {
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
                               User.findOne( { username: post.postedBy } ).then(user => {
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
                   } else {
                       res.json(200);
                   }
               }
            });
        }
    });
}

const getCommentsForPosts = async (req, res) => {
    Post.findById(req.params.postId)
        .lean().exec((err, result) => {
        if(err) {
            res.json(404);
        } else {
            Comment.find({
                '_id': {
                    $in: result.comments.length === 1 ? result.comments[0] : result.comments.map(comment => comment)
                }
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

const deleteComment = async (req, res) => {
    Comment.deleteOne({ _id: req.params.id })
        .lean().exec((err, deletedComment) => {
        if(err) {
            res.json(400);
        } else {
            Notification.deleteOne({ belongsTo: deletedComment.commentedBy })
                .lean().exec((err, result) => {
                    if (err) {
                        res.json(401);
                    } else {
                        res.json(200);
                    }
            });
        }
    });
}

exports.getLoggedInUsersPosts = getLoggedInUsersPosts;
exports.getPostById = getPostById;
exports.AWSCreatePost = AWSCreatePost;
exports.getPostsForUser = getPostsForUser;
exports.deletePost = deletePost;
exports.likePost = likePost;
exports.unlikePost = unlikePost;
exports.getLikesForPost = getLikesForPost;
exports.comment = comment;
exports.getCommentsForPosts = getCommentsForPosts;
exports.deleteComment = deleteComment;
