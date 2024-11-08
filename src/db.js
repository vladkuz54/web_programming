// src/db.js
import { Sequelize } from 'sequelize';

const sequelize = new Sequelize('accounts', 'root', '2077vkuz', {
  host: 'localhost',
  dialect: 'mysql',
});

export default sequelize;