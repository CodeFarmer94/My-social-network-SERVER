const router = require('express').Router();
const { addFriendship, updateFriendship, getUserByFriendshipPending, getUserFriends } = require('../services/friendshipsServices')
const { isAuthenticated } = require('../services/loginServices')

router.post('/', isAuthenticated, addFriendship)
router.get('/me/pending', isAuthenticated, getUserByFriendshipPending)
router.get('/user/:id', isAuthenticated, getUserFriends)
router.put('/', isAuthenticated,  updateFriendship)

module.exports = router;