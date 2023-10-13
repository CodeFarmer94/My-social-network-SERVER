const router = require('express').Router();
const { isAuthenticated } = require('../services/loginServices')
const { getChat, getChatMessages } = require('../services/chatServices')

router.get('/:receiverId', isAuthenticated, getChat)
router.get('/:chatId/messages', isAuthenticated, getChatMessages)

module.exports = router;