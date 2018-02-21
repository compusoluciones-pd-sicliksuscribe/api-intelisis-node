'use strict';

const help = require('../helpers/help');
const config = require('../config');
const { request } = require('../helpers/logged-request');
const Q = require('q');

const pedidos = {};

// Consulta en el API de Intelisis la lista de los pedidos o facturas que ya fueron pagadas
pedidos.obtenerPagados = (dat) => {
  console.log(dat);
  const deferred = Q.defer();
  request.get(config.ApiErp + 'Venta',
    { headers: { token: config.TokenERP } }, (error, response, body) => {
      if (body) {
        const json = JSON.parse(body);
        pedidos.barrerPagados(json)
          .catch(errorBarrerPagados => deferred.reject(errorBarrerPagados))
          .done(() => deferred.resolve(help.r$(1, 'Facturas pagadas obtenidas', body)));
      } else { deferred.reject(help.r$(0, 'Error con el body al traer las facturas pagadas')); }
    });
  return deferred.promise;
};

// Barre los pedidos pagados para luego ser actualizados en la base de datos
pedidos.barrerPagados = (pagados) => {
  const deferred = Q.defer();
  if (pagados) {
    if (pagados.length > 0) {
      for (let i = 0; i < pagados.length; i += 1) {
        pedidos.actualizarPedido(pagados[i])
          .catch(error => deferred.reject(error));
      }
      deferred.resolve(help.r$(1, 'Pedidos actualizados', pagados));
    } else { deferred.resolve(help.r$(0, 'Sin pedidos pagados que actualizar')); }
  } else { deferred.resolve(help.r$(0, 'Sin pedidos pagados por barrer para actualizar')); }
  return deferred.promise;
};

// Actualiza en la base de datos el pedido siempre y cuando haya sido actualizado antes
pedidos.actualizarPedido = (pedido) => {
  const deferred = Q.defer();
  if (pedido) {
    help.d$().ifexists(`
    SELECT * FROM traPedidos WHERE IdPedido = ? AND IdEstatusPedido != ?`, [pedido.IdPedidoMarketPlace, 3])
      .then((result) => {
        if (help.f$().esResultValido(result)) {
          if (result.data[0].Existe === 1) {
            help.d$().insert('logPedidos', { IdPedido: pedido.IdPedidoMarketPlace, IdEstatusPedido: 3, Fecha: help.d$().now() })
              .then(help.d$().update('traPedidos', { IdEstatusPedido: 3 }, { IdPedido: pedido.IdPedidoMarketPlace }))
              .catch(error => deferred.reject(error))
              .done(resultProms => deferred.resolve(resultProms));
          } else { deferred.resolve(help.r$(0, 'El pedido no existe o ya fue pagado')); }
        } else { deferred.reject(help.r$(0, 'No pudimos obtener la información de este pedido')); }
      })
      .catch((error) => { deferred.resolve(error); });
  } else { deferred.reject(help.r$(0, 'Sin pedido que actualizar')); }
  return deferred.promise;
};

module.exports = pedidos;
