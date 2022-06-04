const auxiliariesFactory = require('./auxiliaries');
const validation = require('../create-bill/validation');

const {
  billOrders, selectPendingMsNCEOrders, groupOrdersToBill, completeBillData, insertOrdersToBill,
  insertBillDetails, updateOrders,
} = auxiliariesFactory();

const billNCEOrders = ({ limit }) =>
  selectPendingMsNCEOrders()
      .then(validation.validatePendingBills)
      .then(orders => groupOrdersToBill(orders, limit))
      .then(completeBillData)
      .then(insertOrdersToBill)
      .then(billOrders)
      .then(insertBillDetails)
      .then(updateOrders)
      .catch(err => err);

module.exports = billNCEOrders;
