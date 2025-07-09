require('dotenv').config();

const secretKey = process.env.SECRET_KEY;
const dbLink = process.env.DB_LINK1; // Use dbLink1 for local MongoDB or dbLink2 for MongoDB Atlas
const frontendURL = process.env.FRONTEND_URL;

module.exports = {dbLink, secretKey, frontendURL};