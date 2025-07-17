const express = require('express');
const { isAuthenticated, upload } = require("../middleware/authMiddleware");
const { users } = require('../controllers/userController');
const { profileUpload, profileRemove, getUser } = require('../controllers/profileUpload');

const router = express.Router(); 

router.post('/profileUpload',isAuthenticated, upload.single('image'),profileUpload); 
router.post('/profileRemove',isAuthenticated,profileRemove); 
router.get('/profileData',isAuthenticated,getUser); 

module.exports = router;
