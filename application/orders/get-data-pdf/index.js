const auxiliariesFactory = require('./auxiliaries');
const throwCustomError = require('../../../helpers/factories/errorFactory');

const {
  getDataPDF,
  responseAPI,
} = auxiliariesFactory();

const getDataPDFOrder = order => {
  return getDataPDF(order.IdOrder)
  .then(responseAPI)
  .catch(error => throwCustomError(error));
}
module.exports = getDataPDFOrder;
