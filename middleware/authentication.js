const passport = require('passport');
require('../middleware/passportAuth');



// coustom Middleware to check authentication using Passport user is log-in or not
const checkAuth = (req, res, next) => {
    passport.authenticate('jwt', { session: false }, (err, user, info) => {
        if (err || !user) {
            console.log('Error during authentication:', info.message);
            return res.redirect('/userLogin');
        }
        req.user = user;
        next();
    })(req, res, next);
};

module.exports = checkAuth;
