const express = require('express');
const router = express();

// Importando as rotas.
// Rotas do usuário.
router.use("/api/users", require('./UserRoutes'));
// router.use("/api/clients", require('./ClientsRoutes'));
// router.use("/api/os/", require('./OsRoutes'));

// Exportando para uso.

module.exports = router;