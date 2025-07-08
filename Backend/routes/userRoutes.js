const express = require('express');
const { isAuthenticated } = require("../middleware/authMiddleware");
const { users } = require('../controllers/userController');

const router = express.Router(); 

router.get('/fetchusers', isAuthenticated,users); 

module.exports = router;
