const help = require('../helpers/help');
const orders = {};

orders.patch = (order, IdPedido) => help.d$().update('traPedidos', order, { IdPedido }).then(data => data).catch(err => err);

module.exports = orders;
