
const billOrders = require('./create-bill');
const billMsOrders = require('./create-ms-bills');
const billAWSOrders = require('./create-aws-bills');
const billAzurePlanOrders = require('./create-bill-azure-plan');

module.exports = {
  billOrders,
  billMsOrders,
  billAWSOrders,
  billAzurePlanOrders,
};
