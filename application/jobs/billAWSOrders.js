const { CronJob } = require('cron');
const logger = require('../../helpers/logger').debugLogger;
const { billAWSOrders } = require('../billing');

const onTick = () => {
  logger.info('Running bill AWS orders');
  billAWSOrders()
    .then(() => logger.info('Finished bill orders no errors'))
    .catch(error => logger.error('Finished bill orders with errors: ', error));
};

const scheduleJob = () => {
  const jobConfig = {
    cronTime: '30 * * * *', // corre cada 30 minutos
    onTick,
    runOnInit: process.env.TEST,
  };

  return new CronJob(jobConfig);
};

module.exports = scheduleJob();
