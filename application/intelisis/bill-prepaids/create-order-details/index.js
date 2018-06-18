const auxiliaries = require('./auxiliaries');
const { applyOrderDetailsBalance } = auxiliaries();

const applyOrderDetailsPrepaid = params => (
    applyOrderDetailsBalance(params)
);

module.exports = applyOrderDetailsPrepaid;
