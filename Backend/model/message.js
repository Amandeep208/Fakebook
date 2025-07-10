const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  roomID: {
    type: String,
  },
  sender: {
    type: String,
    required: true
  },
  receiver: {
    type: String,
    required: true
  },
  content: {
    type: String,
  }
  
  // sender: String,
  // receiver: String,
  // content: String,
},
{
  timestamps: {
    createdAt: true,
    updatedAt: true
  },
  versionKey: '__v',
  optimisticConcurrency: true
});

messageSchema.index({roomID:1})

module.exports = mongoose.model("Message", messageSchema);
