const { Sequelize } = require('sequelize');
const config = require('../config'); // Path to your config.js
const defineModels = require('./model'); // Path to your models folder

const sequelize = new Sequelize(config.development);
const models = defineModels(sequelize);

(async () => {
    try {
        await sequelize.sync({ force: true }); // Drop and recreate tables
        console.log('Database dropped and re-sync completed.');
    } catch (error) {
        console.error('Error dropping and syncing database:', error);
    } finally {
        sequelize.close();
    }
})();


module.exports = { models, sequelize };