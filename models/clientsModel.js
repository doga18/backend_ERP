const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/db');


// Definindo o modelo de Clients do sistema ERP
const Client = sequelize.define('Client', {
  clientId: {
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
    allowNull: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  contact: {    
    type: DataTypes.STRING,
    limit: 11,
    allowNull: false,
  },
  contact_2: {
    // Criando uma limitação de 11 caracters para o campo de contato.
    type: DataTypes.STRING,
    limit: 11,
    allowNull: true,
  },
  address: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  city: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  state: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  country: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  zipCode: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  complement: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  autorizationContactPhone: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  autorizationContactEmail:{
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  // Referênciando a coluna assignedTo para salvar na criação.
  assignedTo: {
    type: DataTypes.INTEGER,
    references: {
      model: 'Users', // Referência ao modelo de usuário.
      key: 'userId',
    },
    allowNull: true, // Permite que seja nulo inicialmente.
  },
})

module.exports = Client;