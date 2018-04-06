const { insertBill } = require('./auxiliaries')();

const createBill = async(billBody) => {
  const billId = await insertBill(billBody);
  return { bill_id: billId.insertId };
};

module.exports = createBill;
