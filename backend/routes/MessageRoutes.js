const express = require("express");

const router = express.Router();

const MessageController = require("../controllers/MessageController")

router.post("/send",MessageController.sendMessage);
router.get("/get",MessageController.getMessage);
router.delete("/delete/:messageId",MessageController.deleteMessage)
module.exports = router;