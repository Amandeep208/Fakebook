const express = require("express");
const cors = require("cors");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const mongoose = require("mongoose");
// const users = require("./model/user");
// const Message = require("./model/message"); 
// const path = require("path");
// const bcrypt = require('bcrypt');
const {dbLink,secretKey} = require("./config"); // Importing database links


const app = express()
// app.use(cors());

app.use(cors({
  origin: "http://192.168.1.64:5173", // Your frontend address
  credentials: true                  // Allow cookies (sessions)
}));

mongoose.connect(`${dbLink}rStar`, {
  // useNewUrlParser: true,
  // useUnifiedTopology: true,
}).then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB error:", err));



app.use(express.json());


//creating sessions moddleware
app.use(session({
  secret: secretKey, //encrypted key for session
  resave: false, // dont save the session if nothing is modified
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



app.use("/auth", authRoutes); // Using auth routes
app.use("/users", userRoutes)
app.use("/messages", messageRoutes)



// app.get("/",(req,res)=> {
//     res.send("Hello World")
// })






app.listen(8081, '0.0.0.0')