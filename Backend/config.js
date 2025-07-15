require('dotenv').config();
 
const secretKey = process.env.SECRET_KEY;
const dbLink = process.env.DB_LINK1; // Use dbLink1 for local MongoDB or dbLink2 for MongoDB Atlas
const frontendURL = `http://${process.env.FRONTEND_IP_ADDRESS}:${process.env.FRONTEND_PORT}`
 
module.exports = {dbLink, secretKey, frontendURL};