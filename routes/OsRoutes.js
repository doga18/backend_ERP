const express = require('express');
const router = express.Router();

// Validation
// ainda não fiz.

// Middlewares
// Proteção de rotas.
const { authGuard } = require('../middlewares/authGuard');

// Rotas das OS.
router.get('/', authGuard, require('../controllers/OsController').getAllOs);
router.get('/:id', authGuard, require('../controllers/OsController').getOsById);
router.post('/', authGuard, require('../controllers/OsController').createOs);
router.put('/:id', authGuard, require('../controllers/OsController').updateOs);


module.exports = router;
