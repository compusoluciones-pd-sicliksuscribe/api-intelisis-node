/* eslint-disable no-unused-vars */
'use strict';
const { CronJob } = require('cron');
const logger = require('../../helpers/logger').debugLogger;
const orders = require('../../application/orders');
const credit = require('../../models/credito');
const enterprise = require('../../models/distribuidores');
const products = require('../../models/productos');
const billing = require('../../application/billing');
const exchangeRate = require('../../application/syncronize-exchange-rates')();
const getPrepaid = require('../../application/prepaid/get-Prepaid');

const run = {};

run.start = () => {
  const bill = new CronJob('*/30 * * * *', () => {
    logger.info('Job facturación');
    billing.billOrders();
  }, null, true, null);

  const orderStatus = new CronJob('05 03 * * *', () => {
    logger.info('Job facturas pagadas');
    orders.updateOrderStatus();
  }, null, true, null);

  const exchange = new CronJob('10 * * * *', () => {
    logger.info('Job tipo de cambio');
    exchangeRate.syncronizeExchangeRates();
  }, null, true, null);

  const creditEnterprise = new CronJob('05 04 * * *', () => {
    logger.info('Job crédito por empresa');
    credit.actualizarClientes();
  }, null, true, null);

  const enterpriseInfo = new CronJob('20 */02 * * *', () => {
    logger.info('Job empresas');
    enterprise.obtener();
  }, null, true, null);

  const productsInfo = new CronJob('15 */08 * * *', () => {
    logger.info('Job productos');
    products.obtener();
  }, null, true, null);

  const prepaid = new CronJob('40 */04 * * *', () => {
    logger.info('Job prepago');
    getPrepaid();
  }, null, true, null);
};

module.exports = run;
