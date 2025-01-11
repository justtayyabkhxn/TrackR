const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const ms = require('ms');
const nodemailer = require("nodemailer");
const { z } = require("zod");
const { promisify } = require('util');
const { requireSignin } = require('../middleware');
const Signup = require('../models/signup');
require('dotenv').config({ path: "../../.env" });
const randomstring = require('randomstring');
const router = express.Router();

var generatedOTP = 0;
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES = process.env.JWT_EXPIRES;
const NODE_ENV = process.env.NODE_ENV;
const admin = process.env.ADMIN;
const signJwt = (id) => {
    return jwt.sign({ id }, JWT_SECRET, {
        expiresIn: JWT_EXPIRES,
    });
};

// Zod schema for validating signup form fields
const signupSchema = z.object({
    firstname: z.string().min(1, { message: "Firstname is required" }),
    lastname: z.string().min(1, { message: "Lastname is required" }),
    email: z.string().email({ message: "Invalid email address" }),
    number: z.string().length(10, { message: "Phone number must be 10 digits" }),
    password: z.string().min(8, { message: "Password must be at least 8 characters" }),
    cpassword: z.string().min(8, { message: "Confirm password must be at least 8 characters" })
}).refine((data) => data.password === data.cpassword, {
    message: "Passwords do not match",
    path: ["cpassword"]
});

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

// Middleware to validate signup data
const validateSignup = (req, res, next) => {
    try {
        signupSchema.parse(req.body);
        next();
    } catch (err) {
        const message = err.errors[0].message;
        res.status(200).json({ message });
    }
};
// Define Zod schema for password validation
const changePasswordSchema = z.object({
    password: z.string().min(8, { message: 'Password must be at least 8 characters long' }),
    cpassword: z.string().min(8, { message: 'Confirm Password must be at least 8 characters long' })
}).refine((data) => data.password === data.cpassword, {
    message: "Passwords do not match",
    path: ["cpassword"], // Error will be associated with cpassword
});

const checkFieldChangePassword = (req, res, next) => {
    const validationResult = changePasswordSchema.safeParse(req.body);

    if (!validationResult.success) {
        // Extract error messages and return them in response
        const errors = validationResult.error.errors.map(error => error.message);
        return res.status(200).json({ message: errors.join(', ') });
    }

    next();
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
        return res.status(200).json({
            status: 'unauthorized',
            message: 'Invalid token',
        });
    }
};

const checkField = (req, res, next) => {
    const { firstname, email, password, cpassword } = req.body;
    if (!firstname || !email || !password || !cpassword) {
        return res.status(200).json({ message: 'Please enter all the fields' });
    }
    next();
};


const checkAdminFieldLogin = (req, res, next) => {
    const { password } = req.body;
    if (!password) {
        return res.status(200).json({ message: 'Please enter all the fields' });
    }
    next();
};

const checkUsername = async (req, res, next) => {
    const { email } = req.body;
    try {
        const existingUser = await Signup.findOne({ email });
        if (existingUser) {
            return res.status(200).json({ message: "User email already exists" });
        }
        next();
    } catch (err) {
        return res.status(500).json({ message: 'Server error' });
    }
};

const checkPassword = (req, res, next) => {
    const { password, cpassword } = req.body;
    if (password !== cpassword) {
        return res.status(200).json({ message: 'Passwords do not match' });
    }
    next();
};


const verifyOTP = (userOTP, OTP) => {
    return (userOTP == OTP)
};

const generateOTP = () => {
    const OTP = randomstring.generate({ length: 6, charset: 'numeric' })
    generatedOTP = OTP;
    return OTP;
}

const sendOTPEmail = async (recipientEmail, OTP) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        secure: true,
        port: 465,
        auth: {
            user: process.env.EMAIL_USER, // Your Gmail
            pass: process.env.EMAIL_PASS, // Your Gmail password or App password
        },
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: recipientEmail,
        subject: 'Your OTP Code',
        text:
            `Hey User,
        We are happy to see you signing up.
        Your OTP is: ${OTP}`,
    };

    await transporter.sendMail(mailOptions);
};

