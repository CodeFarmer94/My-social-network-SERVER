const router = require('express').Router();
const { createMessage, createManyMessages } = require('../services/messageServices');

router.post('/', createMessage);
router.post('/many', createManyMessages);
module.exports = router