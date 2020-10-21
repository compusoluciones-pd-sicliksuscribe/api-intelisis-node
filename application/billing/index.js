
const moment = require('moment');
const billOrders = require('./create-bill');
const billMsOrders = require('./create-ms-bills');
const billAWSOrders = require('./create-aws-bills');
const billOpenpayOrders = require('./create-bill-openpay');
const billAzure = require('./bill-azure');


const billingData = require('../../data/billing');
const configData = require('../../config');
const { AZURE_PLAN } = require('../../helpers/enums/renewal-schema-types');

const getDate = () => {
  const date = moment().subtract(1, 'month');
  const endOfMonth = moment(date).endOf('month').format('YYYY-MM-DD');
  return endOfMonth;
};

const azurePlanDependecies = {
  billing: billingData,
  config: configData,
  dayOfBilling: getDate,
  schemaType: { schema: AZURE_PLAN },
  azureUrl: 'updateAzurePlanToBill',
};

module.exports = {
  billOrders,
  billMsOrders,
  billAWSOrders,
  billOpenpayOrders,
  billAzureGlobal: billAzure(),
  billAzurePlan: billAzure(azurePlanDependecies),
};
