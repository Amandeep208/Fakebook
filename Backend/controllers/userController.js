const users = require("../model/user");

// Controller to fetch all users except the currently logged-in user
exports.users = async (req, res) => {
  try {
    // Update the current user's lastSeen field to the current date and time
    await users.findOneAndUpdate(
      { username: req.session.user.username },       // Filter by logged-in user
      { $set: { lastSeen: new Date() } }             // Update lastSeen field
      // Alternatively, can use: { $set: { lastSeen: JSON.stringify(Date.now()) } }
    );

    // Fetch all users except the currently logged-in one
    const allUsers = await users.find({ username: { $ne: req.session.user.username } });

    // Send the user list as a success response
    res.json({ success: true, users: allUsers });
  } catch (err) {
    // If an error occurs during DB operation, catch and respond with 500
    console.error("Error fetching users:", err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch users",
      error: err.message
    });
  }
};
