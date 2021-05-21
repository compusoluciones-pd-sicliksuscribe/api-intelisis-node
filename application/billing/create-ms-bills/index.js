const auxiliariesFactory = require('./auxiliaries');
const validation = require('../create-bill/validation');

const {
  billOrders, selectPendingMsOrders, groupOrdersToBill, completeBillData, insertOrdersToBill,
  insertBillDetails, updateOrders,
} = auxiliariesFactory();

const billAllOrders = ({ limit }) =>
  selectPendingMsOrders()
      .then(validation.validatePendingBills)
      .then(orders => groupOrdersToBill(orders, limit))
      .then(completeBillData)
      .then(insertOrdersToBill)
      .then(billOrders)
      .then(insertBillDetails)
      .then(updateOrders)
      .catch(err => err);

module.exports = billAllOrders;
