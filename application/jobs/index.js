const billMsOrders = require('./billMsOrders');
const actualizar = require('./actualizar');


const start = () => {
  billMsOrders.start();
  actualizar.start();
};
module.exports = {
  start,
};
