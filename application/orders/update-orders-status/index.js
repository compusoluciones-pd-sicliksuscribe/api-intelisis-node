const auxiliariesFactory = require('./auxiliaries');
const throwCustomError = require('../../../helpers/factories/errorFactory');

const {
    selectPaidOrders,
    updateOrders,
} = auxiliariesFactory();

const updatePaidOrders = () =>
  selectPaidOrders()
    .then(updateOrders)
    .catch(error => throwCustomError(error));

module.exports = updatePaidOrders;
