const { CronJob } = require('cron');
const logger = require('../../helpers/logger').debugLogger;
const updateIdBillAWS = require('../orders/update-id-bill-aws/index');

const onTick = () => {
  logger.info('Running update orders AWS');
  updateIdBillAWS()
    .then(() => logger.info('Finished update orders AWS no errors'))
    .catch(error => logger.error('Finished update orders AWS with errors: ', error));
};

const scheduleJob = () => {
  const jobConfig = {
    cronTime: '0 1 * * *', // corre cada día a las 01:00 HRS
    onTick,
    runOnInit: process.env.TEST,
  };

  return new CronJob(jobConfig);
};

module.exports = scheduleJob();
