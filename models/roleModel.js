const { Sequelize, DataTypes } = require('sequelize');
// Importando a configuração do banco de dados.
const sequelize = require('../config/db');

// Definindo os cargos existentes.
const Role = sequelize.define('Role', {
  roleId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

// Adicionando os cargos iniciais.
async function initializeRoles() {
  await Role.sync();
  const roles = await Role.findAll();
  if (roles.length === 0) {
    await Role.bulkCreate([
      { name: 'Admin' },
      { name: 'Owner' },
      { name: 'Manager' },
      { name: 'Employee' },
      { name: 'Supplier' }
    ])
    console.log('Cargos iniciais criados com sucesso.');
  } else {
    console.log('Cargos já existem no banco de dados.');
  }
}

initializeRoles(); // Chama a função para inicializar os cargos.

// Exportando o modelo de cargo.
module.exports = Role;