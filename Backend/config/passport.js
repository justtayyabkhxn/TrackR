const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/signup');
const bcrypt = require('bcrypt'); // Ensure you use bcrypt for password hashing and comparison

module.exports = function(passport) {
    passport.use(new LocalStrategy(
        { usernameField: 'username' },
        async (username, password, done) => {
            try {
                const user = await User.findOne({ username });

                if (!user) {
                    return done(null, false, { message: 'Username not registered' });
                }

                // Compare the hashed password
                const isMatch = await bcrypt.compare(password, user.password);

                if (isMatch) {
                    console.log("Login successful!");
                    return done(null, user, { message: 'Logged in successfully!' });
                } else {
                    console.log('Invalid credentials!');
                    return done(null, false, { message: 'Password incorrect' });
                }
            } catch (err) {
                console.error(err);
                return done(err);
            }
        }
    ));

    passport.serializeUser((user, done) => {
        console.log('Serializing user');
        done(null, user.email); // Store user email in session
    });

    passport.deserializeUser(async (email, done) => {
        console.log('Deserializing user');

        try {
            const user = await User.findOne({ email }).lean().exec();
            done(null, user);
        } catch (err) {
            done(err);
        }
    });
};
