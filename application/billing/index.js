
const billOrders = require('./create-bill');
const billMsOrders = require('./create-ms-bills');
const billAzure = require('./bill-azure');

module.exports = {
  billOrders,
  billMsOrders,
  billAzure,
};
