const billMsOrders = require('./billMsOrders');
const billAWSOrders = require('./billAWSOrders');
const actualizar = require('./actualizar');
const updateBillAWS = require('./updateOrderAWS')


const start = () => {
  billMsOrders.start();
  actualizar.start();
  updateBillAWS.start();
  // billAWSOrders.start();
};
module.exports = {
  start,
};
