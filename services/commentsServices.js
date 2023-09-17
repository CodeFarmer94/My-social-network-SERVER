const { models, sequelize } = require('../sequelize/sequelize')
const { Sequelize } = require('sequelize'); 

const getPostCommentsById = async (req, res) => {
    try {
        const { id } = req.params;
        const comments = await models.Comment.findAll({
            where: { postId: parseInt(id) },
            order: [['createdAt', 'DESC']],
            include: [
                {
                    model: models.User,
                    as: 'author',
                    attributes: ['id'],
                    include: [
                        {
                            model: models.UserDetails,
                            as: 'UserDetail',
                            attributes: ['firstName', 'lastName', 'avatarPublicId'],
                        },
                    ],
                },
                {
                    model: models.CommentLike,
                    as: 'CommentLikes',
                    group: ['Comment.id'],
                    attributes: ['id', 'userId'],
                }
            ],
        });

        if (!comments) return res.status(500).json({ message: "Error searching for comments" });
       
        res.json(comments);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};



const getUserCommentsById = async (req, res) => { 
    try {
        const { id } = req.params;
        const comments = await models.Comment.findAll({
            where: { authorId: parseInt(id) },
            
        });
        if (comments.length === 0) return res.status(404).json({ message: "Comments not found" });
        res.json(comments);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


const addCommentToPost = async (req, res) => {
    try {
        const { id } = req.user;
        const { postId, content, parentId } = req.body;
        const newComment = await models.Comment.create({
            content,
            postId: parseInt(postId),
            authorId: parseInt(id),
            parentId: parseInt(parentId),
        });
        res.status(201).json(newComment);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updateCommentById = async (req, res) => { 
    try {
        const { id } = req.params;
        const { content } = req.body;

        const [updated] = await models.Comment.update(
            { content },
            { where: { id: parseInt(id) } }
        );
        if (updated === 0) return res.status(404).json({ message: "Comment not found" });

        const updatedComment = await models.Comment.findByPk(parseInt(id));
        res.json(updatedComment);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const deleteCommentById = async (req, res) => {
    try {
        const { id } = req.params;

        const comment = await models.Comment.findByPk(parseInt(id));
        if (!comment) return res.status(404).json({ message: "Comment not found" });

        await comment.destroy();
        res.json(comment);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


const addLikeToComment = async (req, res) => {
    try {
        const { id } = req.user;
        const { commentId } = req.params
        const newLike = await models.CommentLike.create({
            commentId: parseInt(commentId),
            userId: parseInt(id),
        });
        res.status(201).json(newLike);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const deleteLikeFromComment = async (req, res) => {
    try {
        const { id } = req.user;
        const { commentId } = req.params;
        const like = await models.CommentLike.findOne({
            where: { commentId: parseInt(commentId), userId: parseInt(id) },
        });
        if (!like) return res.status(404).json({ message: "Like not found" });
        await like.destroy();
        res.json(like);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


module.exports = { 
    getPostCommentsById, 
    getUserCommentsById,
    addCommentToPost, 
    updateCommentById, 
    deleteCommentById, 
    addLikeToComment, 
    deleteLikeFromComment 

};
