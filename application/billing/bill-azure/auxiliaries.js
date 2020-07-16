const request = require('request-promise');
const moment = require('moment');
const throwCustomError = require('../../../helpers/factories/errorFactory');
const billingData = require('../../../data/billing');
const configData = require('../../../config');
const { MICROSOFT_MONTH } = require('../../../helpers/enums/renewal-schema-types');

const getDate = () => {
  let invoiceDate = '';
  const date = moment();
  if (date.date() >= 22) {
    invoiceDate = date.clone().set('date', 22).format('YYYY-MM-DD');
  } else {
    invoiceDate = date.clone().subtract(1, 'month').set('date', 22).format('YYYY-MM-DD');
  }
  return invoiceDate;
};

const defaults = {
  billing: billingData,
  config: configData,
  dayOfBilling: getDate,
  schemaType: { schema: MICROSOFT_MONTH },
  azureUrl: 'updateAzureToBill',
};

const auxiliariesFactory = (dependencies = defaults) => {
  const { billing, config, dayOfBilling, schemaType, azureUrl } = dependencies;
  const {
    getOrdersToBillAzure,
  } = billing;

  const azureProduct = schemaType.schema;

  const buildRequest = () => ({
    method: 'POST',
    uri: `${config.ApiMS}subscriptions/${azureUrl}`,
    json: true,
  });

  const auxiliaries = {};

  auxiliaries.updateAzureTotal = async () => {
    const requestData = buildRequest();
    return request(requestData);
  };

  auxiliaries.getOrdersToBill = async () => {
    const date = dayOfBilling();
    const ordersResult = await getOrdersToBillAzure(azureProduct, date);
    if (!ordersResult.data.length) throwCustomError('No hay pedidos para facturar');
    return ordersResult;
  };

  return auxiliaries;
};

module.exports = auxiliariesFactory;
