// passportAuth.js
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const passport = require('passport');
const User = require('../models/user');


//  we use the cookieExtractor function to extract the JWT from the cookie
const cookieExtractor = (req) => {
    let token = null;
    if (req && req.cookies) {
        token = req.cookies['jwt'];
    }
    return token;
};

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromExtractors([cookieExtractor]);
opts.secretOrKey = 'thisismysecret';




passport.use(new JwtStrategy(opts, async (jwt_payload, done) => {
    console.log('jwt_payload:', done);
    try {
        const user = await User.findOne({ username: jwt_payload.username.toLowerCase() });

        if (!user) {
            return done(null, false);
        }
        return done(null, user);
    } catch (error) {
        console.error('Error during user retrieval:', error);
        return done(error, false);
    }
}));

