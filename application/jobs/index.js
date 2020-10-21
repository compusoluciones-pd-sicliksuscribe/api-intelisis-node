const billMsOrders = require('./billMsOrders');
const billAWSOrders = require('./billAWSOrders');
const actualizar = require('./actualizar');
const azure = require('./billAzure');
const azurePlan = require('./billAzurePlan');


const start = () => {
  billMsOrders.start();
  actualizar.start();
  // billAWSOrders.start();
  azure.start();
  azurePlan.start();
};
module.exports = {
  start,
};
