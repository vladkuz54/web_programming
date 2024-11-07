// src/db.js
import { Sequelize } from 'sequelize';

const sequelize = new Sequelize('accounts', 'root', 'root', {
  host: 'localhost',
  dialect: 'mysql',
});

export default sequelize;