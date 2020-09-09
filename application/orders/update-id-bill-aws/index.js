const auxiliariesFactory = require('./auxiliaries');
const throwCustomError = require('../../../helpers/factories/errorFactory');

const {
  selectPendingOrders,
  updateBill,
} = auxiliariesFactory();

const updateIdBillAWS = () =>
selectPendingOrders()
    .then(updateBill)
    .catch(error => throwCustomError(error));

module.exports = updateIdBillAWS;
