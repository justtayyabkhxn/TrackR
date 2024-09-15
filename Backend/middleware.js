const jwt = require('jsonwebtoken');
require('dotenv').config({ path: './.env' });

exports.requireSignin = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Authorization header missing or malformed" });
    }

    const token = authHeader.split(" ")[1];
    const user = jwt.verify(token, process.env.JWT_SECRET);
    // console.log(token);
    req.user = user; // Attach the decoded user to the request object
    req.role = 'user'; // Set the user role (adjust if necessary)
    next(); // Proceed to the next middleware
  } catch (error) {
    console.error("Error in requireSignin middleware:", error.message);
    return res.status(403).json({ message: "Invalid or expired token" });
  }
};

exports.userMiddleware = (req, res, next) => {
  console.log("Inside userMiddleware");

  if (req.role !== "user") {
    return res.status(403).json({ message: "Access Denied" });
  }

  next(); // Proceed if the role is 'user'
};
