import { DataTypes } from 'sequelize';
import sequelize from '../config/sequelize.js';
import User from './user.js';

const Service = sequelize.define('Service', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'users', key: 'id' },
  },
}, {
  tableName: 'services',
});

User.hasMany(Service, { foreignKey: 'user_id', onDelete: 'CASCADE' });
Service.belongsTo(User, { foreignKey: 'user_id' });

export default Service;
