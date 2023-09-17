const router = require('express').Router();

const {getPostCommentsById, getUserCommentsById, addCommentToPost, updateCommentById, deleteCommentById, addLikeToComment, deleteLikeFromComment } = require('../services/commentsServices')
const { isAuthenticated } = require('../services/loginServices')

router.get('/post/:id', getPostCommentsById)
router.get('/user/:id', getUserCommentsById)
router.post('/like/:commentId', isAuthenticated, addLikeToComment)
router.delete('/like/:commentId',isAuthenticated, deleteLikeFromComment)
router.post('/', addCommentToPost)
router.put('/:id', updateCommentById)
router.delete('/:id', deleteCommentById)

module.exports = router;
