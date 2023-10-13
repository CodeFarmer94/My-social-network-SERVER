const { models } = require('../sequelize/sequelize')
const { Op } = require('sequelize')
const Sequelize = require('sequelize')

const getChat = async (req, res) => {
  try {
      const { id } = req.user;
      const { receiverId } = req.params;

      // Find the chatsId of the chat associated to the users
      const userChat1 = await models.userChat.findAll({
          where: {
              userId: id,
          },
          attributes: ['chatId'],
      });
      const userChat2 = await models.userChat.findAll({
          where: {
              userId: receiverId,
          },
          attributes: ['chatId'],
      });
    
      // Find the common chatId
      const commondChatId = userChat1.filter((chatId) => {
        return userChat2.some((chatId2) => {
          return chatId.dataValues.chatId === chatId2.dataValues.chatId;
        });
      });
      console.log(commondChatId, 'commondChatId')
      
      // If there is no common chatId, create a new chat
      if(commondChatId.length === 0){
        const newChat = await models.Chat.create({
        })
        // Create the userChat entries
        await models.userChat.create({
            UserId: id,
            ChatId: newChat.id
        })
        await models.userChat.create({
            UserId: receiverId,
            ChatId: newChat.id
        })

        const newChatWithMessages = await models.Chat.findOne({
            where: {
                id: newChat.id,
            },
            include: [
                {
                    model: models.Message,
                    attributes: ['id', 'content', 'createdAt'],
                    include: [
                        {
                            model: models.User,
                            as: 'author',
                            attributes: ['id'],
                        },
                    ],
                }
            ]
        });
        res.json(newChatWithMessages);
        return
      } else {
        const chat = await models.Chat.findOne({
          where: {
              id: commondChatId[0].dataValues.chatId,
          },
          include: [
              {
                  model: models.Message,
                  attributes: ['id', 'content', 'createdAt'],
                  include: [
                      {
                          model: models.User,
                          as: 'author',
                          attributes: ['id'],
                      },
                  ],
                  
              }
          ]
      });
        res.json(chat);
        return
      }
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
}

const getChatMessages = async (req, res) => {
    try {
        const { chatId } = req.params;
        const messages = await models.Message.findAll({
            where: {
                chatId: chatId
            },
            include: [
                {
                  model: models.User,
                  as: 'author',
                  attributes: ['id'],
              },
            ],
            attributes: ['id', 'content', 'createdAt'],
            order: [['createdAt', 'ASC']],
        });
        res.json(messages);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}


module.exports = { getChat, getChatMessages }