const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/db');
// Importando o pacote uuid para gerar IDs únicos.
const { v4: uuidv4 } = require('uuid');
// Importando o modelo de usuário.
const User = require('./userModel');

// Definindo o modelo de Ordem de Serviço (OS).
const Os = sequelize.define('OS', {
  osId: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: uuidv4,
    allowNull: false, // Garante que o ID da OS não seja nulo.
  },
  os_number: {
    type: DataTypes.STRING,
    allowNull: false,
    //unique: true, // Garante que o número da OS seja único.
    defaultValue: "0001"
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true, // Permite que seja nulo inicialmente.
  },
  status: {
    type: DataTypes.ENUM(
      "Aberto",
      "Em fila de atendimento",
      "Em análise",
      "Aguardando",
      "Análise concluída",
      "Situação Inicial",
      "Listagem de peças",
      "Orçando mão de obra",
      "Pendente aprovação cliente",
      "Autorizado por cliente",
      "Rejeitado OS por cliente",
      "Realizando trabalho",
      "Trabalho em pausa",
      "Trabalho cancelado",
      "Trabalho Concluído",
      "Pendente aviso cliente",
      "Aviso de conclusão realizado",
      "Pendente Pagamento",
      "Pagamento Realizado",
      "Concluído",
      "Aparelho Retirado",
      "Retorno Garantia"
    ),
    allowNull: false,
    defaultValue: "Aberto",
  },
  priority: {
    type: DataTypes.ENUM(
      'Normal',
      'Baixa',
      'Média',
      'Alta',
      'Urgente'
    ),
    allowNull: false,
    defaultValue: 'Normal', // Prioridade inicial da OS.
  },
  budget:{
    type: DataTypes.DECIMAL(10, 2), // Valor do orçamento da OS.
    allowNull: true, // Permite que seja nulo inicialmente.
  },
  discount: {
    type: DataTypes.DECIMAL(10, 2), // Desconto aplicado na OS.
    allowNull: true, // Permite que seja nulo inicialmente.
  },
  // Vinculações
  assignedTo: {
    type: DataTypes.INTEGER,
    references: {
      model: User, // Referência ao modelo de usuário.
      key: 'userId',
    },
    allowNull: true, // Permite que seja nulo inicialmente.
  }
}, {
  timestamps: true,
});

// Função para gerar o próximo os_number
const generateNextOsNumber = async () => {
  const lastOs = await Os.findOne({
    order: [['createdAt', 'DESC']], // Busca a última OS criada.
    attributes: ['os_number'], // Busca o número da OS.
  });  
  let nextNumber = 1; // Valor inicial se não houver OS no banco.

  if (lastOs) {
    const lastOsNumber = parseInt(lastOs.os_number, 10); // Converte o último os_number para inteiro.
    if (!isNaN(lastOsNumber)) {
      nextNumber = lastOsNumber + 1; // Incrementa o último número.
    }
  }
  if(lastOs === null){
    nextNumber = 1;
  }

  // Formata o número para ter sempre 4 dígitos (ou mais, se necessário).
  return nextNumber.toString().padStart(4, '0');
};

// Hook para gerar o os_number antes de criar uma nova OS.
Os.beforeCreate(async (os) => {
  os.os_number = await generateNextOsNumber();
});

// Exportando o modelo de Ordem de Serviço (OS).
module.exports = Os;