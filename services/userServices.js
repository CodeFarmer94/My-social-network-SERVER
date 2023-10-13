const { models } = require('../sequelize/sequelize');
const { Op } = require('sequelize');


const getUsers = async (req, res) => {
    try {
        const users = await models.User.findAll();
        if (users.length === 0) return res.status(404).json({ message: "Users not found" });
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
const getMyUser = async (req, res) => {
    try {
        const { id } = req.user;
        const user = await models.UserDetails.findOne({
            where: { userId: parseInt(id) },
            include: {
                model: models.User,
                as: 'user',
                attributes: ['id'],
                include: [
                    {
                    model: models.Friendship,
                    as: 'sentFriendRequests'
                    },
                    {model: models.Friendship,
                    as: 'receivedFriendRequests'}
            ]
            }
        });
        if (!user) return res.status(404).json({ message: "User not found" });
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updateMyUser = async (req, res) => {
    try {
        const { id } = req.user;
        const { job, education, placeOfLiving, placeOfBirth, relationshipStatus } = req.body;
        const [updated] = await models.UserDetails.update(
            {
                job,
                education,
                placeOfLiving,
                placeOfBirth,
                relationshipStatus,
            },
            {
                where: { userId: parseInt(id) },
            }
        );
        if (updated === 0) return res.status(404).json({ message: "User not found" });
        if (updated === 1) return res.status(200).json({ message: "User updated"});
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updateMyUserAvatar = async (req, res) => {
    try {
        const { id } = req.user;
        const { publicId } = req.body;
        
        const [updated] = await models.UserDetails.update(
            {
                avatarPublicId: publicId,
            },
            {
                where: { userId: parseInt(id) },
            })
            if (updated === 0) return res.status(404).json({ message: "User not found" , user: user});
            if (updated === 1) return res.status(200).json({ message: "User updated" });
        } catch (error) {
                res.status(500).json({ error: error.message });
            }
        }

const getUserSettings = async (req, res) => {
    try {
        
        const { id } = req.params;
        const userSettings = await models.UserSettings.findOne({
            where: { userId: parseInt(id) }
        });
        if (!userSettings) return res.status(404).json({ message: "User not found" });
        res.json(userSettings);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updateMyUserSettings = async (req, res) => {
    try {
        const { id } = req.user;
        const { showJob, showEducation, showPlaceOfLiving, showPlaceOfBirth, showRelationshipStatus } = req.body;
        const [updated] = await models.UserSettings.update(
            {
                showJob,
                showEducation,
                showPlaceOfLiving,
                showPlaceOfBirth,
                showRelationshipStatus,
            },
            {
                where: { userId: parseInt(id) },
            }
        );
        if (updated === 0) return res.status(404).json({ message: "User not found" });
        if (updated === 1) return res.status(200).json({ message: "User settings updated" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getUserDetailsById = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await models.UserDetails.findOne({
            where: { userId: parseInt(id) },
            include: {
                model: models.User,
                as: 'user',
                attributes: ['id'],
                include: [
                    {
                    model: models.Friendship,
                    as: 'sentFriendRequests'
                    },
                    {model: models.Friendship,
                    as: 'receivedFriendRequests'}
            ]
            }
        });
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const createUser = async (req, res) => {
    try {
        const { email, password, name, surname } = req.body;
        const user = await models.User.create({
            email,
            password,
            name,
            surname,
        });
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const deleteUserById = async (req, res) => {
    try {
        const { id } = req.params;

        const user = await models.User.findByPk(parseInt(id));
        if (!user) return res.status(404).json({ message: "User not found" });

        await user.destroy();
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

async function searchUsers(req, res) {
    const { searchInput } = req.params;
    try {
      const users = await models.UserDetails.findAll({
        where: {
          [Op.or]: [
            { firstName: { [Op.like]: `%${searchInput}%` } },
            { lastName: { [Op.like]: `%${searchInput}%` } },
          ],
        },
      });
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
  }
module.exports = {
    getUsers,
    createUser,
    getUserDetailsById,
    deleteUserById,
    getMyUser,
    updateMyUser,
    getUserSettings,
    updateMyUserSettings,
    updateMyUserAvatar,
    searchUsers
};
