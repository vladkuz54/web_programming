// src/initDb.js
import sequelize from './db.js';
import User from './models/User.js';
import Cart from './models/Cart.js';

const initDb = async () => {
  try {
    await sequelize.sync({ force: false }); // Змініть force на false
    console.log('Database synchronized');
  } catch (error) {
    console.error('Unable to synchronize the database:', error);
  }
};

export default initDb;