const express = require('express');
// const nodemailer = require('nodemailer');
// const mailgun = require('nodemailer-mailgun-transport');
const jwt = require('jsonwebtoken');
const ms = require('ms');
const { promisify } = require('util');
const { requireSignin } = require('../middleware');
const Signup = require('../models/signup');
require('dotenv').config({ path: "../.env" });

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES = process.env.JWT_EXPIRES;
const NODE_ENV = process.env.NODE_ENV;
const signJwt = (id) => {
    return jwt.sign({ id }, JWT_SECRET, {
        expiresIn: JWT_EXPIRES,
    });
};

const sendToken = (user, statusCode, res) => {
    // Sign the JWT
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES // Use the expiration time from the environment variable
    });

    // Calculate expiration time for cookie
    const expiresIn = ms(process.env.JWT_EXPIRES); // Convert expiration string to milliseconds

    res.cookie('jwt', token, {
        expires: new Date(Date.now() + expiresIn),
        secure: process.env.NODE_ENV === 'production',
        httpOnly: process.env.NODE_ENV === 'production',
    });

    res.status(statusCode).json({
        token,
    });
};

const signout = (req, res) => {
    res.clearCookie('jwt');
    res.status(200).json({
        message: 'Signed out successfully!',
    });
};

// Middleware
const decryptJwt = async (token) => {
    const jwtverify = promisify(jwt.verify);
    return await jwtverify(token, JWT_SECRET);
};

const secure = async (req, res, next) => {
    const token = req.cookies?.jwt;
    if (!token) {
        return res.status(401).json({
            status: 'unauthorized',
            message: 'You are not authorized to view the content',
        });
    }
    try {
        const jwtInfo = await decryptJwt(token);
        const user = await Signup.findById(jwtInfo.id);
        req.user = user;
        next();
    } catch (err) {
        return res.status(401).json({
            status: 'unauthorized',
            message: 'Invalid token',
        });
    }
};

const checkField = (req, res, next) => {
    const { firstname, email, password, cpassword } = req.body;
    if (!firstname || !email || !password || !cpassword) {
        return res.status(400).json({ message: 'Please enter all the fields' });
    }
    next();
};

const checkFieldLogin = (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: 'Please enter all the fields' });
    }
    next();
};

const checkUsername = async (req, res, next) => {
    const { email } = req.body;
    try {
        const existingUser = await Signup.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already exists' });
        }
        next();
    } catch (err) {
        return res.status(500).json({ message: 'Server error' });
    }
};

const checkPassword = (req, res, next) => {
    const { password, cpassword } = req.body;
    if (password !== cpassword) {
        return res.status(400).json({ message: 'Passwords do not match' });
    }
    next();
};

router.get('/', (req, res) => res.send('This is Home page!!'));

router.post('/signup', checkField, checkUsername, checkPassword, async (req, res) => {
    const { firstname, lastname, email, number, password } = req.body;
    try {
        const newSignup = await Signup.create({ firstname, lastname, email, number, password });
        sendToken(newSignup, 201, res);
        console.log(newSignup)
    } catch (err) {
        res.status(401).json({ message: err.message });
    }
});

router.post('/login', checkFieldLogin, async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await Signup.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Email does not exist' });
        }
        if (user.password === password) { // Use bcryptjs for password comparison in production
            const jwtToken = signJwt(user._id);
            res.cookie('jwt', jwtToken, { expiresIn: '1hr' });
            res.status(200).json({ jwtToken, user });
        } else {
            res.status(400).json({ message: 'Password incorrect' });
        }
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

router.post('/checktoken', requireSignin, (req, res) => {
    res.status(200).json({});
});

router.post('/signout', requireSignin, signout);

router.post('/feed', requireSignin, (req, res) => {
    res.status(200).json({ message: 'Working fine' });
});

// router.post('/sendmessage', (req, res) => {
//     const { name, email, message } = req.body;
//     const auth = {
//         auth: {
//             api_key: process.env.MAIL_GUN_API_KEY,
//             domain: process.env.MAIL_GUN_DOMAIN,
//         },
//     };

//     const transporter = nodemailer.createTransport(mailgun(auth));

//     const mailOption = {
//         from: email,
//         to: 'eswarupkumar1111@gmail.com',
//         subject: `Review from ${name}`,
//         text: message,
//     };

//     transporter.sendMail(mailOption, (err, data) => {
//         if (err) return res.status(500).json(err);
//         res.status(200).json(data);
//     });
// });

module.exports = router;
