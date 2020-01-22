const { CronJob } = require('cron');
const logger = require('../../helpers/logger').debugLogger;
const { billMsOrders } = require('../billing');

const onTick = () => {
  logger.info('Running bill Microsoft orders');
  billMsOrders()
    .then(() => logger.info('Finished alerts with no errors'))
    .catch(error => logger.error('Finished alerts with errors: ', error));
};

const scheduleJob = () => {
  const jobConfig = {
    cronTime: '10 0 22 * *', // corre cada 22 del mes a las 12:10
    // cronTime: '1 * * * *', // corre cada minuto, pruebas
    onTick,
    runOnInit: process.env.TEST,
  };

  return new CronJob(jobConfig);
};

module.exports = scheduleJob();
