const express = require('express');
// Middleware to ensure the user is authenticated
const { isAuthenticated } = require("../middleware/authMiddleware");
// Controller function to fetch users
const { users } = require('../controllers/userController');

const router = express.Router();

// Fetch all registered users (excluding the logged-in user if handled in controller)
router.get('/fetchusers', isAuthenticated, users);

// Export the router to be used in the main app
module.exports = router;
