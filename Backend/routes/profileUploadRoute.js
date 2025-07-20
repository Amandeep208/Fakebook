const express = require('express');
// Middleware: isAuthenticated checks login, upload handles file upload
const { isAuthenticated, upload } = require("../middleware/authMiddleware");
// User controller (not used in routes here but imported)
const { users } = require('../controllers/userController');
// Profile-related controller functions
const { profileUpload, profileRemove, getUser } = require('../controllers/profileUpload');

const router = express.Router();

// Upload user profile image (requires auth and image file)
router.post('/profileUpload', isAuthenticated, upload.single('image'), profileUpload);

// Remove user's profile image
router.post('/profileRemove', isAuthenticated, profileRemove);

// Get logged-in user's profile data
router.get('/profileData', isAuthenticated, getUser);

// Export the router to be used in main app
module.exports = router;
