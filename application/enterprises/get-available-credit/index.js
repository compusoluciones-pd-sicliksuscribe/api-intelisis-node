const { calculateAvailableCredit } = require('./auxiliaries')();

const getAvailableCredit = (enterpriseId) => (
  calculateAvailableCredit(enterpriseId)
  .then(availableCredit => ({ availableCredit }))
);

module.exports = getAvailableCredit;
