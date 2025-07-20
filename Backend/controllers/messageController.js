// const message = require("../model/message");
const Message = require("../model/message");
const User = require("../model/user");

/**
 * Generates a consistent roomID for a chat between two users.
 * Sorts their MongoDB _id values to avoid duplicate rooms in reverse order.
 */
async function makeRoomID(user1, user2) {
  try {
    const ID1 = await User.findOne({ username: user1 });
    const ID2 = await User.findOne({ username: user2 });

    // Handle missing user error
    if (!ID1 || !ID2) {
      throw new Error("One or both users not found for room creation.");
    }

    const roomID = [ID1._id.toString(), ID2._id.toString()].sort().join('_');
    return roomID;
  } catch (err) {
    console.error("Error creating room ID:", err);
    throw err; // Let caller handle this
  }
}

//FETCH MESSAGE COUNT
exports.countFetch = async (req, res) => {
  try {
    const from = req.session.user.username;
    const to = req.params.to;

    const room = await makeRoomID(to, from);

    const count = await Message.countDocuments({ roomID: room });
    res.json({ count });
  } catch (err) {
    console.error("Error fetching message count:", err);
    res.status(500).json({ success: false, message: "Failed to fetch message count" });
  }
};

// FETCH MESSAGES (WITH PAGINATION)
exports.messageFetch = async (req, res) => {
  try {
    // Update the sender's last seen time
    await User.findOneAndUpdate(
      { username: req.session.user.username },
      { $set: { lastSeen: new Date() } }
    );

    const from = req.session.user.username;
    const to = req.params.to;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;

    const room = await makeRoomID(to, from);

    // Fetch messages with pagination and sorting
    const messages = await Message.find({ roomID: room })
      .sort({ createdAt: -1 }) // Newest first
      .skip((page - 1) * limit)
      .limit(limit);

    res.json(messages.reverse()); // Return in oldest-first order for UI
  } catch (err) {
    console.error("Error fetching messages:", err);
    res.status(500).json({ success: false, message: "Failed to fetch messages" });
  }
};

// SEND MESSAGE
exports.sendMessage = async (req, res) => {
  try {
    const { receiver, content } = req.body;
    const sender = req.session.user.username;

    // Validate message content
    if (!receiver || typeof content !== 'string' || content.trim() === "") {
      return res.status(400).json({ success: false, message: "Invalid message data" });
    }

    const roomID = await makeRoomID(receiver, sender);
    // console.log(roomID);

    const message = new Message({
      roomID,
      sender,
      receiver,
      content: content.trim(),
    });

    await message.save();

    res.json({ success: true, message });
  } catch (err) {
    console.error("Error sending message:", err);
    res.status(500).json({ success: false, message: "Failed to send message", error: err.message });
  }
};

// EDIT MESSAGE 
/**
 * Edits a message if:
 * - It exists
 * - The requester is the original sender
 * - New content is valid and different
 */
// Controller to handle message editing
exports.editMessage = async (req, res) => {
  const { messageID, newMessage } = req.body;

  try {
    // Attempt to find the message document by ID
    const doc = await Message.findById(messageID);
    if (!doc) {
      // If no message found, return 400 Bad Request
      return res.status(400).json({ success: false, message: "Could not edit the message!" });
    }

    // Check if the logged-in user is the sender of the message
    if (req.session?.user?.username !== doc.sender) {
      // If not authorized, return 400 Bad Request
      return res.status(400).json({ success: false, message: "Unauthorized edit not permitted!" });
    }

    // Validate new message content
    if (typeof newMessage !== 'string' || newMessage.trim() === "") {
      // If empty or invalid content, return 400 Bad Request
      return res.status(400).json({ success: false, message: "Invalid message content!" });
    }

    // Check if the new message is different from the existing one
    if (doc.content === newMessage.trim()) {
      // If no actual change, return 400 Bad Request
      return res.status(400).json({ success: false, message: "No changes in the new message!" });
    }

    // Assign updated content to the message
    doc.content = newMessage.trim();

    // Mark 'content' as modified for Mongoose to detect the change
    doc.markModified('content');

    // Save updated message document
    const result = await doc.save();

    // Respond with success and updated message
    return res.status(200).json({ success: true, message: "Message edited successfully", result });

  } catch (err) {
    // Handle any unexpected server/database errors
    console.error("Error editing message:", err);
    return res.status(500).json({ success: false, message: "Could not edit the message!", error: err.message });
  }
};


// ===================== DELETE MESSAGE =====================
/**
 * Deletes a message if:
 * - It exists
 * - The current user is the original sender
 */
exports.deleteMessage = async (req, res) => {
  try {
    const messageID = req.params.msgID;

    // Fetch the message by ID
    const doc = await Message.findById(messageID);

    // Check if the message exists
    if (!doc) {
      return res.status(400).json({ success: false, message: "Invalid message ID!" });
    }

    // Check if current user is authorized to delete it
    if (req.session.user.username !== doc.sender) {
      return res.status(403).json({ success: false, message: "Unauthorized delete not permitted!" });
    }

    // Delete the message
    const result = await Message.findByIdAndDelete(messageID);
    return res.status(200).json({
      success: true,
      message: "Message successfully deleted",
      deletedMessage: result,
    });
  } catch (err) {
    console.error("Delete message error:", err);
    return res.status(500).json({
      success: false,
      message: "Could not delete the message!",
      error: err.message,
    });
  }
};
