const auxiliariesFactory = require('./auxiliaries');
const validation = require('../create-bill/validation');

const {
  billOrders, selectPendingMsOrders, groupOrdersToBill, completeBillData, insertOrdersToBill,
  insertBillDetails, updateOrders,
} = auxiliariesFactory();

const billAllOrders = () =>
  selectPendingMsOrders()
      .then(validation.validatePendingBills)
      .then(groupOrdersToBill)
      .then(completeBillData)
      .then(insertOrdersToBill)
      .then(billOrders)
      .then(insertBillDetails)
      .then(updateOrders)
      .catch(err => err);

module.exports = billAllOrders;
