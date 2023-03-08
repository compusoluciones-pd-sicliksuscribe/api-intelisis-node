
const billOrders = require('./create-bill');
const billMsOrders = require('./create-ms-bills');
const billAWSOrders = require('./create-aws-bills');
const billAzurePlanOrders = require('./create-bill-azure-plan');
const billMsNCEOrders = require('./create-ms-new-commerce-bills');

module.exports = {
  billOrders,
  billMsOrders,
  billAWSOrders,
  billAzurePlanOrders,
  billMsNCEOrders,
};
