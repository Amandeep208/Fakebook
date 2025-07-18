const express = require("express");
const cors = require("cors");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const mongoose = require("mongoose");

const {dbLink, secretKey, frontendURL} = require("./config"); 

const app = express()

app.use(cors({
  origin: frontendURL, 
  credentials: true                 
}));

mongoose.connect(`${dbLink}rStar`, {

}).then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB error:", err));

app.use(express.json());


app.use(session({
  secret: secretKey, 
  resave: false, 
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: `${dbLink}rStar`,
    collectionName: "sessions",
  }),
  cookie: { maxAge: 1000 * 60 * 60 * 24 }
}));

//Routes

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const messageRoutes = require("./routes/messageRoutes")
const upload = require("./routes/profileUploadRoute")

app.use("/auth", authRoutes); 
app.use("/users", userRoutes)
app.use("/messages", messageRoutes)
app.use("/upload",upload)


app.listen(8081, '0.0.0.0')