'use strict';

const CronJob = require('cron').CronJob;
const ERP = require('./ERP');
const help = require('../helpers/help');
const logger = require('../helpers/logger').debugLogger;

const run = {};

run.start = () => {
  const job = new CronJob('00 00 */01 * * * ', () => {
    logger.info('starting job');
    ERP.actualizar()
      .then((resultActualizar) => {
        const result = help.r$(1, 'ERP Actualizado a las: ' + help.d$().now().toString(), resultActualizar);
        logger.info('ERP Updated ', resultActualizar);
        return result;
      })
      .catch(logger.error);
  }, null, true, null);
};

module.exports = run;

/*
// // https://www.npmjs.com/package/cron

// // Cron Ranges
// //
// // When specifying your cron values you'll need to make sure that your values fall within the ranges.
// // For instance, some cron's use a 0-7 range for the day of week where both 0 and 7 represent Sunday. We do not.
// // •Seconds: 0-59
// // •Minutes: 0-59
// // •Hours: 0-23

// // •Day of Month: 1-31
// // •Months: 0-11
// // •Day of Week: 0-6
*/
