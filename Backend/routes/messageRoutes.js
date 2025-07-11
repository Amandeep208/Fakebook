const express = require("express");
const { isAuthenticated } = require("../middleware/authMiddleware");
const { messageFetch, sendMessage, editMessage } = require("../controllers/messageController");
const router = express.Router();

router.post("/send", isAuthenticated, sendMessage)
router.get("/:to", isAuthenticated, messageFetch)
router.post("/edit", isAuthenticated, editMessage)

module.exports = router;