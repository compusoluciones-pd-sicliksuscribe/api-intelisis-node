const billMsOrders = require('./billMsOrders');
const actualizar = require('./actualizar');
const azure = require('./billAzure');


const start = () => {
  billMsOrders.start();
  actualizar.start();
  azure.start();
};
module.exports = {
  start,
};
