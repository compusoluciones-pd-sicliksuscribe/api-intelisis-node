const auxiliaries = require('./auxiliaries');
const { getClients, upsertClients } = auxiliaries();

const getPrepaid = params => (
  getClients(params)
  .then(upsertClients)
  .catch(err => err)
);

module.exports = getPrepaid;
