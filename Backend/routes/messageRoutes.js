const express = require("express");
const { isAuthenticated } = require("../middleware/authMiddleware");
const { messageFetch, sendMessage } = require("../controllers/messageController");
const router = express.Router();

router.post("/send",isAuthenticated, sendMessage)

router.get("/:to",isAuthenticated, messageFetch)

module.exports = router;