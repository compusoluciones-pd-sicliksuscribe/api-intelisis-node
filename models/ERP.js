const help = require('../helpers/help');
const pedidos = require('./pedidos');
const tipoCambio = require('./tipoCambio');
const credito = require('./credito');
const distribuidores = require('./distribuidores');
const productos = require('./productos');

const billing = require('../application/billing');

const ERP = {};

// Mando a llamar todas las funciones de este modelo y regreso promesa
ERP.actualizar = () => (
  billing.createBilling.billAll()
    .then(pedidos.obtenerPagados)
    .then(tipoCambio.obtener)
    .then(credito.actualizarClientes)
    .then(distribuidores.obtener)
    .then(productos.obtener)
    .then(() => help.r$(1, 'ERP Actualizado'))
);

module.exports = ERP;
