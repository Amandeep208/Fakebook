// Import required models and libraries
const message = require("../../Backend/model/message"); // Not used here, consider removing if unnecessary
const users = require("../model/user");
const bcrypt = require("bcrypt");

//  SIGNUP CONTROLLER
exports.signup = async (req, res) => {
  // Destructure user input from request body
  const { name, username, password, signupConfirmPassword } = req.body;

  // Basic validation: All fields must be present
  if (!name || !username || !password || !signupConfirmPassword)
    return res.status(400).json({ success: false, message: "All fields required" });

  // Check if password and confirm password match
  if (password !== signupConfirmPassword)
    return res.status(400).json({ success: false, message: "Passwords don't match" });

  try {
    // Check if username already exists
    const existingUser = await users.findOne({ username });
    if (existingUser) {
      return res.status(409).json({ success: false, message: "Username already taken" });
    }

    // Generate salt and hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create new user instance
    const newUser = new users({
      name: name,
      username: username,
      password: hashedPassword,
    });

    // Save user to database
    const savedUser = await newUser.save();

    // Respond with success and saved user data
    res.status(201).json({ success: true, data: savedUser });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error during signup" });
  }
};

//  LOGIN CONTROLLER
exports.login = async (req, res) => {
  const { username, password } = req.body;

  // Validate that both fields are present
  if (!username || !password) {
    return res.status(400).json({ success: false, message: "Details Missing" });
  }

  try {
    // Find user in database
    const user = await users.findOne({ username });
    if (!user) {
      return res.status(404).json({ success: false, message: "Username not found" });
    }

    // Compare entered password with hashed password
    const hashedPass = await bcrypt.compare(password, user.password);
    if (!hashedPass) {
      return res.status(401).json({ success: false, message: "Invalid password" });
    }

    // Store user details in session (excluding password)
    req.session.user = {
      id: user._id,
      username: user.username,
      name: user.name,
      profileLink: user.profileLink,
    };

    // Respond with success and session data
    return res.json({ success: true, message: "Login successful", data: req.session.user });
  } catch (err) {
    console.error("Login error:", err); // Log error
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

//  LOGOUT CONTROLLER
exports.logout = (req, res) => {
  // Destroy session and clear cookie
  req.session.destroy((err) => {
    if (err) {
      console.error("Logout error:", err); // Log error
      return res.status(500).json({ success: false, message: "Logout failed" });
    }

    // Clear session cookie
    res.clearCookie("connect.sid"); // Default session cookie name

    // Respond with logout success
    return res.json({ success: true, message: "Logged out" });
  });
};

//AUTH CHECK CONTROLLER
exports.checkAuth = (req, res) => {
  // Check if user is stored in session
  if (req.session.user) {
    // Authenticated
    res.json({ loggedIn: true, user: req.session.user });
  } else {
    // Not authenticated
    res.json({ loggedIn: false });
  }
};
