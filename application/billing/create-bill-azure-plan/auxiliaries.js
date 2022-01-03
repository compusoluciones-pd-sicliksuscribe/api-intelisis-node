const throwCustomError = require('../../../helpers/factories/errorFactory');
const { getOrdersToBillAzurePlan } = require('../../../data/billing');


const auxiliariesFactory = () => {
  const auxiliaries = {};

  auxiliaries.getOrdersToBill = async () => {
    const ordersResult = await getOrdersToBillAzurePlan();
    if (!ordersResult.data.length) throwCustomError('No hay ordenes Azure Plan para facturar');
    return ordersResult;
  };

  return auxiliaries;
};

module.exports = auxiliariesFactory;
