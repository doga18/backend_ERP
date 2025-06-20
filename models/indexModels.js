const { Sequelize } = require('sequelize');
const sequelize = require('../config/db');
// Importando os modelos.
const User = require('../models/userModel');
const Role = require('../models/roleModel');



// Definindo as associações entre os modelos.
User.belongsTo(Role, { foreignKey: 'roleId', as: 'role' });
Role.hasMany(User, { foreignKey: 'roleId', as: 'users' });


module.exports = { User, Role, sequelize };
// Exportando os modelos e a instância do Sequelize para uso em outros arquivos.