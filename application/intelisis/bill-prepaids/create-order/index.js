const auxiliaries = require('./auxiliaries');
const { applyOrderBalance } = auxiliaries();

const applyOrderPrepaid = params => (
   applyOrderBalance(params)
);

module.exports = applyOrderPrepaid;
