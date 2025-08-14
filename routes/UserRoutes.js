const express = require('express');
const router = express.Router();

// Validation
const { photoValidation, imagePerfilValidation } = require('../middlewares/photoValidation');
// Import Multer para lidar com arquivos.
const { imageUpload } = require('../middlewares/imageUpload');

// Controllers
const {
  validUserLogged,
  createUser,
  loginUser,
  updateUser,
  updateUserSelf,
  // currentUser,
  getUserById,
  getAllUsers,
  getSummaryUsers,
  // getRoleId,
  recoveryUser,
  renewPassword,
  // updatedPasswordWithTimePass
} = require('../controllers/UserController');

// Middlewares
const { authGuard } = require('../middlewares/authGuard');

// Rotas do user.
router.get('/validUserLogged', validUserLogged);
router.post('/', createUser);
router.post('/auth', loginUser);
// router.put('/edit/:id', imageUpload.single('imagePerfil'), photoValidation(), authGuard, updateUser)
router.put('/edit/:id', imageUpload.single('imagePerfil'), imagePerfilValidation(), authGuard, updateUser)
router.put('/editself/:userTarget', imageUpload.single('imagePerfil'), imagePerfilValidation(), authGuard, updateUserSelf);
// router.get('/:id', authGuard, currentUser);
router.get('/summary', authGuard, getSummaryUsers)
router.get('/:id', authGuard, getUserById); 
router.get('/', authGuard, getAllUsers)
// router.get('/userRole/:idRole', authGuard, getRoleId)
router.post('/recovery', recoveryUser)
router.get('/recovery', renewPassword);
// router.put('/renew', authGuard, updatedPasswordWithTimePass)

// Rotas protegidas de user.


// Exportar as rotas.
module.exports = router;