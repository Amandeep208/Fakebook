const message = require("../../Backend/model/message");
const users = require("../model/user");
const bcrypt = require("bcrypt");

exports.signup = async(req, res) => {
  const { name, username, password, signupConfirmPassword } = req.body;

  if (!name || !username || !password || !signupConfirmPassword)
    return res.status(400).json({ success: false, message: "All fields required" });

  if (password !== signupConfirmPassword)
    return res.status(400).json({ success: false, message: "Passwords don't match" });

  try {
    const saltRounds = 10; 
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    console.log(hashedPassword);
    const newUser = new users({ name:name, username:username, password:hashedPassword });
    const savedUser = await newUser.save();
    res.status(201).json({ success: true, data: savedUser });
  } catch (err) {
    res.status(500).json({ success: false, message: "User exists or DB error" });
  }
};

exports.login = async (req, res) => {
    const { username, password } = req.body;
    
    if(!username || !password){
      return res.status(500).json({success:false, message: "Details Missing"})
    }
  
  try {
    const user = await users.findOne({ username });
    if (!user) return res.json({ success: false, message: "Username not found" });
    var hashedPass = await bcrypt.compare(password, user.password)
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
}



exports.logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ success: false, message: "Logout failed" });
    }
    res.clearCookie("connect.sid"); // this is the default session cookie name
    return res.json({ success: true, message: "Logged out" });
  });
}

exports.checkAuth = (req,res) => {
  if (req.session.user) {
    res.json({ loggedIn: true, user: req.session.user });
  } else {
    res.json({ loggedIn: false });
  }
}