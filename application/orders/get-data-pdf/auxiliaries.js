const intelisis = require('../../intelisis');

const auxiliariesFactory = () => {
  const auxiliaries = { };

  auxiliaries.getDataPDF = IdOrder => intelisis.getSale(IdOrder);
  auxiliaries.responseAPI = data => ({success: 1, message: 'Factura encontrada ', data: JSON.parse(data) });

  return auxiliaries;
};

module.exports = auxiliariesFactory;
