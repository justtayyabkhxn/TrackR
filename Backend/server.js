const express = require('express');
const app = express();
require('dotenv').config({ path: './.env' });
const cors = require('cors');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const passport = require('passport');
const path = require('path');

// console.log(process.env.MONGO_DB_USER);

// Enable CORS for your frontend URL, allowing credentials
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));
// Serve static files
app.use(express.static(path.join(__dirname, 'uploads')));

// Middleware to handle cookies
app.use(cookieParser());

// Middleware to parse JSON data in request body
app.use(express.json());

// Initialize Passport (if needed for future authentication)
app.use(passport.initialize());

// MongoDB connection using environment variables
console.log(process.env.MONGO_DB_USER);
// mongoose.connect(
//   `mongodb+srv://${process.env.MONGO_DB_USER}:${process.env.MONGO_DB_PASSWORD}@cluster0.6kk18.mongodb.net/${process.env.MONGO_DB_DATABASE}?retryWrites=true&w=majority`,
//   {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   }
// );
mongoose.connect(
    `mongodb+srv://${process.env.MONGO_DB_USER}:${process.env.MONGO_DB_PASSWORD}@cluster0.w1qpdsc.mongodb.net/${process.env.MONGO_DB_DATABASE}?retryWrites=true&w=majority`
  )
  // Log when the database connects successfully
    .then(() => {
      console.log('Database connected!');
    })
    .catch((err) => {
      console.error('Database connection error:', err);
    });
  

// Import routes
const authRoutes = require('./routes/auth');
const categoryRoutes = require('./routes/category');

// Use routes
app.use('/', authRoutes);
app.use('/', categoryRoutes);

// Define the port, using an environment variable if available
const port = process.env.PORT || 5000;

// Start the server
app.listen(port, () => {
    console.log(`Listening on port ${port}!`);
});
