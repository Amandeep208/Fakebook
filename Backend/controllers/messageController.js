Message = require("../model/message")

exports.messageFetch = async(req, res) => {
  const from = req.session.user.username;
  const to = req.params.to;

  const messages = await Message.find({
    $or: [
      { sender: from, receiver: to },
      { sender: to, receiver: from }
    ]
  }).sort({ timestamp: 1 });

  res.json(messages);
}


exports.sendMessage = async (req, res) => {
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
}

