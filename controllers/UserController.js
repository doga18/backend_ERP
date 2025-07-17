const { User } = require("../models/indexModels");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { passHash, generateToken } = require("../utils/passHash");
// Manipulando arquivos.
const { tryDeleteFile } = require("../middlewares/handleFile");

// Função para Verificar se o usuário que está atualizando o usuário ele tem permissão para fazer isso.
const verifyUserToAlter = async (requesterRole, targetRole) => {
  const roleHierarchy = ['Admin', 'Owner', 'Manager', 'Employee', 'Supllier']
  const requesterIndex = roleHierarchy.indexOf(requesterRole);
  const targertIndex = roleHierarchy.indexOf(targetRole);
  console.log(`O usuário requisitor tem permissão ${requesterIndex} e o alvo da edição tem a permissão de ${targertIndex}`);
  // O usuário que solicita a edição, só poderá reditar permissões igual ou inferior do cargo dele.
  return requesterIndex <= targertIndex;
}

const roleMapping = {
  1: 'Admin',
  2: 'Owner',
  3: 'Manager',
  4: 'Employee',
  5: 'Supplier'
};

// Função para buscar todos os usuários do banco de dados, excluindo a senha e o último hash de senha.
const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ['password', 'lastpassword'] },
      include: { model: Role, attributes: ['name'] }
    });
    return res.status(200).json(users);
  } catch (error) {
    console.error('Erro ao buscar usuários:', error);
    return res.status(500).json({ error: 'Erro ao buscar usuários.' });
  }
}
// Função para criar um novo usuário.
const createUser = async (req, res) => {
  try {
    if(!req.body) {
      return res.status(400).json({ error: 'Dados inválidos.' });
    }
    const {
      name,
      lastname,
      email,
      password    
    } = req.body;
    // Validando os dados recebidos.
    if (!name || !lastname || !email || !password) {
      return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
    }
    // Verificando se o usuário já existe.
    const existingUser = await User.findOne({ where: { email } });
    if(existingUser) {
      return res.status(400).json({ error: 'Usuário já existe, tente recuperar sua senha no link http://localhost:5173/recovery/?email=' + email + '.' })
      res.status(200)
    }else{
      // Criando o novo usuário com criptografia de senha.
      const hashedPassword = await passHash(password);
      // Verificando se existem já usuários no sistema, caso não exista, o primeiro usuário será um administrador.
      const allUsers = await User.findAll();
      const newUser = await User.create({
        name,
        lastname,
        email,
        roleId: allUsers.length === 0 ? 1 : 4, // Se for o primeiro usuário, será um administrador (roleId = 1), caso contrário, será um funcionário (roleId = 4).
        avaiable: allUsers.length === 0 ? true : false,
        password: hashedPassword
      })
      // Gerando o token de autenticação.
      const token = await generateToken(newUser.userId);
      // Retornando o usuário criado e o token, sem a senha.
      const userRetorned = newUser.toJSON();
      delete userRetorned.password;
      delete userRetorned.lastpassword;
      userRetorned.token = token;
      res.status(201).json({
        user: userRetorned,
        message: 'Usuário criado com sucesso.',
      })
    }
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar usuário.' });
  }
  
}

// Função para fazer login no usuário.
const loginUser = async (req, res) => {
  try {
    // Validando os dados recebidos.
    if(!req.body){
      return res.status(400).json({ error: 'Dados inválidos.' });
    }
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
    }
    // Verificando se o usuário existe.
    const user = await User.findOne({ where: { email }});
    if(user){
      const passwordInformed = password;
      const passwordHashed = user.password;
      // Comparando as senhas.
      const isPasswordValid = await bcrypt.compare(passwordInformed, passwordHashed);
      if(isPasswordValid){
        // Gerando o token de autenticação.
        const token = await generateToken(user.userId);
        // Retornando o usuário logado e o token, sem a senha.
        const userRetorned = user.toJSON();
        delete userRetorned.password;
        delete userRetorned.lastpassword;
        delete userRetorned.hash_recover_password; // Removendo o hash de recuperação de senha para não expor a informação.
        userRetorned.token = token;
        res.status(200).json({
          user: userRetorned,
          message: 'Usuário logado com sucesso.',
        })
      }else{
        return res.status(400).json({ error: 'Senha inválida.' });
      }
    }else{
      return res.status(400).json({ error: 'Usuário não encontrado.' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Erro ao fazer login.' });
    console.log(error);
  }
}

// Atualização de usuário, por permissão de usupario.
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, lastname, email, password, roleId, avaiable=false } = req.body;

    console.log('Id informado nos parametros é: ' + id);
    console.log('Dados recebidos para atualizar o usuário: ', req.body);
    // console.log(req.user)

    // Verificando se o usuário existe.
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado.' });
    }

    // Verificando se o usuário que está atualizando tem permissão para isso.
    const requesterRole = roleMapping[req.user.roleId]; // Supondo que o usuário autenticado tenha a propriedade 'role'.
    const targetRole = roleMapping[user.roleId]; // Supondo que o usuário tenha a propriedade 'role'.
    console.log('requesterRole: ' + requesterRole);
    console.log('targetRole: ' + targetRole);
    const hasPermission = await verifyUserToAlter(requesterRole, targetRole);
    if (!hasPermission) {
      return res.status(403).json({ message: 'Você não tem permissão para atualizar este usuário.' });
    }

    // Atualizando os dados do usuário.
    user.name = name || user.name;
    user.lastname = lastname || user.lastname;
    user.email = email || user.email;
    if(hasPermission && avaiable !== undefined) {
      // Se o usuário que está atualizando tem permissão, ele pode ativar ou desativar o usuário.
      user.avaiable = avaiable !== undefined ? avaiable : user.avaiable; // Atualizando a disponibilidade do usuário.
    }

    if(avaiable && !hasPermission){
      // Se o usuário que está atualizando não tem permissão, ele não pode ativar o usuário.
      return res.status(403).json({ message: 'Você não tem permissão para ativar este usuário.' });
    }
    
    if (password) {
      user.password = await passHash(password);
      user.lastpassword = user.password; // Armazenando a senha anterior.
    }
    
    if (roleId) {
      user.roleId = roleId; // Atualizando o cargo do usuário.
    }

    await user.save();
    
    return res.status(200).json({ message: 'Usuário atualizado com sucesso.', user });
  } catch (error) {
    console.error('Erro ao atualizar usuário:', error);
    return res.status(500).json({ message: 'Erro ao atualizar usuário.' });
  }
}

