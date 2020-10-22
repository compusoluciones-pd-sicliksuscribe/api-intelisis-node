const auxiliaries = require('./auxiliaries');
const { getClients, upsertClients, upsertCXCAgents } = auxiliaries();

const getPrepaid = params => (
  getClients(params)
  .then(upsertClients)
  .then(upsertCXCAgents)
  .catch(err => err)
);

module.exports = getPrepaid;
