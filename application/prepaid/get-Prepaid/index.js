const auxiliaries = require('./auxiliaries');
const { getLastBalancePrepaid, applyLastBalancePrepaid } = auxiliaries();

const getPrepaid = params => (
    getLastBalancePrepaid(params)
    .then(applyLastBalancePrepaid)
);

module.exports = getPrepaid;
