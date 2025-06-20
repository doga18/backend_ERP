const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const jwtsecret = process.env.JWT_SECRET;

// Funções
// Hashear uma variável.
const passHash = async (pass) => {
  const salt = await bcrypt.genSalt(10);
  const hashedPass = await bcrypt.hash(pass, salt);
  return hashedPass;
}

// Criar um token com expiração.
const generateToken = async (id) => {
  console.log('Id recebido para gerar o token é: ' + id);
  const token = await jwt.sign({ id }, jwtsecret, { expiresIn: '7d' });
  console.log('Token gerado:'+ token);
  return token;
}


module.exports = {
  passHash,
  generateToken
};