const message = require("../model/message")
const Message = require("../model/message")
const User = require("../model/user")
 
async function makeRoomID(user1, user2) {
  var ID1 = await User.findOne({ username: user1 })
  var ID2 = await User.findOne({ username: user2 })
  var roomID = [ID1._id.toString(), ID2._id.toString()].sort().join('_')
  return roomID
}
 
 
exports.countFetch = async (req,res)=> {
    const from = req.session.user.username;
    const to = req.params.to;
 
    const room = await makeRoomID(to, from)
 
    const count = await Message.countDocuments({"roomID": room});
    res.json({count})
}
 
 
 
exports.messageFetch = async (req, res) => {
  await User.findOneAndUpdate(
    {username: req.session.user.username},
    {$set: {lastSeen: new Date()}}
    // {$set: {lastSeen: JSON.stringify(Date.now()) }}
  )
  const from = req.session.user.username;
  const to = req.params.to;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
 
  const room = await makeRoomID(to, from)
 
  const messages = await Message.find({ roomID: room }).sort({ createdAt: -1 })
  .skip((page - 1) * limit). limit(limit)
 
  res.json(messages.reverse())
}
 
 
exports.sendMessage = async (req, res) => {
  const { receiver, content } = req.body;
  const sender = req.session.user.username;
 
  var roomID = await makeRoomID(receiver, sender)
  console.log(roomID)
 
  const message = new Message({
    roomID,
    sender,
    receiver,
    content,
    // timestamp: new Date()
  });
 
  await message.save();
  res.json({ success: true, message });
}
 
 
// Edits a message: Recieves ObjectID, new message then updates message and increments version key, sends back updated message.
exports.editMessage = async (req, res) => {
  const { messageID, newMessage } = req.body;
 
  try {
    const doc = await Message.findById(messageID);
    if (!doc) {
      return res.status(400).json({ success: false, message: "Could not edit the message!" });
    }
 
    // Authority Check
    if (req.session.user.username != doc.sender) {
      return res.status(400).json({ success: false, message: "Unauthorized edit not permitted!" })
    }
 
    if (typeof newMessage != 'string' || newMessage.trim() == "") {
      return res.status(400).json({ success: false, message: "Invalid message content!" });
    }
 
    if (doc.content == newMessage.trim()) {
      return res.status(400).json({ success: false, message: "No changes in the new message!" })
    }
 
    doc.content = newMessage.trim();
    doc.markModified('content');
    const result = await doc.save();
    return res.status(200).json({ success: true, message: "Message edited successfully", result });
  }
  catch (err) {
    return res.status(500).json({ success: false, message: "Could not edit the message!", error: err.message });
  }
}
 
 
// Deletes a message: Recieves ObjectID of message, checks authority, performs documents deltion, returns status.
exports.deleteMessage = async (req, res) => {
  try {
    const messageID = req.params.msgID;
   
    const doc = await Message.findById(messageID);
   
    // Check if message exists
    if (!doc) {
      return res.status(400).json({ success: false, message: "Invalid mesaage ID!"});
    }
 
    // Authority Check
    if (req.session.user.username != doc.sender) {
      return res.status(403).json({ success: false, message: "Unauthorized delete not permitted!"});
    }
 
    // Message Deletion
    console.log(doc);
    const result = await Message.findByIdAndDelete(messageID);
    return res.status(200).json({ success: true, message: "Message successfully deleted", deletedMessage: result });
  }
  catch (err) {
    return res.status(500).json({ success: false, message: "Could not delete the message!", error: err.message });
  }
}