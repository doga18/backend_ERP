const express = require('express');
const router = express.Router();

// Validation
// ainda não fiz.

// Middlewares
// Proteção de rotas.
const { authGuard } = require('../middlewares/authGuard');

// Rotas das OS.
router.get('/', authGuard, require('../controllers/OsController').getAllOs);
router.get('/:id', authGuard, require('../controllers/OsController').getOsById_number);
router.get('/os_id/:id', authGuard, require('../controllers/OsController').getOsById);
router.post('/', authGuard, require('../controllers/OsController').createOs);
//router.post('')
router.put('/:id', authGuard, require('../controllers/OsController').updateOs);
router.post('/getbyparams', authGuard, require('../controllers/OsController').getOsByParams);



module.exports = router;
