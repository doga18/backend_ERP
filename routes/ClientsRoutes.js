const express = require('express');
const router = express.Router();

// Validation
const { photoValidation, imagePerfilValidation } = require('../middlewares/photoValidation');

// Import Multer para lidar com arquivos.
const { imageUpload } = require('../middlewares/imageUpload');

const {
  getClientById,
  getAllClients,
  searchClients,
  createNewClient,
  editClient
} = require('../controllers/clientsController');

// Middlewares
const { authGuard } = require('../middlewares/authGuard');

// Rotas dos Clients
router.get('/qtd', authGuard, getAllClients);
router.get('/:id', authGuard, getClientById);
router.get('/searchClients', authGuard, searchClients);
router.post('/', authGuard, createNewClient);
router.put('/:id', authGuard, imageUpload.single('imagePerfil'), imagePerfilValidation(), editClient);

module.exports = router;