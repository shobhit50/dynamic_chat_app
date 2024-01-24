const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const passport = require('passport');
const User = require('../models/user');



const cookieExtractor = (req) => {
    let token = null;
    if (req && req.cookies) {
        token = req.cookies['token'];
    }
    return token;
};
const opts = {};
// opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.jwtFromRequest = cookieExtractor;
opts.secretOrKey = 'thisismysecret';




passport.use(new JwtStrategy(opts, async (jwt_payload, done) => {
    try {
        console.log('Decoded JWT Payload:', jwt_payload);
        const user = await User.findOne({ _id: jwt_payload._id });
        if (!user) {
            console.log('User not found');
            return done(null, false);
        }

        console.log('User found:', user.username);
        return done(null, user);
    } catch (error) {
        console.error('Error during user retrieval:', error);
        return done(error, false);
    }
}));

