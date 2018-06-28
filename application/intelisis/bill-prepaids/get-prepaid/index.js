const auxiliaries = require('./auxiliaries');
const { getLastBalancePrepaid } = auxiliaries();

const getOrderPrepaid = params => (
    getLastBalancePrepaid(params)
);

module.exports = getOrderPrepaid;
