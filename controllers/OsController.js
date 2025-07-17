const { User, Os } = require('../models/indexModels');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const { Op } = require('sequelize');

// Manipulando arquivos.
const { tryDeleteFile } = require('../middlewares/handleFile');
// Importando função que pega o id do usuário logado.
const { getUserIdByToken } = require('../utils/getIdUserbytoken');
// Retornando o idUser pelo token autenticado.

// Funções gerais para manipulação de OS.
const getAllOs = async (req, res) => {
  // Verificando se o usuário está autenticado.
  const idUser = await getUserIdByToken(req);
  if (!idUser) {
    return res.status(401).json({
      message: 'Usuário nao autenticado.'
    });
  }
  // Parâmetros de consulta para paginação, se necessário.
  const page = parseInt(req.query.page) || 1; // Página atual, padrão é 1.
  const limit = parseInt(req.query.limit) || 5; // Limite de resultados por página, padrão é 10.
  const offset = (page - 1) * limit; // Cálculo do offset para a consulta.

  try {
    const { count, rows } = await Os.findAndCountAll({
      include: [
        {
          model: User,
          as: 'user', // <--- CORRETO, igual ao alias da associação
          attributes: ['userId', 'name', 'email']
        }
      ],
      order: [['createdAt', 'DESC']],
      limit: limit, // Limite de resultados por página.
      offset: offset, // Offset para paginação.
      where: {
        assignedTo: idUser // Filtrando OS atribuídas ao usuário autenticado.
      }
    })
    if(rows){
      // Retornando os dados das OS encontradas e informações de paginação.      
      return res.status(200).json({
        total: count, // Total de OS encontradas.
        totalPages: Math.ceil(count / limit), // Total de páginas.
        currentPage: page, // Página atual.
        data: rows // Dados das OS encontradas.
      })
    }else{
      return res.status(404).json({
        message: 'Nenhuma OS encontrada.'
      })
    }
  } catch (error) {
    console.log('Erro ao buscar todas as OS:', error);
    return res.status(500).json({
      message: 'Erro ao buscar todas as OS.'
    })
  }
}
// Função para buscar uma OS pelo os_number.
const getOsById_number = async (req, res) => {
  try {
    // Tentando localizar OS pelo ID.
    const id_number = req.params.id;
    const osSearch = await Os.findOne({
      where: {
        os_number: id_number
      },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['userId', 'name', 'email']
        }
      ]
    });
    if (osSearch) {
      return res.status(200).json(osSearch);
    } else {
      return res.status(404).json({
        message: 'OS nao encontrada.'
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: 'Erro ao buscar OS pelo ID.'
    });
  }
}
// Função para buscar uma OS pelo UUID
const getOsById = async (req, res) => {
  try {
    // Tentando localizar OS pelo ID.
    const id_uuid = req.params.id;
    const osSearch = await Os.findByPk(id_uuid, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['userId', 'name', 'email']
        }
      ]
    });
    if(osSearch) {
      return res.status(200).json(osSearch);
    }
    else {
      return res.status(404).json({
        message: 'OS nao encontrada.'
      });
    }
  }
  catch (error) {
    //console.error('Erro ao buscar OS pelo ID:', error);
    return res.status(500).json({
      message: 'Erro ao buscar OS pelo ID.'
    });
  }
}
// Função para buscar a Os por parametros, como Nome do cliente, equipamento, prioridade.
const getOsByParams = async (req, res) => {
  // Tentando a procura por os parâmetros informados.
  try {
    // Verificando as variáveis que podem mudar o resultado da busca.
    const page = parseInt(req.query.page) || 1; // Página atual, padrão é 1.
    const limit = parseInt(req.query.limit) || 5; // Limite de resultados por página, padrão é 10.
    const offset = (page - 1) * limit; // Cálculo do offset para a consulta.
    const assignedTo = req.query.assignedTo || null;
    const q = req.query.q;
    if(!q && !assignedTo){
      return res.status(400).json({
        message: 'Para executar uma busca, algum argumento precisa ser informado.'
      })
    }
    if(assignedTo !== null){
      const qAssignedTo = await Os.findAll({
        where: {
          assignedTo: assignedTo
        },
        include: [
          {
            model: User,
            as: 'user',
            attributes: ['userId', 'name', 'email']
          }
        ]
      })
      if(qAssignedTo){
        return res.status(200).json({        
          total: qAssignedTo.length,
          totalPages: Math.ceil(qAssignedTo.length / limit),
          currentPage: page,
          data: qAssignedTo,
        });
      }
    }
    // Buscando dados se a busca informar o assignedTo.
    
    // Tentando busca por title
    const qTitle = await Os.findAll({
      where: {
        title: {
          [Op.iLike]: `%${q}%`
        }
      },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['userId', 'name', 'email']
        }
      ]
    })
    if(qTitle){
      return res.status(200).json({        
        total: qTitle.length,
        totalPages: Math.ceil(qTitle.length / limit),
        currentPage: page,
        data: qTitle,
      });
    }
    return res.status(400).json({
      message: 'Nenhuma OS encontrada com os parâmetros informados.'
    })
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: 'Erro ao buscar OS por parâmetros.'
    });
  }
}
// Função para criar uma nova OS.
const createOs = async (req, res) => {
  try {
    // Verificando se o usuário está autenticado.
    const idUser = await getUserIdByToken(req);
    if (!idUser) {
      return res.status(401).json({
        message: 'Usuário não autenticado.'
      });
    }
    // Validando os dados da OS.
    const {
      title,
      description,
      status = 'Aberto', // Status inicial da OS.
      priority,
      budget=0,
      discount=0,
    } = req.body;

    // Verificando se os campos obrigatórios estão preenchidos.
    if(!title, !priority, !description){
      return res.status(400).json({
        message: 'Os campos de título, prioridade, atribuído a e descrição são obrigatórios.'
      });
    }
    // Verificando se o usuário atribuído existe.
    const userExists = await User.findByPk(idUser);
    if (!userExists) {
      return res.status(404).json({
        message: 'Usuário atribuído nao encontrado.'
      });
    }
    // Verificando se a prioridade é válida.
    const validPriorities = ['Normal', 'Baixa', 'Média', 'Alta', 'Urgente'];
    if (!validPriorities.includes(priority)) {
      return res.status(400).json({
        message: 'Prioridade inválida. As prioridades válidas são: ' + validPriorities.join(', ')
      });
    }
    // Verificando se o status é válido.
    // Somente aberto é aceito, uma vez que a OS é criada com status "Aberto".
    const validStatuses = ["Aberto"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        message: 'Status inválido. O status válido é: ' + validStatuses.join(', ')
      });
    }
    // Criando a OS.
    const newOs = await Os.create({
      title,
      description,
      status,
      priority,
      assignedTo: userExists.userId, // Atribuindo o ID do usuário autenticado.
      budget,
      discount
    });
    // Verificando se a OS foi criada com sucesso.
    if (!newOs) {
      return res.status(500).json({
        message: 'Erro ao criar OS.'
      });
    }
    // Retornando a OS criada.
    return res.status(201).json({
      message: 'OS criada com sucesso.',
      os: newOs
    });
  } catch (error) {
    console.error('Erro ao criar OS:', error);
    return res.status(500).json({
      message: 'Erro ao criar OS.'
    });
  }
}
// Editando uma OS existente.
const updateOs = async (req, res) => {
  try {
    // Verificando se o usuário está autenticado.
    const idUser = await getUserIdByToken(req);
    if (!idUser) {
      return res.status(401).json({
        message: 'Usuário não autenticado.'
      });
    }
    // Buscando a OS pelo ID.
    const os = await Os.findByPk(req.params.id);
    if (!os) {
      return res.status(404).json({
        message: 'OS não encontrada.'
      });
    }
    // Atualizando os campos da OS.
    const { title, description, status, priority, budget, discount } = req.body;
    os.title = title || os.title;
    os.description = description || os.description;
    os.status = status || os.status;
    os.priority = priority || os.priority;
    os.budget = budget || os.budget;
    os.discount = discount || os.discount;

    // Salvando as alterações.
    await os.save();
    
    return res.status(200).json({
      message: 'OS atualizada com sucesso.',
      os
    });
  } catch (error) {
    console.error('Erro ao atualizar OS:', error);
    return res.status(500).json({
      message: 'Erro ao atualizar OS.'
    });
  }
}




module.exports = {
  getAllOs,
  getOsById,
  getOsById_number,
  createOs,
  updateOs,
  getOsByParams
}