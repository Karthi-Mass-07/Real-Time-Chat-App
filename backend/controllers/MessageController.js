const mongoose = require('mongoose');
const Message = require('../models/Message');

// ✅ Send a new message
exports.sendMessage = async (req, res) => {
  const { senderId, receiverId, message } = req.body;

  try {
    const msg = new Message({ sender: senderId, receiver: receiverId, message });
    await msg.save();
    res.status(200).json({ message: "Message sent successfully" });
  } catch (err) {
    console.error("Send message error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.getMessage = async (req, res) => {
  try {
    const { senderId, receiverId } = req.query;

    const messages = await Message.find({
      $or: [
        { sender: senderId, receiver: receiverId },
        { sender: receiverId, receiver: senderId }
      ]
    }).sort({ createdAt: 1 });

    res.json(messages);
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// ✅ Get latest messages per chat user
exports.getLatestMessages = async (req, res) => {
  const userId = req.params.userId;

  try {
    const messages = await Message.aggregate([
      {
        $match: {
          $or: [
            { sender: new mongoose.Types.ObjectId(userId) },
            { receiver: new mongoose.Types.ObjectId(userId) },
          ]
        }
      },
      { $sort: { createdAt: -1 } },
      {
        $group: {
          _id: {
            $cond: [
              { $eq: ["$sender", new mongoose.Types.ObjectId(userId)] },
              "$receiver",
              "$sender"
            ]
          },
          message: { $first: "$message" },
          isUnread: {
            $first: {
              $cond: [
                {
                  $and: [
                    { $ne: ["$sender", new mongoose.Types.ObjectId(userId)] },
                    { $eq: ["$isRead", false] }
                  ]
                },
                true,
                false
              ]
            }
          },
          updatedAt: { $first: "$createdAt" }
        }
      },
      {
        $project: {
          userId: "$_id",
          message: 1,
          isUnread: 1,
          updatedAt: 1,
          _id: 0
        }
      }
    ]);

    res.status(200).json(messages);
  } catch (err) {
    console.error("Error fetching latest messages:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// ✅ Delete a message by ID
exports.deleteMessage = async (req, res) => {
  try {
    const { messageId } = req.params;
    const deletedMessage = await Message.findByIdAndDelete(messageId);

    if (!deletedMessage) {
      return res.status(404).json({ error: "Message not found" });
    }

    res.json({ message: "Message deleted successfully" });
  } catch (err) {
    console.error("Error deleting message:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


// Mark messages as read between two users
exports.markMessagesAsRead = async (req, res) => {
  const { userId, otherUserId } = req.body;

  try {
    await Message.updateMany(
      { sender: otherUserId, receiver: userId, isRead: false },
      { $set: { isRead: true } }
    );
    res.status(200).json({ success: true, message: 'Messages marked as read' });
  } catch (error) {
    console.error('Error marking messages as read:', error);
    res.status(500).json({ success: false, message: 'Failed to mark messages as read' });
  }
};

