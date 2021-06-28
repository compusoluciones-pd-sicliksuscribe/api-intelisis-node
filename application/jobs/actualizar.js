const { CronJob } = require('cron');
const logger = require('../../helpers/logger').debugLogger;
const { actualizar } = require('../../models/ERP');

const onTick = () => {
  logger.info('Running actualizar job');
  actualizar()
    .then(() => logger.info('Finished job with no errors'))
    .catch(error => logger.error('Finished job with errors: ', error));
};

const scheduleJob = () => {
  const jobConfig = {
    cronTime: '30 * * * *', // corre cada 30 minutos
    onTick,
  };

  return new CronJob(jobConfig);
};

module.exports = scheduleJob();
