const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const jwtsecret = process.env.JWT_SECRET;
const timeToExpire = process.env.TIMETOEXPIRED;


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
  const token = await jwt.sign({ id }, jwtsecret, { expiresIn: timeToExpire });
  console.log('Token gerado:'+ token);
  return token;
}


module.exports = {
  passHash,
  generateToken
};