const express = require("express");
const router = express.Router();
const path = require("path");
const usermodel = require("../models/user");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('../middleware/passportAuth');
const passport = require("passport");







router.get('/', (req, res) => {
    let user
    // go to community route
    res.redirect('/community');

});


// login and User register routes
router.get('/userRegister', (req, res) => {
    res.render('user/userRegister');
});

router.post('/userRegister', async (req, res) => {
    try {
        const { username, email, Password } = req.body;
        if (!Password || typeof Password !== 'string') {
            return res.status(400).send('Invalid password');
        }
        const hashedPassword = await bcrypt.hash(Password, 10);
        const user = new usermodel({
            username,
            email,
            password: hashedPassword,
        });
        await user.save();
        res.redirect('/userLogin');
    } catch (error) {
        res.status(500).send('Internal Server Error');
    }
});

router.get('/userLogin', (req, res) => {
    res.render('user/userLogin');
});

router.post('/userLogin', async (req, res) => {
    const user = await usermodel.findOne({ username: req.body.username });

    if (!user) {
        return res.status(400).send('Cannot find user');
    }

    if (!(await bcrypt.compare(req.body.password, user.password))) {
        return res.status(400).json({
            message: 'Incorrect password',
        });
    }
    const tokenPayload = {
        _id: user._id,
        username: user.username,
        email: user.email,
    };
    const token = jwt.sign(tokenPayload, 'thisismysecret', { expiresIn: '1d' });

    res.cookie('jwt', token, { httpOnly: true, maxAge: 1000 * 60 * 60 * 24 });
    // res.redirect('/community');
    res.send('logged in');

});

router.get('/clear-cookies', (req, res) => {
    // Get the names of all cookies
    const cookieNames = Object.keys(req.cookies);

    // Clear each cookie by name
    cookieNames.forEach(cookieName => {
        res.clearCookie(cookieName);
    });

    res.send('All cookies cleared');
});


// Protect the /community route with JWT authentication
router.get('/community', passport.authenticate('jwt', { session: false }), (req, res) => {
    const user = 'Community';
    res.render('index', { user });
});
router.get('/new-chat', (req, res) => {
    const user = 'user'
    res.render('index', { user });
});

module.exports = router;