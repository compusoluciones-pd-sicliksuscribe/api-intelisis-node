const auxiliariesFactory = require('./auxiliaries');
const validation = require('./validation');
const logger = require('../../../helpers/logger').debugLogger;

const {
  billOrders, selectPendingOrders,
} = auxiliariesFactory();

const billAllOrders = () =>
  selectPendingOrders()
      .then(validation.validatePendingBills)
      .then(billOrders)
      .then(ordersBilled => {
        logger.info('Resultado', ordersBilled);
        return 'Ordenes Facturadas';
      });

module.exports = billAllOrders;
