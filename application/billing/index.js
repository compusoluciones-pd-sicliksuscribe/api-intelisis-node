
const billOrders = require('./create-bill');
const billMsOrders = require('./create-ms-bills');
const billAWSOrders = require('./create-aws-bills');

module.exports = {
  billOrders,
  billMsOrders,
  billAWSOrders,
};
