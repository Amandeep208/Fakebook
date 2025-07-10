// const message = require("../model/message")

const message = require("../model/message")
const Message = require("../model/message")
const User = require("../model/user")

async function makeRoomID(user1, user2) {
  var ID1 = await User.findOne({ username: user1 })
  var ID2 = await User.findOne({ username: user2 })
  var roomID = [ID1._id.toString(), ID2._id.toString()].sort().join('_')
  return roomID
}


exports.messageFetch = async (req, res) => {
  const from = req.session.user.username;
  const to = req.params.to;

  const room = await makeRoomID(to, from)

  const messages = await Message.find({ roomID: room }).sort({ createdAt: 1 })

  res.json(messages)
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
      return res.status(400).json({ success: false, message: "Could not edit the message!"});
    }
    
    // Authority Check
    if (req.session.user.username != doc.sender) {
      return res.status(400).json({ success: false, message: "Unauthorized edit not permitted!"})
    }

    if (typeof newMessage != 'string' || newMessage.trim() == "") {
      return res.status(400).json({ success: false, message: "Invalid message content!"});
    }

    if (doc.content == newMessage.trim()) {
      return res.status(400).json({ success: false, message: "No changes in the new message!"})
    }

    doc.content = newMessage.trim();
    doc.markModified('content');
    const result = await doc.save();
    return res.status(200).json({ success: true, message: "Message edited successfully", result });
  }
  catch (err) {
    return res.status(500).json({ success: false, message: "Could not edit the message!", error: err.message});
  }
}