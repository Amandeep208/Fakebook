const express = require("express");
const cors = require("cors");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const mongoose = require("mongoose");
const users = require("./model/user");
const Message = require("./model/message"); // New message model
const path = require("path");
const bcrypt = require('bcrypt');



const app = express();
const port = 3000;

// MongoDB connection
mongoose.connect("mongodb://localhost:27017/rStar", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB error:", err));

// Middleware
app.use(cors({
  origin: "http://192.168.1.64:5173", // ✅ Your frontend address
  credentials: true                  // ✅ Allow cookies (sessions)
}));
app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.set("view engine", "ejs");
// app.set("views", "./views");
// app.use(express.static(path.join(__dirname, 'public')));

// Session
app.use(session({
  secret: "yourSecretKey12345",
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: "mongodb://localhost:27017/rStar",
    collectionName: "sessions",
  }),
  cookie: { maxAge: 1000 * 60 * 60 * 24 }
}));

// Authentication Middleware
function isAuthenticated(req, res, next) {
  if (req.session.user) {
    next();
  } else {
    res.redirect("/");
  }
}

app.get("/users", isAuthenticated, async (req, res) => {
  const allUsers = await users.find({ username: { $ne: req.session.user.username } });
  res.json({ success: true, users: allUsers });
});

// Routes
// app.get("/", (req, res) => res.render("index"));

// app.get("/signup", (req, res) => res.render("signup"));

app.post("/signup", async (req, res) => {
  const { name, username, password, signupConfirmPassword } = req.body;

  if (!name || !username || !password || !signupConfirmPassword)
    return res.status(400).json({ success: false, message: "All fields required" });

  if (password !== signupConfirmPassword)
    return res.status(400).json({ success: false, message: "Passwords don't match" });

  try {
    const saltRounds = 10; // you can increase for more security
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    console.log(hashedPassword);
    const newUser = new users({ name:name, username:username, password:hashedPassword });
    const savedUser = await newUser.save();
    res.status(201).json({ success: true, data: savedUser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "User exists or DB error" });
  }
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await users.findOne({ username });
    if (!user) return res.json({ success: false, message: "Username not found" });
    var hashedPass = await bcrypt.compare(password, user.password)
    // console.log(user.password)
    if (!hashedPass)
      return res.json({ success: false, message: "Invalid password" });

    req.session.user = {
      username: user.username,
      name: user.name
    };
    return res.json({ success: true, message: "Login successful", data: req.session.user });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

app.get("/auth/check", (req, res) => {
  if (req.session.user) {
    res.json({ loggedIn: true, user: req.session.user });
  } else {
    res.json({ loggedIn: false });
  }
});


app.get("/messages/:to", isAuthenticated, async (req, res) => {
  const from = req.session.user.username;
  const to = req.params.to;

  const messages = await Message.find({
    $or: [
      { sender: from, receiver: to },
      { sender: to, receiver: from }
    ]
  }).sort({ timestamp: 1 });

  res.json(messages);
});


// Get messages between two users
// app.get("/messages/:to", isAuthenticated, async (req, res) => {
//   const from = req.session.user.username;
//   const to = req.params.to;

//   const messages = await Message.find({
//     $or: [
//       { sender: from, receiver: to },
//       { sender: to, receiver: from }
//     ]
//   }).sort({ timestamp: 1 });

//   res.json(messages);
// });

// Send message
app.post("/messages", isAuthenticated, async (req, res) => {
  const { receiver, content } = req.body;
  const sender = req.session.user.username;

  const message = new Message({
    sender,
    receiver,
    content,
    timestamp: new Date()
  });

  await message.save();
  res.json({ success: true, message });
});

// Logout
app.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ success: false, message: "Logout failed" });
    }
    res.clearCookie("connect.sid"); // this is the default session cookie name
    return res.json({ success: true, message: "Logged out" });
  });
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Server running at http://localhost:${port}`);
});
