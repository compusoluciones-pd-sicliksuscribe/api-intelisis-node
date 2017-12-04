'use strict';

const help = require('../helpers/help');
const config = require('../config');
const { request } = require('../helpers/logged-request');
const Q = require('q');

const tipoCambio = {};

// Obtiene el tipo de cambio del ERP y lo inserta en la base de datos del MarketPlace
tipoCambio.obtener = () => {
  const deferred = Q.defer();
  request.get(config.ApiErp + 'TipoCambio', { headers: { token: config.TokenERP } }, (error, response, body) => {
    if (body) {
      const jsonTipoCambio = JSON.parse(body);
      if (jsonTipoCambio[0].Dolar) {
        help.d$().insert('catTipoCambio',
          { Dolar: jsonTipoCambio[0].Dolar, DolarMS: jsonTipoCambio[0].DolarMS, Fecha: help.d$().now() })
          .catch(erroInsert => deferred.reject(erroInsert))
          .done(result => deferred.resolve(result));
      } else { deferred.reject(help.r$(0, 'Error en el Json al traer el tipo de cambio')); }
    } else { if (error) { deferred.reject(help.r$(0, error)); } else { deferred.reject(help.r$(0, 'Error con el body al traer el tipo de cambio')); } }
  });
  return deferred.promise;
};

module.exports = tipoCambio;
