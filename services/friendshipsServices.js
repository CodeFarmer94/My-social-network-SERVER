const { models } = require('../sequelize/sequelize'); 

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

const updateFriendship = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const [updated] = await models.Friendship.update(
            { status },
            { where: { id: parseInt(id) } }
        );
        if (updated === 0) return res.status(404).json({ message: "Friendship not found" });
        if( updated === 1 && status === 'accepted'){
            models.UserDetails.update({
                friends: models.sequelize.literal('friends + 1')
            }, {
                where: { id: parseInt(req.body.senderId) }
            })
            }
        const updatedFriendship = await models.Friendship.findByPk(parseInt(id));
        res.json(updatedFriendship);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { addFriendship, updateFriendship };
