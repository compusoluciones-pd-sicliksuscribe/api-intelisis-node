'use strict';

const CronJob = require('cron').CronJob;
const ERP = require('./ERP');
const help = require('../helpers/help');

const run = {};

run.start = () => {
  const job = new CronJob('00 00 */01 * * * ', () => {
    console.log('Iniciando Job a las: ' + help.d$().now().toString());
    ERP.actualizar()
      .catch(error => console.log(help.r$(0, error)))
      .done(resultActualizar => console.log(help.r$(1, 'ERP Actualizado a las: ' + help.d$().now().toString(), resultActualizar)));
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
