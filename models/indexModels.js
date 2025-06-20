const { Sequelize } = require('sequelize');
const sequelize = require('../config/db');
// Importando os modelos.
const User = require('../models/userModel');
const Role = require('../models/roleModel');
const Os = require('../models/osModel');

// Definindo as associações entre os modelos.
User.belongsTo(Role, { foreignKey: 'roleId', as: 'role' });
User.hasMany(Os, { foreignKey: 'assignedTo', as: 'orders' });
Role.hasMany(User, { foreignKey: 'roleId', as: 'users' });
Os.belongsTo(User, { foreignKey: 'assignedTo', as: 'user' });


module.exports = { User, Role, Os, sequelize };
// Exportando os modelos e a instância do Sequelize para uso em outros arquivos.