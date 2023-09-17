const router = require('express').Router();
const { addPicture, getPictureById, deletePicture, getAvatarsByUserId } = require('../services/picturesServices')
const { isAuthenticated } = require('../services/loginServices')


router.post('/', isAuthenticated, addPicture)
router.get('/:id', getPictureById)
router.get('/user/:id', getAvatarsByUserId)
router.delete('/:id', deletePicture)
module.exports = router;