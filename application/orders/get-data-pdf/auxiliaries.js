const intelisis = require('../../intelisis');

const auxiliariesFactory = () => {
  const auxiliaries = { };

  auxiliaries.getDataPDF = IdOrder => intelisis.getSale(IdOrder);
  auxiliaries.responseAPI = data => ({'Success': 1, 'Message': 'Factura encontrada ', 'Data': JSON.parse(data) });

  return auxiliaries;
};

module.exports = auxiliariesFactory;
