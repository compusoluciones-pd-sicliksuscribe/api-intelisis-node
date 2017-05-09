'use strict';

const help = require('../helpers/help');
const facturas = require('./facturas');
const pedidos = require('./pedidos');
const tipoCambio = require('./tipoCambio');
const credito = require('./credito');
const distribuidores = require('./distribuidores');
const productos = require('./productos');
const Q = require('q');

const billing = require('../application/billing');

const ERP = {};

// Mando a llamar todas las funciones de este modelo y regreso promesa
ERP.actualizar = () => {
  const deferred = Q.defer();
  billing.createBilling.billAll()
    .then(pedidos.obtenerPagados)
    .then(tipoCambio.obtener)
    .then(credito.actualizarClientes)
    .then(distribuidores.obtener)
    .then(productos.obtener)
    .catch(error => deferred.reject(error))
    .done(() => {
      global.ActualizandoERP = 0;
      return deferred.resolve(help.r$(1, 'ERP Actualizado'))
    });
  return deferred.promise;
};

module.exports = ERP;
