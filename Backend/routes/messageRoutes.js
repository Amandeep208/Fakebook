const express = require("express");
// Middleware to check if user is authenticated
const { isAuthenticated } = require("../middleware/authMiddleware");
// Message controller functions
const { messageFetch, sendMessage, editMessage, deleteMessage, countFetch } = require("../controllers/messageController");

const router = express.Router();

// Send a new message
router.post("/send", isAuthenticated, sendMessage);

// Fetch messages between logged-in user and another user
router.get("/:to", isAuthenticated, messageFetch);

// Edit an existing message
router.patch("/edit", isAuthenticated, editMessage);

// Delete a message by its ID
router.delete("/delete/:msgID", isAuthenticated, deleteMessage);

// Fetch total message count between logged-in user and another user
router.get("/count/:to", isAuthenticated, countFetch);

// Export the router to use in the main app
module.exports = router;
