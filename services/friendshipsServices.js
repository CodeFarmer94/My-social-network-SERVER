
const { models } = require('../sequelize/sequelize'); 
const { Op } = require('sequelize');

const addFriendship = async (req, res) => { 
    try {
        const { senderId, receiverId } = req.body;
        const newFriendship = await models.Friendship.create({
            status: 'pending',
            senderId: parseInt(senderId),
            receiverId: parseInt(receiverId),
        });
        if(!newFriendship) return res.status(500).json({ error: error.message });
        
        res.status(201).json(newFriendship);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
const getUserByFriendshipPending = async (req, res) => {
    try {
        const { id } = req.user
        const data = await models.Friendship.findAll({
            where: {
                receiverId: parseInt(id),
                status: 'pending',
            },
            include: {
                model: models.User,
                as: 'sender',
                attributes: ['id'],
                include: [
                    {model: models.UserDetails,
                    as: 'UserDetail',
                    attributes: ['firstName', 'lastName', 'avatarPublicId', 'id']}
                    ]
                }
        });
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updateFriendship = async (req, res) => {
    try {
        const { id } = req.user;
        const { status, senderId } = req.body;
        
        const [updated] = await models.Friendship.update(
            { status },
            { where: { receiverId: id , senderId } }
        );
        if (updated === 0) return res.status(404).json({ message: "Friendship not found", receiverId: id, senderId });
        if ( status === 'accepted' && updated >= 1) { 
          res.json({ message: "Friendship accepted"});
        } 
        else if (status === 'declined' && updated >= 1) {
          res.json({ message: "Friendship declined"});
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
const getUserFriends = async (req, res) => {
    try {
        const { id } = req.params
        const friends = await models.Friendship.findAll({
            where: {
                [Op.or]: [
                    { senderId: id },
                    { receiverId: id }
                ],
                status: 'accepted'
            },
            include: [
                {
                    model: models.User,
                    as: 'sender',
                    attributes: ['id'],
                    include: [
                        {
                            model: models.UserDetails,
                            as: 'UserDetail',
                            attributes: ['firstName', 'lastName', 'avatarPublicId', 'id']
                        }
                    ],
                    required: {
                        [Op.or]: [
                            // Check if the senderId or receiverId is equal to the id from the params
                            { '$sender.id$': id },
                            { '$receiver.id$': id }
                        ]
                    }
                },
                {
                    model: models.User,
                    as: 'receiver',
                    attributes: ['id'],
                    include: [
                        {
                            model: models.UserDetails,
                            as: 'UserDetail',
                            attributes: ['firstName', 'lastName', 'avatarPublicId', 'id']
                        }
                    ],
                    required: {
                        [Op.or]: [
                            { '$sender.id$': id },
                            { '$receiver.id$': id }
                        ]
                    }
                }
            ]
        });

        if (!friends) return res.status(404).json({ message: "Friends not found" });
        res.json(friends);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { addFriendship, updateFriendship, getUserByFriendshipPending, getUserFriends };
