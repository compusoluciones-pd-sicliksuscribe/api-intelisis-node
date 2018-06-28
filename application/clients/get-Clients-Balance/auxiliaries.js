const config = require('../../../config');
const { requestPromise } = require('../../../helpers/logged-request');
const enterpriseData = require('../../../data/enterprise');
const logger = require('../../../helpers/logger').debugLogger;

const defaultDependencies = {
  enterprise: enterpriseData,
};

const getClientsBalance = (dependencies = defaultDependencies) => {
  const { enterprise } = dependencies;

  const applyLastBalance = ({ transferencia, IdERP }) => (
    enterprise.put({ transferencia, IdERP })
      .then(() => {
        logger.info('Prepaid Balance Updated');
        return {
          success: 1,
          message: 'Información actualizada.',
          data: { transferencia, IdERP },
        };
      })
  );

    /*
    Ruta Api C# de Intelisis
    /Anticipos/G000000
    */

  const getBalance = id => ({
    method: 'GET',
    uri: `${config.ApiErp}Anticipos/${id}`,
    headers: {
      token: config.TokenERP,
    },
  });

  const getLastBalancePrepaid = ({ id }) => {
    const requestOptions = getBalance(id);
    return requestPromise(requestOptions)
      .then(transferencia => ({ transferencia, IdERP: id }));
  };

  return {
    applyLastBalance,
    getLastBalancePrepaid,
  };
};

module.exports = getClientsBalance;
