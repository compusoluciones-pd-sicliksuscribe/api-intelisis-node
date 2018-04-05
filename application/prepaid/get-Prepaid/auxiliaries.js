const config = require('../../../config');
const { requestPromise } = require('../../../helpers/logged-request');
const enterpriseData = require('../../../data/enterprise');

const defaultDependencies = {
  enterprise: enterpriseData,
};

const getClientsPrepaidBalance = (dependencies = defaultDependencies) => {
  const { enterprise } = dependencies;

  const applyLastBalancePrepaid = resultRequest => Promise.all(
    resultRequest.map(({ Saldo, Cliente }) => enterprise.put({ transferencia: Saldo, IdERP: Cliente }))
    // .then(() => {
    //   logger.info('La información ha sido actualizada.');
    //   return {
    //     success: 1,
    //     message: 'Información Actualizada.',
    //     data: { resultRequest },
    //   };
    // })
  );

  const getOptions = () => ({
    method: 'GET',
    uri: `${config.ApiErp}/Prepaids`,
    headers: {
      token: config.TokenERP,
    },
    json: true,
  });

  const getLastBalancePrepaid = () => {
    const requestOptions = getOptions();
    return requestPromise(requestOptions);
  };

  return {
    applyLastBalancePrepaid,
    getLastBalancePrepaid,
  };
};

module.exports = getClientsPrepaidBalance;
