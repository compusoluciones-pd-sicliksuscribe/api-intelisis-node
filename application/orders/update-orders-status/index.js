const auxiliariesFactory = require('./auxiliaries');
const throwCustomError = require('../../../helpers/factories/errorFactory');

const {
    paidOrders,
    pendingPay,
} = auxiliariesFactory();

const updatePaidOrders = () =>
  pendingPay()
    .then(paidOrders)
    .catch(error => throwCustomError(error));

module.exports = updatePaidOrders;
