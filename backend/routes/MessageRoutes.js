const express = require("express");

const router = express.Router();

const MessageController = require("../controllers/MessageController")

router.post("/send",MessageController.sendMessage);
router.get('/latest/:userId',MessageController.getLatestMessages);
router.get("/get",MessageController.getMessage);
router.delete("/delete/:messageId",MessageController.deleteMessage);
router.put('/mark-read', MessageController.markMessagesAsRead);
module.exports = router;