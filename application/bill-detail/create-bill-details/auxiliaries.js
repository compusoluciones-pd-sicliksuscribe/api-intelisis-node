const billDetails = require('../../../newData/bill-details');

const insertBillDetails = async(billDetailsBody) => (
  billDetails.add(billDetailsBody)
);

module.exports = () => ({ insertBillDetails });
