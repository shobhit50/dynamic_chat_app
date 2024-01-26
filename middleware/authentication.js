const passport = require('passport');
require('../middleware/passportAuth');
const jwt = require('jsonwebtoken');



// coustom Middleware to check authentication using Passport user is log-in or not
const checkAuth = (req, res, next) => {
    passport.authenticate('jwt', { session: false }, (err, user, info) => {
        if (err || !user) {
            // console.log('Error during authentication:', info.message);
            return res.redirect('/userLogin');
        }
        req.user = user;
        next();
    })(req, res, next);
};



// this function is used to extract user data from jwt token
const userData = (socket) => {
    const token = socket.handshake.headers.cookie.split('=')[1];
    const user = jwt.decode(token);
    return user;
};

// module.exports = checkAuth ; 
module.exports = { userData, checkAuth };


