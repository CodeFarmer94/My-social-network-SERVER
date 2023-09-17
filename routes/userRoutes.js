const router = require('express').Router();
const { getUsers, deleteUserById, getMyUser,getMyUserSettings, updateMyUser, updateMyUserSettings, updateMyUserAvatar, getUserDetailsById } = require('../services/userServices')
const { isAuthenticated } = require('../services/loginServices')


router.get('/me', isAuthenticated, getMyUser);
router.get('/settings', isAuthenticated, getMyUserSettings)
router.get('/id/:id', isAuthenticated, getUserDetailsById);
router.put('/me/avatar', isAuthenticated, updateMyUserAvatar);

router.put('/me', isAuthenticated, updateMyUser);
router.put('/settings', isAuthenticated, updateMyUserSettings);
router.get('/', getUsers)



router.delete('/:id', deleteUserById)


module.exports = router;