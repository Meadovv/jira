const jwt = require('jsonwebtoken');

const verifyToken = (req, _, next) => {
    const token = req.headers.authorization;
    jwt.verify(token, process.env.JWT_SECRET, (err, data) => {
        if (err) {
            req.auth = {
                role: 'unauthorized',
                verified: false
            };
        } else {
            req.auth = {
                role: data.role,
                username: data.username,
                id: data._id,
                verified: true
            };
        }
        next();
    });
}

module.exports = {
    verifyToken
}