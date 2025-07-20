const express = require("express");
// Import controller functions for auth routes
const { signup, login, logout, checkAuth } = require("../controllers/authController");

const router = express.Router();

// Handle user registration
router.post("/signup", signup);

// Handle user login
router.post("/login", login);

// Handle user logout
router.get("/logout", logout);

// Check if user is authenticated (e.g. session or token)
router.get("/check", checkAuth);

// Export the router to be used in main app
module.exports = router;
