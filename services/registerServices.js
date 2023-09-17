const {models} = require('../sequelize/sequelize');
const bcrypt = require('bcrypt');
const saltRounds = 10;


const register = async (req, res) => {
    try {
        const { email, password, firstName, lastName, job, education, bio, placeOfLiving, placeOfBirth, relationshipStatus  } = req.body;
        const existingUser = await models.User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(409).json({ error: "L'email è già registrata" });
          }
        const salt = await bcrypt.genSalt(saltRounds);
        const hashedPassword = await bcrypt.hash(password, salt);
        const user = await models.User.create({
            email,
            password: hashedPassword,
        });
        
        const UserDetails = await models.UserDetails.create({
            userId: user.id,
            avatarPublicId: 'v3qyztycwgcaa7rgf3wq',
            firstName,
            lastName,
            job,
            education,
            bio,
            placeOfLiving,
            placeOfBirth,
            relationshipStatus,
        });

        const UserSettings = await models.UserSettings.create({
            userId: user.id,
        });
        if(!UserDetails) return res.status(404).json({ message: "Could't create userDetails table" })
        if(!UserSettings) return res.status(404).json({ message: "Could't create userSettings table" })
        res.status(201).json({UserDetails});
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { register };