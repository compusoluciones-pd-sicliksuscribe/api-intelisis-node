
const billOrders = require('./create-bill');
const billMsOrders = require('./create-ms-bills');
const billAWSOrders = require('./create-aws-bills');
const billOpenpayOrders = require('./create-bill-openpay');

module.exports = {
  billOrders,
  billMsOrders,
  billAWSOrders,
  billOpenpayOrders,
};
