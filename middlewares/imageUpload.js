const multer = require('multer');
const path = require('path');

// Configurando destinação dos arquivos.

const imageStorage = multer.diskStorage({
  destination: function(req, file, cb){
    let folder = ""

    if(req.originalUrl.includes("images")){
      folder = "images";      
    } else if(req.originalUrl.includes("company")){
      folder = "company";
    } else if(req.originalUrl.includes("users")){
      folder = "users";
    } else if(req.originalUrl.includes("products")){
      folder = "products";
    } else if(req.originalUrl.includes("suppliers")){
      folder = "suppliers";
    } else if(req.originalUrl.includes("os")){
      folder = "os";
    }
    // cb === Callback.
    cb(null, `./uploads/${folder}`);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname))
  }
})

// uuid

const imageUpload = multer({
  storage: imageStorage,
  limits: {
    fileSize: 1024 * 1024 * 15 // 15MB por arquivo
  },
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype === "image/jpeg" ||
      file.mimetype === "image/png" ||
      file.mimetype === "image/jpg" ||
      file.mimetype === "image/gif" ||
      file.mimetype === "image/webp"
    ) {
      cb(null, true);
    } else {
      cb(new Error("Formato de arquivo inválido. Use apenas imagens JPG, PNG, GIF ou JPEG."), false);
    }
  }
});

// Para aceitar 1 ou mais arquivos, use imageUpload.array('nomeDoCampo', quantidadeMaxima)
// Exemplo de uso em uma rota: router.post('/upload', imageUpload.array('images', 10), controller)

module.exports = { imageUpload };