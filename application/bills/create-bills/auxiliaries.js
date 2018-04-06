const bills = require('../../../newData/bills');

const insertBill = async(billBody) => (
  bills.add(billBody)
);

module.exports = () => ({ insertBill });
