const auxiliaries = require('./auxiliaries');
const { getLastBalancePrepaid, applyLastBalance } = auxiliaries();

const getPrepaid = params => (
  getLastBalancePrepaid(params)
  .then(applyLastBalance)
);

module.exports = getPrepaid;
