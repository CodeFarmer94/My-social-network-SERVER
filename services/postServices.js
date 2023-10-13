const { models } = require('../sequelize/sequelize'); 

const getPostsByUserId = async (req, res) => {
    try {
        const { id } = req.params;
        const posts = await models.Post.findAll({
            where: {
                authorId: parseInt(id),
            },
            order: [['createdAt', 'DESC']],
            include: [
                { model: models.User, 
                    as: 'author', 
                    attributes: ['id'],
                    include: [
                        { model: models.UserDetails,
                            as: 'UserDetail',
                            attributes: ['firstName', 'lastName', 'avatarPublicId']
                        },  
                    ] 
                },
                { model: models.PostLike,
                    as: 'PostLikes',
                    group: ['Post.id']
                },
                { model: models.Comment,
                    as: 'Comments',
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
                    ],}
                    
                    ]
        });
        res.json({ posts});
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
const addLikeToPost = async (req, res) => {
    try {
        const { id } = req.user;
        const { postId } = req.params;
        const like = await models.PostLike.create({
            userId: parseInt(id),
            postId: parseInt(postId),
        });
        res.status(201).json(like);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const deleteLikeFromPost = async (req, res) => {
    try {
        const { id } = req.user;
        const { postId } = req.params;
        const like = await models.PostLike.findOne({
            where: {
                userId: parseInt(id),
                postId: parseInt(postId),
            },
        });
        if (!like) return res.status(404).json({ message: "Like not found" });
        await like.destroy();
        res.json(like);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};



const createPost = async (req, res) => {
    try {
        const { id } = req.user
        const { content} = req.body;
        const newPost = await models.Post.create({
            content,
            authorId: parseInt(id),
        });
        res.status(201).json(newPost);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updatePostById = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, content } = req.body;

        const [updated] = await models.Post.update(
            {
                title,
                content,
            },
            {
                where: { id: parseInt(id) },
            }
        );
        if (updated === 0) return res.status(404).json({ message: "Post not found" });
        const updatedPost = await models.Post.findByPk(parseInt(id));
        res.json(updatedPost);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const deletePostById = async (req, res) => {
    try {
        const { id } = req.params;

        const post = await models.Post.findByPk(parseInt(id));
        if (!post) return res.status(404).json({ message: "Post not found" });

        await post.destroy();
        res.json(post);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { createPost, getPostsByUserId, updatePostById, deletePostById, addLikeToPost, deleteLikeFromPost };
