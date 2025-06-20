// Lógica de autenticação de usuário por token JWT.
const jwt = require('jsonwebtoken');
const jwtsecret = process.env.JWT_SECRET;
// Modelo de usuário.
const User = require('../models/userModel');

// Função para obter o ID do usuário a partir do token JWT.
const getUserIdByToken = async (req) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  const decoded = await jwt.verify(token, jwtsecret);
  //console.log('Decodificando o token:', decoded);
  try {
    const user = await User.findByPk(decoded.id);
    return user.userId;
  } catch (error) {
    console.error('Erro ao obter o ID do usuário:', error);
    throw new Error('Erro ao obter o ID do usuário');

  }
}

module.exports = { getUserIdByToken };