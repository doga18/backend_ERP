// Middleware para proteger rotas protegidas por autenticação.
const User = require('../models/userModel');
// JsonWebToken!
const jwt = require('jsonwebtoken');
// Importando o .env.
require('dotenv').config();
// Lendo o JWT Secret.
const jwtsecret = process.env.JWT_SECRET;

// Middleware que verifica se o token da requisição é válido.
const authGuard = async(req, res, next) => {
  const authHeader = req.headers["authorization"]
  const token = authHeader && authHeader.split(" ")[1];
  // Caso não haja token, retorna um erro.
  if(!token) return res.status(401).json({errors: ["Token não fornecido."]});
  try {
    const verified = await jwt.verify(token, jwtsecret);
    req.user = await User.findByPk(verified.id)
    next();
  } catch (error) {    
    res.status(401).json({errors: ["Token inválido."]});
  }
}

module.exports = { authGuard };