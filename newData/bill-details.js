const gateway = require('../helpers/gateway')();

const billDetailsTableName = 'bill_details';
const billDetails = {};

billDetails.add = billDetailsBody => (
  gateway.insert(billDetailsTableName, billDetailsBody)
);

module.exports = billDetails;
