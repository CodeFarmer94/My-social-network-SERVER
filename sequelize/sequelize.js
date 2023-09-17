const { Sequelize } = require('sequelize');
const config = require('../config'); // Path to your config.js
const defineModels = require('../model/model'); // Path to your models folder

const sequelize = new Sequelize(config.development);
const models = defineModels(sequelize);

module.exports = { sequelize, models };
