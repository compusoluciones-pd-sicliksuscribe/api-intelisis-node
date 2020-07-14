const request = require('request-promise');
const moment = require('moment');
const throwCustomError = require('../../../helpers/factories/errorFactory');
const billingData = require('../../../data/billing');
const configData = require('../../../config');
const { MICROSOFT_MONTH } = require('../../../helpers/enums/renewal-schema-types');

const defaults = {
  billing: billingData,
  config: configData,
  dayOfBilling: { day: 22 },
  schemaType: { schema: MICROSOFT_MONTH },
};

const auxiliariesFactory = (dependencies = defaults) => {
  const { billing, config, dayOfBilling, schemaType } = dependencies;
  const {
    getOrdersToBillAzure,
  } = billing;

  const DAY = dayOfBilling.day;
  const azureProduct = schemaType.schema;

  const buildRequest = () => ({
    method: 'POST',
    uri: `${config.ApiMS}subscriptions/updateAzureToBill`,
    json: true,
  });

  const getDate = () => {
    let invoiceDate = '';
    const date = moment();
    if (date.date() >= DAY) {
      invoiceDate = date.clone().set('date', DAY).format('YYYY-MM-DD');
    } else {
      invoiceDate = date.clone().subtract(1, 'month').set('date', DAY).format('YYYY-MM-DD');
    }
    return invoiceDate;
  };

  const auxiliaries = {};

  auxiliaries.updateAzureTotal = async () => {
    const requestData = buildRequest();
    return request(requestData);
  };

  auxiliaries.getOrdersToBill = async () => {
    const date = getDate();
    const ordersResult = await getOrdersToBillAzure(azureProduct, date);
    if (!ordersResult.data.length) throwCustomError('No hay pedidos para facturar');
    return ordersResult;
  };

  return auxiliaries;
};

module.exports = auxiliariesFactory;
