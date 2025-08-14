// Model para lidar com arquivos, fotos dos equipamentos de entrada e fotos dos equipamentos com estado de saída..
const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/db');
// Importand o pacote uuid para gerar IDs únicos.
const { v4: uuidv4 } = require('uuid');

const Files = sequelize.define('Files', {
  fileId: {
    type: DataTypes.STRING,
    primaryKey: true,
    defaultValue: uuidv4,
    allowNull: false,
  },
  fileName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  fileUrl: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  osId: {
    type: DataTypes.UUID,
    allowNull: true,
  },
  clientId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  fileType: {
    type: DataTypes.ENUM('perfil_cliente', 'entrada_os', 'saida_os', 'perfil_user'),
    allowNull: false,
  },
}, {timestamps: true});

module.exports = Files;