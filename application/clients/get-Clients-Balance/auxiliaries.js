const config = require('../../../config');
const { requestPromise } = require('../../../helpers/logged-request');
const enterpriseData = require('../../../data/enterprise');
const logger = require('../../../helpers/logger').debugLogger;

const defaultDependencies = {
  enterprise: enterpriseData,
};

const getClientsBalance = (dependencies = defaultDependencies) => {
  const { enterprise } = dependencies;

  const applyLastBalance = async ({ transferencia, IdERP, moneda }) => {
    if (moneda === 'Dolares') {
      return enterprise.updateTransferenciaDolares(transferencia, IdERP)
      .then(() => {
        logger.info('Prepaid Balance Updated');
        return {
          success: 1,
          message: 'Información actualizada. Transferencia dolares',
          data: { transferencia, IdERP },
        };
      });
    }
    return enterprise.put({ transferencia, IdERP })
      .then(() => {
        logger.info('Prepaid Balance Updated');
        return {
          success: 1,
          message: 'Información actualizada. Transferencia pesos',
          data: { transferencia, IdERP },
        };
      });
  };

    /*
    Ruta Api C# de Intelisis
    /Anticipos/G000000
    */

  const getBalance = (id, moneda) => ({
    method: 'GET',
    uri: `${config.ApiErp}Anticipos/${id}/${moneda}`,
    headers: {
      token: config.TokenERP,
    },
  });

  const getLastBalancePrepaid = ({ id, moneda }) => {
    const requestOptions = getBalance(id, moneda);
    return requestPromise(requestOptions)
      .then(transferencia => ({ transferencia, IdERP: id, moneda }));
  };

  return {
    applyLastBalance,
    getLastBalancePrepaid,
  };
};

module.exports = getClientsBalance;
