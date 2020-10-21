const { CronJob } = require('cron');
const logger = require('../../helpers/logger').debugLogger;
const { billAzurePlan } = require('../billing/');

const onTick = () => {
  logger.info('Running bill AzurePlan Microsoft orders');
  billAzurePlan()
      .then(() => logger.info('Finished alerts with no errors'))
      .catch(error => logger.error('Finished alerts with errors: ', error));
};

const scheduleJob = () => {
  const jobConfig = {
    cronTime: '02 9 07 * *', // corre cada 07 del mes a las 9:02
    // cronTime: '1 * * * *', // corre cada minuto, pruebas
    onTick,
    runOnInit: process.env.TEST,
  };

  return new CronJob(jobConfig);
};

module.exports = scheduleJob();
