const jwt = require('jsonwebtoken');
module.exports = function (req, res, next) {
    //get token from header
    const token = req.header('x-auth-header');

    //check if token exist
    if (!token) {
        return res.status(401).json({ msg: 'no token, authorization denied' });
    }
    //verify token
    try {
        const decoded = jwt.verify(token, 'jwtPrivateKey');
        req.user = decoded.user;
        next();
    } catch (err) {
        res.status(401).send('Token is not valid');
    }
};
