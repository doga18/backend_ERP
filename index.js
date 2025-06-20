// Loading dotenv.
require("dotenv").config();
// Require itens.
const express = require("express");
const bodyParser = require("body-parser");
// Requerendo a conexão com o Postgres.
const sequelize = require('./config/db');
// Requerendo conexão com o Supabase.
// const sequelize = require('./config/db_supabase');
const path = require('path');

// Importando o CORS.
const cors = require('cors');

// Importando models.
//const { sequelize: sequelize_models } = require('./models/indexModels');

// Inicializando itens requidos.
const app = express();

// Habilitando o Json.
app.use(express.json());
//app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.urlencoded({ extended: true }));

// Resolvendo pendências de CORS, setando frontend confiável.
app.use(cors({ credentials: true, origin: "http://localhost:5173", methods: ["GET", "POST", "PUT", "DELETE"], allowedHeaders: ["Content-Type", "Authorization"] }));

// Routes.
const router = require("./routes/Router");
app.use(router);

// Hospedando o servidor de arquivos.
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

// Middlewares.


// Só usar para sincronizar o banco de dados.
(async () => {
  try {
    console.log('Tentando conectar e sincronizar o banco de dados...');
    await sequelize.authenticate();
    console.log('Conexão com o banco de dados estabelecida com sucesso!');

    // Sincroniza as tabelas no banco de dados.
    // Opções:
    // Sync, cria as tabelas não existentes.
    // force: Recria todas as tabelas, deletando todo os dados.
    // alter: Atualiza as colunas para seguir as alterações feitas no modelo.
    // Não usar "force: true" em produção.
    // Por exemplo: await sequelize_models.sync({ alter: true }); // Use { force: true } para produção.
    // Por exemplo: await sequelize_models.sync({ force: true }); // Use { alter: true } para produção.
    await sequelize.sync({ alter: true }); // Use { alter: true } para produção.
    console.log('Todas as tabelas foram sincronizadas com sucesso!');
    //console.log(User.associations);

  } catch (error) {
    console.log(error);
    console.error('Erro ao conectar ou sincronizar o banco de dados:', error.message);
  }
})();

// Inicializando o servidor.
app.listen(process.env.APP_PORT, () => {
  const link = process.env.APP_HOST;  
  console.log(`Servidor está rodando na porta ${process.env.APP_PORT} \nLink: http://${link}:${process.env.APP_PORT}`);
})