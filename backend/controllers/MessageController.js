const Message = require("../models/Message");


exports.sendMessage = async (req, res) => {
    const { senderId, receiverId, message } = req.body;
    const msg = new Message({ senderId, receiverId, message })
    await msg.save();
    res.status(200).json({
        message: "Message Sent Sucessfully"
    })
}

exports.getMessage = async (req, res) => {
    try {
      const { senderId, receiverId } = req.query;
  
      const messages = await Message.find({
        $or: [
          { senderId, receiverId },
          { senderId: receiverId, receiverId: senderId },
        ],
      }).sort("timestamp");
  
      res.json(messages);
    } catch (err) {
      console.error("Error:", err);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };

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