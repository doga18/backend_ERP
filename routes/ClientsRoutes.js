const express = require('express');
const router = express.Router();

// Validation
const { photoValidation } = require('../middlewares/photoValidation');

// Import Multer para lidar com arquivos.
const { imageUpload } = require('../middlewares/imageUpload');

const {
  getAllClients,
  createNewClient,
  editClient
} = require('../controllers/ClientsController');

// Middlewares
const { authGuard } = require('../middlewares/authGuard');

// Rotas dos Clients
router.get('/Qtd', authGuard, getAllClients);
router.post('/', authGuard, createNewClient);
router.put('/:id', authGuard, editClient);

module.exports = router;