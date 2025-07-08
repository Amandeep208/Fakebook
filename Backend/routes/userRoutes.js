const express = require('express');
const { isAuthenticated } = require("../middleware/authMiddleware");
const { users } = require('../controllers/userController');

const router = express.Router(); // ✅ correctly initialized

router.get('/fetchusers', isAuthenticated,users); // ✅ fixed 'router'

module.exports = router;
