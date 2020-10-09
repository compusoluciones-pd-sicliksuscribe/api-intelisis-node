
const billOrders = require('./create-bill');
const billMsOrders = require('./create-ms-bills');
const billAWSOrders = require('./create-aws-bills');
const insertDetails = require('./insert-details');

module.exports = {
  billOrders,
  billMsOrders,
  billAWSOrders,
  insertDetails,
};
