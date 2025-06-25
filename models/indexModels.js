const { Sequelize } = require('sequelize');
const sequelize = require('../config/db');
// Importando os modelos.
const User = require('../models/userModel');
const Role = require('../models/roleModel');
const Os = require('../models/osModel');
const Client = require('../models/clientsModel');

// Definindo as associações entre os modelos.
User.belongsTo(Role, { foreignKey: 'roleId', as: 'role' });
User.hasMany(Os, { foreignKey: 'assignedTo', as: 'orders' });
User.hasMany(Client, { foreignKey: 'assignedTo', as: 'clients' });
Role.hasMany(User, { foreignKey: 'roleId', as: 'users' });
Os.belongsTo(User, { foreignKey: 'assignedTo', as: 'user' });
Os.belongsTo(Client, { foreignKey: 'clientAssigned', as: 'client' });
Client.hasMany(Os, { foreignKey: 'clientAssigned', as: 'os' });


module.exports = { User, Role, Os, Client, sequelize };
// Exportando os modelos e a instância do Sequelize para uso em outros arquivos.