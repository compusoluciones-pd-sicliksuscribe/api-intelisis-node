const auxiliariesFactory = require('./auxiliaries');
const validation = require('../create-bill/validation');

const {
  selectPendingMsOrders, groupOrdersToBill, completeBillData, billOrders, insertOrdersToBill,
} = auxiliariesFactory();

const billAllOrders = ({ limit }) =>
  selectPendingMsOrders()
      .then(validation.validatePendingBills)
      .then(orders => groupOrdersToBill(orders, limit))
      .then(completeBillData)
      .then(insertOrdersToBill)
      .then(billOrders)
      .catch(err => err);

module.exports = billAllOrders;
