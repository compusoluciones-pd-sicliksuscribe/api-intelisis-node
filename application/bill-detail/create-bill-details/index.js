const { insertBillDetails } = require('./auxiliaries')();

const createBillDetails = (billDetailsBody) => (
  insertBillDetails(billDetailsBody)
);

module.exports = createBillDetails;
