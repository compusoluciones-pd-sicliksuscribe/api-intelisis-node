const enterprises = require('../../../newData/enterprises');

const calculateAvailableCredit = async(enterpriseId) => {
  const { assignedCredit, debt } = await enterprises.getAvailableCredit(enterpriseId);
  return assignedCredit - debt;
};

module.exports = () => ({ calculateAvailableCredit });
