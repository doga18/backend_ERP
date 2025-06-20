const gennerateNextOsNumber = async() => {
  const lastOs = await Os.findOne({
    order: [['created_at', 'DESC']], // Busca a última OS criada.
    attributes: ['os_number'], // Busca o numero da OS.
  })
  let nextNumber = 1;
  if (lastOs) {
    const lastOsNumber = parseInt(lastOs.os_number) + 1; // Converte o último os_number para inteiro.    
    if(!isNaN(lastOsNumber)){
      nextNumber = lastOsNumber + 1; // Incrementa o último número.
    }
  }
  // Formata o número para ter sempre 4 dígitos (ou mais, se necessário)
  return nextNumber.toString().padStart(4, '0');
}

