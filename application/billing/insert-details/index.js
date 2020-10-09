const auxiliariesFactory = require('./auxiliaries');
const logger = require('../../../helpers/logger').debugLogger;

const {
    updateDatails,
} = auxiliariesFactory();

const insertDatails = orders =>
    updateDatails(orders)
      .then(ordersBilled => {
        logger.info('Resultado', ordersBilled);
        return 'Detalles insertados';
      });

module.exports = insertDatails;
