const path = require('path');
const fs = require('fs');

const tryDeleteFile = (file) => {
  console.log('Tentando deletar o arquivo: ', file);
  if(!file){
    console.log('Não foi possível deletar o arquivo, pois ele não existe.');
    return false;
  }
  try {
    const tryDelete = path.join('.', file);
    fs.rm(tryDelete, (err) => {
      if (err) {
        console.log(`Erro ao deletar o arquivo ${file}`)
        console.error(err);
        return false;
      }
      console.log(`Arquivo ${file} deletado com sucesso.`);
      return true;
    })
  } catch (error) {
    console.log(`Erro ao deletar o arquivo ${file}, para verificar o erro, descomente a linha.`)
    // console.error(error);
    return false;
  }
}

module.exports = {
  tryDeleteFile,
}