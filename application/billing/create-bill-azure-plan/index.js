const { getOrdersToBill } = require('./auxiliaries')();
const validation = require('../create-bill/validation');
const { billOrders } = require('../create-bill/auxiliaries')();

const billAzureOrders = () =>
  getOrdersToBill()
    .then(validation.validatePendingBills)
    .then(billOrders)
    .catch(err => err);

module.exports = billAzureOrders;
