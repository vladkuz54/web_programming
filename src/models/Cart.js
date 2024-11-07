import { DataTypes } from 'sequelize';
import sequelize from '../db.js';
import User from './User.js';

const Cart = sequelize.define('Cart', {
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id'
    }
  },
  items: {
    type: DataTypes.JSON,
    allowNull: false
},
}, {
  timestamps: false,
});


export default Cart;