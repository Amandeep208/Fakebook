const users = require("../model/user");

exports.users = async (req, res) => {
  await users.findOneAndUpdate(
    {username: req.session.user.username},
    {$set: {lastSeen: new Date()}}
    // {$set: {lastSeen: JSON.stringify(Date.now()) }}
  )
  const allUsers = await users.find({ username: { $ne: req.session.user.username } });
  res.json({ success: true, users: allUsers });
}