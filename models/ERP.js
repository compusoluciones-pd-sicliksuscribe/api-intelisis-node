const help = require('../helpers/help');
const pedidos = require('../application/orders');
const credito = require('./credito');
const distribuidores = require('./distribuidores');
const productos = require('./productos');

const billing = require('../application/billing');
const exchangeRate = require('../application/syncronize-exchange-rates')();
const getPrepaid = require('../application/prepaid/get-Prepaid');

const ERP = {};

// Mando a llamar todas las funciones de este modelo y regreso promesa
ERP.actualizar = () => (
  billing.billOrders()
    .then(pedidos.updateOrderStatus)
    .then(exchangeRate.syncronizeExchangeRates)
    .then(credito.actualizarClientes)
    .then(distribuidores.obtener)
    .then(productos.obtener)
    .then(getPrepaid)
    .then(() => help.r$(1, 'ERP Actualizado'))
);

module.exports = ERP;
