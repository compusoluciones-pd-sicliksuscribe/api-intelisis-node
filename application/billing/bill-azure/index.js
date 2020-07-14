const auxiliariesFactory = require('./auxiliaries');
const validation = require('../create-bill/validation');
const auxiliaries = require('../create-bill/auxiliaries');

const {
  updateAzureTotal, getOrdersToBill,
} = auxiliariesFactory();

const { billOrders } = auxiliaries();

const billAllOrders = () =>
  updateAzureTotal()
    .then(() => getOrdersToBill())
    .then(validation.validatePendingBills)
    .then(billOrders)
    .catch(err => err);

module.exports = billAllOrders;
