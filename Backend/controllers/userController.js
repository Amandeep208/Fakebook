const users = require("../model/user");

// 
exports.users = async (req, res) => {
  const allUsers = await users.find({ username: { $ne: req.session.user.username } });
  res.json({ success: true, users: allUsers });
}