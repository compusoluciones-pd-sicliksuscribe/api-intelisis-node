const gateway = require('../helpers/help').d$();

const TABLE_NAME = 'catTipoCambio';

const exchangeRates = {};

const exchangeRatesSchema = {
  Dolar: 1.00,
  DolarMs: 1.00,
  DolarFacturacion: 1.00,
  DolarPagos: 1.00,
};

exchangeRates.insert = (exchangeRatesToInsert = exchangeRatesSchema) => {
  const date = { Fecha: gateway.now() };
  return gateway.insert(TABLE_NAME, Object.assign({}, exchangeRatesToInsert, date));
};

module.exports = exchangeRates;
