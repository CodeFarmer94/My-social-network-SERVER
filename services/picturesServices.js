const { models } = require('../sequelize/sequelize'); 

const getPictureById = async (req, res) => {
    try {
        const { id } = req.params;
        const picture = await models.Picture.findByPk(parseInt(id));

        if (!picture) return res.status(404).json({ message: "Picture not found" });
        res.json(picture);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const addPicture = async (req, res) => { 
    try {
        const { id } = req.user
        const {  publicId, type } = req.body;
        const newPicture = await models.Picture.create({
            type,
            publicId,
            authorId: parseInt(id),
        });
        res.status(201).json(newPicture);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getAvatarsByUserId = async (req, res) => {
    try {
        const { id } = req.params;
        const pictures = await models.Picture.findAll({
            where: { authorId: parseInt(id), type: 'avatar' },
        });
        res.json(pictures);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const deletePicture = async (req, res) => {
    try {
        const { id } = req.params;

        const picture = await models.Picture.findByPk(parseInt(id));
        if (!picture) return res.status(404).json({ message: "Picture not found" });
        await picture.destroy();
        res.json(picture);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { addPicture, deletePicture, getPictureById, getAvatarsByUserId };
