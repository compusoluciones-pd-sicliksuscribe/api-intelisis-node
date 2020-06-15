const config = require('../../../config');
const { requestPromise } = require('../../../helpers/logged-request');
const help = require('../../../helpers/help');

const createOrder = () => {
  const buildRequest = () => ({
    method: 'GET',
    uri: `${config.ApiErp}Cliente`,
    headers: {
      token: config.TokenERP,
    },
    json: true,
  });

  const getClients = () => {
    const requestOptions = buildRequest();
    return requestPromise(requestOptions);
  };

  const buildClientBody = client => ({
    pIdERP: client.IdERP,
    pRFC: client.RFC,
    pNombreEmpresa: client.NombreEmpresa,
    pDireccion: client.Direccion,
    pCiudad: client.Ciudad,
    pEstado: client.Estado,
    pCodigoPostal: client.CodigoPostal,
    pNombreContacto: null,
    pApellidosContacto: null,
    pCorreoContacto: null,
    pTelefonoContacto: null,
    pCredito: null,
    pZonaImpuesto: client.ZonaImpuesto,
    pLada: null,
    IdMicrosoftUF: null,
    IdMicrosoftDist: client.IdMicrosoft,
    IdAutodeskUF: null,
    IdAutodeskDist: client.IdAutodesk,
    ContratoAutodeskUF: null,
    DominioMicrosoftUF: null,
  });

  const upsertClients = async clientsData => Promise.all(clientsData.map(async client => {
    const clientBody = buildClientBody(client);
    return help.d$().callStoredProcedure('traEmpresas_insert', clientBody)
        .catch(error => error);
  }));

  return {
    getClients,
    upsertClients,
  };
};

module.exports = createOrder;
