const auxiliaries = require('./auxiliaries');
const { affectOrderIntelisis } = auxiliaries();

const affectOrderPrepaidIntelisis = (params, order) => (
    affectOrderIntelisis(params, order)
);

module.exports = affectOrderPrepaidIntelisis;
