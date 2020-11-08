const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
    const token = req.header('token');

    if(!token)
        res.json(401);
    else {
        try {
            req.user = jwt.verify(token, process.env.TOKEN_SECRET);
            next();
        } catch {
            res.json(400);
        }
    }
}
