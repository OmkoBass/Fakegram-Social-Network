const Message = require('./Models/Message');

const sendMessage = async (req, res) => {
    const createdMessage = new Message({
        sender: req.user.username,
        content: req.body.content,
        receiver: req.params.username,
        date: new Date()
    });

    if(createdMessage.sender === createdMessage.receiver) {
        res.json(401);
    }

    createdMessage.save((err, message) => {
        if (err) {
            res.json(401);
        } else {
            res.json(message);
        }
    });
}

const getMessages = async (req, res) => {
    Message.find({
        sender: {$in: [req.user.username, req.params.username]},
        receiver: {$in: [req.params.username, req.user.username]}
    }).sort({ date: 'asc' })
        .lean().exec((err, messages) => {
            if (err) {
                res.json(400);
            } else {
                res.json(messages);
            }
    });
}

exports.sendMessage = sendMessage;
exports.getMessages = getMessages;
