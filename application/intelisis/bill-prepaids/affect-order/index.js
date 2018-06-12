const auxiliaries = require('./auxiliaries');
const { affectOrderIntelisis } = auxiliaries();

const affectOrderPrepaidIntelisis = params => (
    affectOrderIntelisis(params)
);

module.exports = affectOrderPrepaidIntelisis;
