const auxiliariesFactory = require('./auxiliaries');
const validation = require('../create-bill/validation');
const auxiliaries = require('../create-bill/auxiliaries');

const billAzureOrders = dependecies => {
  const {
  updateAzureTotal, getOrdersToBill,
} = auxiliariesFactory(dependecies);

  const { billOrders } = auxiliaries();

  const billAllOrders = () =>
  updateAzureTotal()
    .then(() => getOrdersToBill())
    .then(validation.validatePendingBills)
    .then(billOrders)
    .catch(err => err);
  return billAllOrders;
};

module.exports = billAzureOrders;
