const express = require("express");
const { isAuthenticated } = require("../middleware/authMiddleware");
const { messageFetch, sendMessage, editMessage, deleteMessage, countFetch} = require("../controllers/messageController");
const router = express.Router();
 
router.post("/send", isAuthenticated, sendMessage);
router.get("/:to", isAuthenticated, messageFetch);
router.patch("/edit", isAuthenticated, editMessage);
router.delete("/delete/:msgID", isAuthenticated, deleteMessage);
router.get("/count/:to", isAuthenticated, countFetch);
 
module.exports = router;