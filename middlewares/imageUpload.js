const multer = require('multer');
const path = require('path');

// Configurando destinação dos arquivos.

const imageStorage = multer.diskStorage({
  destination: function(req, file, cb){
    let folder = ""

    if(req.baseUrl.includes("images")){
      folder = "images";      
    } else if(req.baseUrl.includes("company")){
      folder = "company";
    } else if(req.baseUrl.includes("users")){
      folder = "users";
    } else if(req.baseUrl.includes("products")){
      folder = "products";
    } else if(req.baseUrl.includes("suppliers")){
      folder = "suppliers";
    } else if(req.baseUrl.includes("os")){
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
    fileSize: 1024 * 1024 * 15 // 15MB
  },
  fileFilter: (req, file, cb) => {
    console.log('Resultado da tentativa de envio de arquivo.')
    console.log(file);
    if(file.mimetype === "image/jpeg" || file.mimetype === "image/png" || file.mimetype === "image/jpg" || file.mimetype === "image/png" || file.mimetype === "image/gif" || file.mimetype === "image/webp"){
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error("Formato de arquivo inválido. Use apenas imagens JPG, PNG, GIF ou JPEG."));
    }
  }
})

module.exports = { imageUpload };