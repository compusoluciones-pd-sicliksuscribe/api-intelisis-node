const { requestPromise } = require('../../helpers/logged-request');
const { getLatestExchangeRatesERP } = require('./auxiliaries');
const exchangeRatesData = require('../../data/exchange-rates');
const logger = require('../../helpers/logger').debugLogger;

const defaultDependencies = {
  requestPromise,
  exchangeRates: exchangeRatesData,
};

const getExchangeRateSyncronizer = (dependencies = defaultDependencies) => {
  const getLatestExchangeRates = () => getLatestExchangeRatesERP(dependencies.requestPromise);

  const syncronizeExchangeRates = () => {
    getLatestExchangeRates()
      .then(dependencies.exchangeRates.insert)
      .then(() => logger.info('Exchange Rate updated'))
      .catch(error => logger.error(error));
  };

  return ({
    getLatestExchangeRates,
    syncronizeExchangeRates,
  });
};

module.exports = getExchangeRateSyncronizer;
