const dbLink1 = "mongodb://localhost:27017/"; // MongoDB connection string
const dbLink2 = "mongodb+srv://rajatkr2:sAchkhand%4016@cluster0.fsknipp.mongodb.net/"; // Example for MongoDB Atlas
const secretKey = "yourSecretKey12345";
const dbLink = dbLink1; // Use dbLink1 for local MongoDB or dbLink2 for MongoDB Atlas
const frontendURL = "http://192.168.1.60:5173";

module.exports = {dbLink, secretKey, frontendURL};
// export const URL1 = `${dbLink1}`;
// export const URL2 = `${dbLink2}`;