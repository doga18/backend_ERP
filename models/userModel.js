const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/db');
// Importando o modelo de cargo.
const Role = require('./roleModel');

// Definindo o modelo de usuário.
const User = sequelize.define('User', {
  userId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  lastname: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  lastpassword: {
    type: DataTypes.STRING,
    allowNull: true, // Permite que seja nulo inicialmente.
  },
  avaiable: {
    type: DataTypes.BOOLEAN,
    defaultValue: false, // Usuário ativo por padrão.
  },
  hash_recover_password:{
    type: DataTypes.STRING,
    allowNull: true, // Permite que seja nulo inicialmente.
  },
  roleId: {
    type: DataTypes.INTEGER,
    references: {
      model: Role, // Referência ao modelo de cargo.
      key: 'roleId',
    },
  },
}, {
  timestamps: true, // Adiciona createdAt e updatedAt automaticamente.
})

module.exports = User;