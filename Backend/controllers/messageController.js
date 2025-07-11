// const message = require("../model/message")

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

// Edits a message: Recieves ObjectID, update message.
exports.editMessage = async (req, res) => {
  const { messageID, newMessage } = req.body;

  try {
    const result = await Message.updateOne(
      { _id: messageID }, 
      { $set: { content: newMessage } }
    );

    return res.json({ success: true, message: "Message edited successfully", result })
  }
  catch (err) {
    return res.json({ success: false, message: "Could not edit the message!", error: err.message });
  }
}