const { Os, User, Client } = require('../models/indexModels');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');

// Manipulando arquivos.
const { tryDeleteFile } = require('../middlewares/handleFile');
// Importando função que pega o usuário requisitor
const { getUserIdByToken } = require('../utils/getIdUserbytoken');

// Funções gerais para manipulação de Clients.
// Função para contar quantos clientes existem na base de dados.
const getAllClients = async (req, res) => {
  const idUser = await getUserIdByToken(req);
  if (!idUser) {
    return res.status(401).json({
      message: 'Usuário nao autenticado.'
    });
  }
  try {
    const clients = await Client.findAndCountAll();
      if(clients.count >= 1) return res.status(200).json(clients);
      else return res.status(404).json({message: 'Nenhum cliente cadastrado.'});
    return res.status(200).json(clients);
  } catch (error) {
    return res.status(500).json({
      message: 'Erro ao buscar clientes.'
    });
  }
}
// Criando um Client
const createNewClient = async (req, res) => {
  // Verificando se o usuário está logado.
  try {
    const idUser = await getUserIdByToken(req);
    if (!idUser) {
      return res.status(401).json({
        message: 'Usuário nao autenticado.'
      });
    }
    const { 
      name,
      email,
      password = null,
      contact,
      contact_2,
      address,
      city,
      state,
      country,
      zipCode,
      assignedTo = idUser
    } = req.body;
    // Verificando se os dados sensíveis foram informados.
    if(!name, !email, !contact, !address){
      return res.status(400).json({
        message: 'Os campos de nome, email, contato e endereço são obrigatórios.'
      });
    }
    // Criando um novo Client.
    const newClient = await Client.create({ 
      name,
      email,
      password,
      contact,
      contact_2,
      address,
      city,
      state,
      country,
      zipCode,
      assignedTo
    });
    // const newClient = await Client.create({ name, email, phone });
    return res.status(201).json(newClient);
  } catch (error) {
    if(error.name === 'SequelizeUniqueConstraintError') return res.status(400).json({message: 'Email ja cadastrado.'});
    if(error.name === 'SequelizeValidationError' && error.errors[0].message.includes('cannot be null')) return res.status(400).json({message: "Os campos obrigatórios não podem ser nulos."});
    return res.status(500).json({message: 'Erro ao criar cliente.'})
  }
}
// Editando um Client
const editClient = async (req, res) => {
  try {
    // Verificando se o usuário está logado.
    const idUser = await getUserIdByToken(req);
    if(!idUser){
      return res.status(401).json({
        message: 'Usuário nao autenticado.'
      });
    }
    // Localizando o client.
    const targetClient = await Client.findByPk(req.params.id);
    if(!targetClient){
      return res.status(404).json({
        message: 'Client nao encontrado.'
      });
    }
    // Pegando os dados do body.
    const {
      name,
      email,
      contact,
      contact_2,
      address,
      password,
      city,
      state,
      country,
      zipCode
    } = req.body;
    // Verificando se algum campo está vazio.
    if(!name, !email, !contact, !address){
      return res.status(400).json({
        message: 'Os campos de nome, email, contato e endereço são obrigatórios.'
      });
    }
    // Verificando se o email foi alterado e se foi, verificando se outro usuário já não possui esse email.
    if(email !== targetClient.email ){
      const emailExists = await Cliente.findOne({where: { email }});
      if(emailExists) return res.status(400).json({message: 'Email em uso, tente outro.'});
    }
    // Editando o cliente.
    targetClient.name !== name ? targetClient.name = name : targetClient.name = targetClient.name;
    targetClient.email !== email ? targetClient.email = email : targetClient.email = targetClient.email;
    targetClient.contact !== contact ? targetClient.contact = contact : targetClient.contact = targetClient.contact;
    targetClient.contact_2 !== contact_2 ? targetClient.contact_2 = contact_2 : targetClient.contact_2 = targetClient.contact_2;
    targetClient.address !== address ? targetClient.address = address : targetClient.address = targetClient.address;
    targetClient.password !== password ? targetClient.password = password : targetClient.password = targetClient.password;
    targetClient.city !== city ? targetClient.city = city : targetClient.city = targetClient.city;
    targetClient.state !== state ? targetClient.state = state : targetClient.state = targetClient.state;
    targetClient.country !== country ? targetClient.country = country : targetClient.country = targetClient.country;
    targetClient.zipCode !== zipCode ? targetClient.zipCode = zipCode : targetClient.zipCode = targetClient.zipCode;
    await targetClient.save();
    return res.status(200).json({
      message: "Cliente editado com sucesso.",
      user: targetClient
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({message: 'Erro ao editar cliente.'});
  }
  
}

module.exports = {
  getAllClients,
  createNewClient,
  editClient
}