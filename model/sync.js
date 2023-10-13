const { Sequelize } = require('sequelize');
const config = require('../config'); // Path to your config.js
const defineModels = require('./model'); // Path to your models folder

const sequelize = new Sequelize(config.development);
const models = defineModels(sequelize);
const casual = require('casual');

// Function to create 20 mock users with UserDetails (using casual)
async function createMockUsersWithDetails() {
    try {
      const users = [];
      for (let i = 1; i <= 500; i++) {
        const email = `admin${i}@admin`;
   
        const user = await models.User.create({
          email: email,
          password: 'password',
          createdAt: new Date(),
          id: i,
           // Associate UserDetails with User
        });
        const userDetails = await models.UserDetails.create({
            firstName: i === 1 ? 'Dimitry' : casual.first_name,
            lastName: i === 1 ? 'Myakinchenko' : casual.last_name,
            avatarPublicId: 'v3qyztycwgcaa7rgf3wq',
            userId: user.id
            });
        const userSettings = await models.UserSettings.create({
            userId: user.id
            });
        users.push(user);
      }
  
      console.log('Created 20 mock users with UserDetails (using casual):', users.length);
    } catch (error) {
      console.error('Error creating mock users with UserDetails (using casual):', error);
    }
  }
  
 
  
  (async () => {
    try {
        // Drop the tables in the correct order
        await sequelize.query('SET FOREIGN_KEY_CHECKS = 0');
        await sequelize.sync({ force: true });
        await sequelize.query('SET FOREIGN_KEY_CHECKS = 1');

        console.log('Database dropped and re-sync completed.');

        // Call the function to create mock users with UserDetails
        await createMockUsersWithDetails();
    } catch (error) {
        console.error('Error dropping and syncing database:', error);
    } finally {
        sequelize.close();
    }
})();




module.exports = { models, sequelize };