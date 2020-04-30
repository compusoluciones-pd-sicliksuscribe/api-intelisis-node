const auxiliaries = require('./auxiliaries');
const { getLastBalancePrepaid, applyLastBalance, getOrdersWithoutBill } = auxiliaries();

const getPrepaid = params => (
  getLastBalancePrepaid(params)
  .then(getOrdersWithoutBill)
  .then(applyLastBalance)
);

module.exports = getPrepaid;
