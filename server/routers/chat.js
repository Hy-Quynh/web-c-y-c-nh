const express =  require('express');
const chatController = require('../controllers/chat');
const router = express.Router();

router.get('/user', chatController.getAllUserHaveChat);
router.get('/user/:userId', chatController.getChatByUserId);
router.post('/user/:userId', chatController.createUserChat);
router.post('/user/reply/:userId', chatController.createUserChatReply);


module.exports = router;
