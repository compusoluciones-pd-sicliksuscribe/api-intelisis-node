const help = require('../helpers/help');
const orders = {};

orders.patch = (fields, IdPedido) => help.d$().update('traPedidos', fields, { IdPedido }).then(data => data).catch(err => err);

orders.updatePaidOrders = ({ ID }) => help.d$().query(`
UPDATE traPedidos SET IdEstatusPedido = 3 WHERE IdFactura = ? AND IdEstatusPedido in (2)`, [ID]);
module.exports = orders;
