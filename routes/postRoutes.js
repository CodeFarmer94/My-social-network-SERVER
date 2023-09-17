const router = require('express').Router();
const { createPost, getPostsByUserId, updatePostById, deletePostById, addLikeToPost, deleteLikeFromPost } = require('../services/postServices')
const { isAuthenticated } = require('../services/loginServices')

router.get('/user/:id', getPostsByUserId)
router.post('/like/:postId', isAuthenticated, addLikeToPost)
router.delete('/like/:postId',isAuthenticated, deleteLikeFromPost)  
router.delete('/:id', deletePostById)
router.post('/', isAuthenticated, createPost)
module.exports = router;