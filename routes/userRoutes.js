const router = require('express').Router();
const { getUsers, deleteUserById, getMyUser,getUserSettings, updateMyUser, updateMyUserSettings, updateMyUserAvatar, getUserDetailsById, searchUsers } = require('../services/userServices')
const { isAuthenticated } = require('../services/loginServices')


router.get('/me', isAuthenticated, getMyUser);
router.get('/settings/:id', isAuthenticated, getUserSettings)
router.get('/id/:id', isAuthenticated, getUserDetailsById);
router.get('/search/:searchInput', isAuthenticated, searchUsers)
router.put('/me/avatar', isAuthenticated, updateMyUserAvatar);

router.put('/me', isAuthenticated, updateMyUser);
router.put('/settings', isAuthenticated, updateMyUserSettings);
router.get('/', getUsers)



router.delete('/:id', deleteUserById)


module.exports = router;