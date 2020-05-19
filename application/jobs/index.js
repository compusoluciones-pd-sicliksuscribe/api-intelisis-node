const billMsOrders = require('./billMsOrders');
const billAWSOrders = require('./billAWSOrders');
const actualizar = require('./actualizar');


const start = () => {
  billMsOrders.start();
  actualizar.start();
  billAWSOrders.start();
};
module.exports = {
  start,
};
