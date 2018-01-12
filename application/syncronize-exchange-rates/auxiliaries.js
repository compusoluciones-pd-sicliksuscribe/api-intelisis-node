const config = require('../../config');

const getOptions = () => ({
  method: 'GET',
  uri: `${config.ApiErp}TipoCambio`,
  headers: {
    token: config.TokenERP,
  },
});

const getLatestExchangeRatesERP = (requestPromise) => {
  const requestOptions = getOptions();
  return requestPromise(requestOptions)
    .then(JSON.parse)
    .then(exchangeRates => exchangeRates[0]);
};

module.exports = {
  getLatestExchangeRatesERP,
};
