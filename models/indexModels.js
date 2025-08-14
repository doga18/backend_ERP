const { Sequelize } = require('sequelize');
const sequelize = require('../config/db');
// Importando os modelos.
const User = require('../models/userModel');
const Role = require('../models/roleModel');
const Os = require('../models/osModel');
const Client = require('../models/clientsModel');
const Files = require('../models/filesModels');

// Definindo as associações entre os modelos.
// Relações User
User.belongsTo(Role, { foreignKey: 'roleId', as: 'role' });
User.hasMany(Os, { foreignKey: 'assignedTo', as: 'orders' });
User.hasMany(Client, { foreignKey: 'assignedTo', as: 'clients' });
User.hasMany(Files, { foreignKey: 'userId', as: 'files' });
// Relações Role
Role.hasMany(User, { foreignKey: 'roleId', as: 'users' });
// Relações Os
Os.belongsTo(User, { foreignKey: 'assignedTo', as: 'user' });
Os.belongsTo(Client, { foreignKey: 'clientAssigned', as: 'client' });
Os.hasMany(Files, { foreignKey: 'osId', as: 'files' });
// Relações Client
Client.hasMany(Os, { foreignKey: 'clientAssigned', as: 'os' });
Client.hasMany(Files, { foreignKey: 'clientId', as: 'files' });




module.exports = { User, Role, Os, Client, Files, sequelize };
// Exportando os modelos e a instância do Sequelize para uso em outros arquivos.