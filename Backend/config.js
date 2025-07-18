
require('dotenv').config();
const cloudinary = require('cloudinary').v2;

 
const secretKey = process.env.SECRET_KEY;
const dbLink = process.env.DB_LINK1; // Use dbLink1 for local MongoDB or dbLink2 for MongoDB Atlas
const frontendURL = `http://${process.env.FRONTEND_IP_ADDRESS}:${process.env.FRONTEND_PORT}`

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
})


 
module.exports = {dbLink, secretKey, frontendURL,cloudinary};