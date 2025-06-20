// Criando a conexão com o sequelize.
const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_DATABASE,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'postgres',
    // dialectOptions: {
    //   ssl: {
    //     require: true,
    //     rejectUnauthorized: false, // Use com cuidado em produção
    //   },
    // },
    logging: false,
  }
);

( async () => {
  try {
    await sequelize.authenticate();
    console.log('Conexão bem-sucedida!');
  } catch (error) {
    console.error(`Erro ao conectar no banco de dados! \n ${error} \n ${error.message}`);
  }
})();

module.exports = sequelize;