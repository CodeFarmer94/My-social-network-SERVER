const router = require('express').Router();
const { addFriendship, updateFriendship } = require('../services/friendshipsServices')

router.post('/', addFriendship)
router.put('/:id', updateFriendship)

module.exports = router;