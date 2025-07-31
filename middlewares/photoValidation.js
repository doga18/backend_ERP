const { body, param } = require('express-validator');

const photoValidation = () => {
  return [
    body("title")
      .notEmpty()
      .equals("undefined")
      .withMessage("O título é obrigatório")
      .isString()
      .withMessage("O título deve ser uma string")
      .isLength({ min: 5 })
      .withMessage("O título deve ter pelo menos 5 caracters")
      .isLength({ max: 30 })
      .withMessage("O título deve ter no máximo 30 caracters"),
    body("description")
      .notEmpty()
      .equals("undefined")
      .withMessage("A descrição é obrigatória")
      .isString()
      .withMessage("A descrição deve ser uma string")
      .isLength({ min: 10 })
      .withMessage("A descrição deve ter pelo menos 10 caracters")
      .isLength({ max: 500 })
      .withMessage("A descrição deve ter no máximo 500 caracters"),
    body("image").custom((value, {req}) => {
      if(!req.file){
        throw new Error("A imagem é obrigatória");
      }
      return true;
    })

  ];
}

const imagePerfilValidation = () => {
  return [
    body("imagePerfil")
      .custom((value, {req}) => {
        if(!req.file){
          throw new Error("A imagem é obrigatória");
        }
        return true;
      })
  ]
}

const imagesOsValidation = () => {
  return [
    body("images")
      .custom((value, {req}) => {
        if(!req.files || req.files.length === 0){
          throw new Error("Ao menos uma imagem é obrigatória...");
        }
        return true;
      })
  ]
}


module.exports = {
  photoValidation,
  imagePerfilValidation,
  imagesOsValidation
}