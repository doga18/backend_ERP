const express = require('express');
const router = express.Router();

const { getAllOs, getOsById, getOsById_number, createOs, updateOs, getOsByParams, getOsSummary } = require('../controllers/OsController');

// Validation
// ainda não fiz.
// Exemplo de require na mesma linha...
//router.post('/getbyparams', authGuard, require('../controllers/OsController').getOsByParams);
const { imagesOsValidation } = require('../middlewares/photoValidation');
const { imageUpload } = require('../middlewares/imageUpload');

// Middlewares
// Proteção de rotas.
const { authGuard } = require('../middlewares/authGuard');

// Rotas das OS.
router.get('/', authGuard, getAllOs);
router.get('/summary', authGuard, getOsSummary);
router.get('/:id', authGuard, getOsById_number);
router.get('/os_id/:id', authGuard, getOsById);
router.post('/', authGuard, imageUpload.array('images', 10), imagesOsValidation(), createOs);
//router.post('')
router.put('/:id', authGuard, updateOs);
router.post('/getbyparams', authGuard, getOsByParams);



module.exports = router;
