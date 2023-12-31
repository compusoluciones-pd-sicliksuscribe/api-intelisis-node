const auxiliariesFactory = require('./auxiliaries');
const validation = require('../create-bill/validation');

const {
  billOrders, selectPendingMsNCEOrders, groupOrdersToBill, completeBillData, insertOrdersToBill,
} = auxiliariesFactory();

const billNCEOrders = ({ limit, renovationType }) =>
  selectPendingMsNCEOrders(renovationType)
      .then(validation.validatePendingBills)
      .then(orders => groupOrdersToBill(orders, limit))
      .then(completeBillData)
      .then(insertOrdersToBill)
      .then(billOrders)
      .catch(err => err);

module.exports = billNCEOrders;
