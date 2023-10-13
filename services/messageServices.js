const { models } = require('../sequelize/sequelize'); 

const createMessage = async (req, res) => {
    try {
        const { id } = req.user;
        const { content, chatId } = req.body;

        const message = await models.Message.create({
            content,
            chatId: parseInt(chatId),
            authorId: parseInt(id),
        });
        res.status(201).json(message);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const createManyMessages = async (req, res) => {
    try {
        const { id } = req.user;
        const { messages } = req.body;
        console.log(messages)
        const messageList = messages.map((message) => {
            return {
                content: message.content,
                chatId: parseInt(message.chatId),
                authorId: parseInt(id),
            };
        });

        const createdMessages = await models.Message.bulkCreate(messageList);
        res.status(201).json(createdMessages);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = {
    createMessage,
    createManyMessages

}
