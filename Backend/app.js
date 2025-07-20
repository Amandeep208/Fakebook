const express = require("express");
const cors = require("cors");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const mongoose = require("mongoose");

const { dbLink, secretKey, frontendURL } = require("./config"); 

const app = express();

// Enable CORS for the frontend domain and allow cookies/credentials
app.use(cors({
  origin: frontendURL, 
  credentials: true
}));

// Connect to MongoDB
mongoose.connect(`${dbLink}rStar`)
  .then(() => console.log("MongoDB connected"))
  .catch(err => {
    console.error("MongoDB connection error:", err);
    process.exit(1); // Exit if DB fails to connect
  });

// Middleware to parse incoming JSON requests
app.use(express.json());

// Configure session middleware
app.use(session({
  secret: secretKey,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: `${dbLink}rStar`,
    collectionName: "sessions"
  }),
  cookie: { maxAge: 1000 * 60 * 60 * 24 } // 1 day
}));

// Route imports
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const messageRoutes = require("./routes/messageRoutes");
const upload = require("./routes/profileUploadRoute");

// Mount routes under their respective base paths
app.use("/auth", authRoutes); 
app.use("/users", userRoutes);
app.use("/messages", messageRoutes);
app.use("/upload", upload);

// 404 handler for unknown routes
app.use((req, res, next) => {
  res.status(404).json({ error: "Route not found" });
});

// Global error handling middleware
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ error: "Something went wrong on the server" });
});

// Start server on port 8081 and bind to all interfaces
app.listen(8081, '0.0.0.0', () => {
  console.log("Server running on http://0.0.0.0:8081");
});
