const gateway = require('../helpers/gateway')();

const billTableName = 'bills';
const bills = {};

bills.add = billsBody => (
  gateway.insert(billTableName, billsBody)
);

module.exports = bills;
