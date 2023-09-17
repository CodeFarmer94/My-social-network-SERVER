const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const User = sequelize.define('User', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        email: {
            type: DataTypes.STRING,
            unique: true,
        },
        password: DataTypes.STRING,
        createdAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
        updatedAt: {
            type: DataTypes.DATE,
            allowNull: true,
        },
    });

    const UserDetails = sequelize.define('UserDetails', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        firstName: DataTypes.STRING,
        lastName: DataTypes.STRING,
        job: DataTypes.STRING,
        education: DataTypes.STRING,
        placeOfLiving: DataTypes.STRING,
        placeOfBirth: DataTypes.STRING,
        relationshipStatus: DataTypes.STRING,
        avatarPublicId: DataTypes.STRING,
        bio: DataTypes.STRING,
        friends: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
        createdAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
        updatedAt: {
            type: DataTypes.DATE,
            allowNull: true,
        },
    });

    const UserSettings = sequelize.define('UserSettings', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        showBio: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        showJob: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        showEducation: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        showPlaceOfLiving: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        showPlaceOfBirth: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        showRelationshipStatus: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        createdAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
        updatedAt: {
            type: DataTypes.DATE,
            allowNull: true,
        },
    });

    const Friendship = sequelize.define('Friendship', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        status: DataTypes.STRING,
        createdAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
        acceptedAt: DataTypes.DATE,
        rejectedAt: DataTypes.DATE,
    });

    const Comment = sequelize.define('Comment', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        content: DataTypes.STRING,
        likes: { type: DataTypes.INTEGER, defaultValue: 0 },
        createdAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
        updatedAt: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        parentId: {
            type: DataTypes.INTEGER,
            defaultValue: null, // Set the default value to null initially
        },
    }, {
        hooks: {
            beforeCreate: (comment, options) => {
                // If parentId is not provided when creating a comment, set it to the comment's ID
                if (!comment.parentId) {
                    comment.parentId = comment.id;
                }
            },
        },
    });
    

    const Post = sequelize.define('Post', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        content: DataTypes.STRING,
        likes: { type: DataTypes.INTEGER, defaultValue: 0 },
        comments: { type: DataTypes.INTEGER, defaultValue: 0 },
        shares: { type: DataTypes.INTEGER, defaultValue: 0 },
        createdAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
        updatedAt: {
            type: DataTypes.DATE,
            allowNull: true,
        },
    });

    const Picture = sequelize.define('Picture', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        publicId: DataTypes.STRING,
        type: DataTypes.STRING,
        createdAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
        updatedAt: {
            type: DataTypes.DATE,
            allowNull: true,
        },
    
    });
    const PostLike = sequelize.define('PostLike', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        createdAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
    });

    const CommentLike = sequelize.define('CommentLike', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        createdAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
    });
    
    const PictureLike = sequelize.define('PictureLike', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        createdAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
    });
    
    

    // Define Associations
    
    User.hasMany(Comment, { foreignKey: 'authorId' });
    User.hasMany(Post, { foreignKey: 'authorId' });
    User.hasMany(Picture, { foreignKey: 'authorId' });
    User.hasMany(Friendship, { foreignKey: 'senderId', as: 'sentFriendRequests' });
    User.hasMany(Friendship, { foreignKey: 'receiverId', as: 'receivedFriendRequests' });
    User.hasMany(PostLike, { foreignKey: 'userId' });
    User.hasMany(CommentLike, { foreignKey: 'userId' });
    User.hasMany(PictureLike, { foreignKey: 'userId' });
    User.hasOne(UserDetails, { foreignKey: 'userId' });
    User.hasOne(UserSettings, { foreignKey: 'userId' });
    
    UserDetails.belongsTo(User, { foreignKey: 'userId', as: 'user' });
    UserSettings.belongsTo(User, { foreignKey: 'userId', as: 'user' });

    Friendship.belongsTo(User, { foreignKey: 'senderId', as: 'sender' });
    Friendship.belongsTo(User, { foreignKey: 'receiverId', as: 'receiver' });
    
    
    Comment.belongsTo(User, { foreignKey: 'authorId', as: 'author' });
    Comment.belongsTo(Post, { foreignKey: 'postId' });
    Comment.hasMany(CommentLike, { foreignKey: 'commentId' });
    Comment.hasMany(Comment, { foreignKey: 'parentId' });

    CommentLike.belongsTo(User, { foreignKey: {name: 'userId', as: 'commentLikes'} });
    CommentLike.belongsTo(Comment, { foreignKey: 'commentId' });

    Post.belongsTo(User, { foreignKey: 'authorId', as: 'author' });
    Post.hasMany(Comment, { foreignKey: 'postId' });
    Post.hasMany(PostLike, { foreignKey: 'postId' })

    PostLike.belongsTo(User, { foreignKey: 'userId' });
    PostLike.belongsTo(Post, { foreignKey: 'postId' });

    Picture.belongsTo(User, { foreignKey: 'authorId', as: 'author' });
    Picture.hasMany(PictureLike, { foreignKey: 'pictureId' });
    
    PictureLike.belongsTo(User, { foreignKey: 'userId' });
    PictureLike.belongsTo(Picture, { foreignKey: 'pictureId' });

    

    return {
        User,
        Friendship,
        Comment,
        Post,
        Picture,
        UserDetails,
        UserSettings,
        PostLike,
        CommentLike,
        PictureLike,
        
    };
};