const verifyUser = async (req, res, next) => {
    try {
        const { email } = req.body; // Assuming the email is sent in the request body

        // Check if email is provided
        if (!email) {
            return res.status(200).json({ message: 'Email is required' });
        }

        // Find the user in the Signup collection by email
        const user = await Signup.findOne({ email });

        // If the user is not found
        if (!user) {
            return res.status(200).json({ message: 'User not found' });
        }

        // Check if the user is verified
        if (user.verified) {
            // If verified, move to the next middleware or route handler
            return next();
        } else {
            // If not verified, redirect to the verification page
            return res.status(200).json({ message: 'User not verified ! ', status: false });  // Adjust the path to your verification page as needed
        }
    } catch (error) {
        console.error(error);
        // Handle any errors
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

// Login schema and validation middleware
const loginSchema = z.object({
    email: z.string().email({ message: "Invalid email address" }),
});

const validateLogin = (req, res, next) => {
    try {
        loginSchema.parse(req.body);
        next();
    } catch (err) {
        const message = err.errors[0].message;
        res.status(200).json({ message });
    }
};

router.get('/', (req, res) => res.send('This is Home page!!'));

router.post('/signup', checkField, validateSignup, checkUsername, checkPassword, async (req, res) => {
    const { firstname, lastname, email, number, password, verified } = req.body;
    // console.log("Hello: ", req.body);
    try {
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        console.log("Hello: ", req.body);
        const newSignup = await Signup.create({ firstname, lastname, email, number, password: hashedPassword, verified });
        sendToken(newSignup, 201, res);
        console.log(newSignup)
    } catch (err) {
        res.status(401).json({ message: err.message });
    }
});

router.get('/sendOTP', async (req, res) => {
    try {
        const { email } = req.query;
        if (email) {
            console.log("Email recieved: ", email)
            const OTP = generateOTP();  // Assuming sendOTP function returns OTP
            await sendOTPEmail(email, OTP);
            console.log("Generated OTP: ", OTP);
            res.status(200).json({
                message: "OTP sent successfully",
                success: true,
            });
        }
        else if (!email) {
            console.log("No email recieved")
            res.status(200).json({
                success: false,
                message: "Email not recieved"

            })
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "An error occurred" });
    }
});

router.get('/resetPassword', async (req, res) => {
    try {
        const { email } = req.query;

        if (!email) {
            console.log("No email received");
            return res.status(200).json({
                success: false,
                message: "Email not received"
            });
        }

        // Check if the email exists in the Signup collection
        const user = await Signup.findOne({ email });
        if (!user) {
            console.log("Email does not exist in the database");
            return res.status(200).json({
                success: false,
                message: "Email does not exist"
            });
        }

        console.log("Email received: ", email);
        const OTP = generateOTP();  // Assuming sendOTP function returns OTP
        await sendOTPEmail(email, OTP);
        console.log("Generated OTP: ", OTP);

        res.status(200).json({
            message: "OTP sent successfully",
            success: true
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "An error occurred" });
    }
});

router.post('/changePassword', checkFieldChangePassword, async (req, res) => {
    try {
        const { email, password, cpassword } = req.body; // Assuming payload has 'email' and 'newPassword'
        console.log(email, password, cpassword)

        const user = await Signup.findOne({ email });
        if (!user) {
            console.log("Email does not exist in the database");
            return res.status(200).json({
                success: false,
                message: "Email does not exist"
            });
        }
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        // Update the user's password in the database
        const updatedUser = await Signup.findOneAndUpdate(
            { email },                   // Find the user by email
            { password: hashedPassword }, // Update password
            { new: true }                 // Return the updated document
        );

        if (updatedUser) {
            return res.status(200).json({
                success: true,
                message: "Password changed successfully"
            });
        } else {
            return res.status(200).json({
                success: false,
                message: "Error updating password"
            });
        }
    } catch (error) {
        console.error("Error changing password:", error);
        return res.status(500).json({
            success: false,
            message: "An error occurred while changing the password"
        });
    }
});

router.get('/verifyOTP', async (req, res) => {
    try {
        const { email, userOTP } = req.query;
        if (!email) {
            return res.status(200).json({ message: "Email is required" });
        }
        const isVerified = verifyOTP(userOTP, generatedOTP);
        if (isVerified) {
            const result = await Signup.updateOne({ email: email }, { $set: { verified: true } });

            if (result.modifiedCount === 0) {
                return res.status(200).json({ message: "User not found or already verified" });
            }
            return res.status(200).json({
                message: "OTP verified successfully, account updated",
                verified: true
            });
        } else {
            return res.status(200).json({
                message: "Invalid OTP",
                verified: false
            });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "An error occurred" });
    }
});


router.post('/adminLogin', checkAdminFieldLogin, async (req, res) => {
    const { email, password } = req.body;
    try {
        console.log(email);
        const user = await Signup.findOne({ email });
        if (!user) {
            return res.status(200).json({ message: 'Email does not exist' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        // Check if the password matches
        if (isMatch) { // Use bcryptjs for password comparison in production

            // Check if the user is verified only after password is correct
            if (!user.verified) {
                return res.status(200).json({ message: 'User not verified', status: false });
            }

            const jwtToken = signJwt(user._id);
            res.cookie('jwt', jwtToken, { expiresIn: '1hr' });
            res.status(200).json({ jwtToken, user });
        } else {
            res.status(200).json({ message: 'Password incorrect' });
        }
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
    console.log("New Login: ", { email, password });
});


router.post('/login', validateLogin, async (req, res) => {
    const { email, password } = req.body;
    if (email === admin) {
        return res.status(200).json({ message: "Please visit admin page" });
    }
    try {
        const user = await Signup.findOne({ email });
        if (!user) return res.status(200).json({ message: 'Email does not exist' });
        const isMatch = await bcrypt.compare(password, user.password);
        if (isMatch) {
            if (!user.verified) return res.status(200).json({ message: 'User not verified', status: false });
            const jwtToken = signJwt(user._id);
            res.cookie('jwt', jwtToken, { expiresIn: '1hr' });
            res.status(200).json({ jwtToken, user });
        } else {
            res.status(200).json({ message: 'Password incorrect' });
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

module.exports = router;
