const config = require('../../../config');
const { requestPromise } = require('../../../helpers/logged-request');
const { getIdEmpresa, insertCXCAgente } = require('../../../data/enterprise');
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
    pIdIBMDist: client.IdIBM,
    pCondicionERP: client.CondicionERP,

  });

  const upsertCXCAgente = async client => {
    const { IdEmpresa } = await getIdEmpresa(client.IdERP);
    return insertCXCAgente(client, IdEmpresa);
  };

  const upsertClients = async clientsData => {
    const updateEnterprises = clientsData.map(async client => {
      const clientBody = buildClientBody(client);
      return help.d$().callStoredProcedure('traEmpresas_insert', clientBody)
          .catch(error => error);
    });
    await Promise.all(updateEnterprises);
    return clientsData;
  };

  const upsertCXCAgents = async clientsData => {
    const updateCXCAgents = clientsData.map(async client => upsertCXCAgente(client));
    await Promise.all(updateCXCAgents);
    return clientsData;
  };

  return {
    getClients,
    upsertClients,
    upsertCXCAgents,
  };
};

module.exports = createOrder;