// Atualização de usuário por ele mesmo.
const updateUserSelf = async (req, res) => {
  try {
    // Verificando se o usuário que está logado é o mesmo que está tentando atualizar.
    const requesteruserId = req.user.userId;
    const { userTarget } = req.params;
    const { name, lastname, email, password } = req.body;
    // Verificando se o usuário existe.
    const userT = await User.findByPk(userTarget);
    if(!userT) {
      return res.status(404).json({ message: 'Usuário não encontrado.' });
    }
    // Verificando se o Id do usuário logado é o mesmo que o Id do usuário que está tentando atualizar.
    if(requesteruserId === userT.userId){
      // Atualizando os dados do usuário.
      if(!name, !lastname, !email, !password) {
        return res.status(400).json({ message: 'Todos os campos são obrigatórios.' });
      }
      userT.name === name ? userT.name : name;
      userT.lastname === lastname ? userT.lastname : lastname;
      userT.email === email ? userT.email : email;
      // Verificando se a senha foi informada, caso contrário não atualiza a senha.
      if(password !== userT.password && password !== userT.lastpassword){
        // Se a senha foi informada, verificando se a senha é diferente da atual e também diferente da última senha.
        // Salvando a senha atual como a última senha.
          userT.lastpassword = userT.password;
          // Atualizando a senha do usuário.
          userT.password = await passHash(password);
          await userT.save();
          return res.status(200).json({ message: 'Os dados foram atualizados e a senha foi alterada com sucesso.' });
      }else{
        await userT.save();
        return res.status(200).json({ Message: 'Os dados foram atualizados, mas a senha não foi alterada, pois é igual a senha atual ou a última senha.' });
      }
    }else{
      return res.status(403).json({ message: 'Aqui você só pode atualizar seus próprios dados.' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Erro ao atualizar usuário.' });
  }
}

// Recuperação de usuário, não implementada ainda.
const recoveryUser = async (req, res) => {
  try {
    // Verificando se os dados foram informados.
    if(!req.body){
      return res.status(400).json({ message: 'Dados inválidos.' });
    }
    const { email } = req.body;
    if(!email){
      return res.status(400).json({ messa: 'O email é obrigatório.' });      
    }
    // Verificando se o usuário existe.
    const verifyEmail = await User.findOne({ where: { email }});
    if(!verifyEmail){
      return res.status(404).json({ message: "Usuário não encontrado, tente realizar o cadastro." });
    }
    // Lógica para enviar o email de recuperação de senha.
    const hashRecoverPassword = await bcrypt.hash(verifyEmail.email + Date.now(), 10);
    // Salvando a hash de recuperação de senha no usuário.
    verifyEmail.hash_recover_password = hashRecoverPassword;
    await verifyEmail.save();
    // Aqui implemnto a lógica de enviar o email de recuperação de senha, com o link para a página de recuperação.
    // Exemplo de link: http://localhost:5173/recovery/?email=usuario.email&hash=hashRecoverPassword
    console.log('Link de recuperação de senha: http://localhost:5173/recovery/?email=' + verifyEmail.email + '&hash=' + hashRecoverPassword);
    return res.status(200).json({ message: 'Email de recuperação enviado com sucesso.'});

  } catch (error) {
    return res.status(500).json({ message: 'Erro na função de recuperar usuário.' });
  }
}

// Depois de configurar um sistema de envio de email, essa rota será implementada para renovar a senha do usuário.
// A rota será acessada pelo link enviado no email de recuperação de senha.
const renewPassword = async (req, res) => {
  console.log('recuperando dados do parametros')
  console.log(req.query);
  const { email, hash } = req.query;
  console.log('email: ' + email);
  console.log('Hash: ' + hash);
  // Verificando se o email e a hash foram informados.
  if(!email || !hash){
    return res.status(400).json({ message: 'Email e hash são obrigatórios.' });
  }
  // Verificando se o usuário existe.
  const existsUser = await User.findOne({ where: { email }});
  if(!existsUser){
    return res.status(404).json({ message: "Usuário não encontrado." });
  }
  // Verificando se a hash de recuperação de senha é válida.
  if(existsUser.hash_recover_password === hash){
    return res.status(200).json({ message: 'Rota de recuperação de senha implementada, mas não finalizada.' });
  }else{
    return res.status(400).json({ message: 'Hash de recuperação de senha inválida.' });
  }
  res.status(200).json({ message: 'Rota de recuperação de senha não implementada.' });
}


module.exports = {
  getAllUsers,
  createUser,
  loginUser,
  updateUser,
  updateUserSelf,
  // currentUser,
  // getRoleId,
  recoveryUser,
  renewPassword,
  // updatedPasswordWithTimePass
}