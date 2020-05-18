const auxiliariesFactory = require('./auxiliaries');
const validation = require('../create-bill/validation');
const logger = require('../../../helpers/logger').debugLogger;

const {
  billOrders, selectPendingAWSOrders,
} = auxiliariesFactory();

const billAllOrders = () =>
selectPendingAWSOrders()
      .then(validation.validatePendingBills)
      .then(billOrders)
      .then(ordersBilled => {
        logger.info('Resultado', ordersBilled);
        return 'Ordenes Facturadas';
      });

module.exports = billAllOrders;
