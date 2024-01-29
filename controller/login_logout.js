const usermodel = require("../models/user");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('../middleware/passportAuth');
const { chatSchema, userSchema } = require("../middleware/zod");



// render ragister form
const userRegisterLoad = (req, res) => {
    res.render('user/userRegister');
}

// register user in database
const userRegister = async (req, res) => {
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
}

// render login form to user                                            
const userLoginLoad = (req, res) => {
    res.render('user/userLogin');
}

// login user and create jwt token
const userLogin = async (req, res) => {
    try {
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
            id: user._id,
            username: user.username,
        };
        const token = jwt.sign(tokenPayload, 'thisismysecret', { expiresIn: '1d' });
        res.clearCookie('jwt');
        res.cookie('jwt', token, { httpOnly: true, maxAge: 1000 * 60 * 60 * 24 });
        res.redirect('/community');
    } catch (error) {
        res.status(500).send('Login failed');
    }
}

// logout user and clear jwt token
const logout = (req, res) => {
    res.clearCookie('jwt');
    res.redirect('/userLogin');
}




module.exports = {
    userRegisterLoad,
    userRegister,
    userLoginLoad,
    userLogin,
    logout
}