'use strict';

const help = require('../helpers/help');
const config = require('../config');
const { request } = require('../helpers/logged-request');
const Q = require('q');

const credito = {};

// Función que dispara actualizar el crédito de todos los distribudores dados de alta en el Marketplace
credito.actualizarClientes = () => {
  const deferred = Q.defer();
  credito.obtenerClientes()
    .then(credito.barrerClientes)
    .catch(error => deferred.reject(error))
    .done(result => deferred.resolve(help.r$(1, 'Créditos actualizados', result)));
  return deferred.promise;
};

// Obtiene la lista de todos los clientes dados de alta en el Marketplace
credito.obtenerClientes = () => {
  const deferred = Q.defer();
  help.d$().query(`
  SELECT E.IdERP AS Cliente, E.Credito
  FROM traEmpresas E
  WHERE E.Credito IS NOT NULL AND E.Activo = 1
  ORDER BY E.IdERP;`, [])
    .catch(error => deferred.reject(error))
    .done(result => deferred.resolve(result));
  return deferred.promise;
};

// Recibe la lista de clientes para ser barrida y posteriormente actualizar uno a uno su crédito
credito.barrerClientes = (clientes) => {
  const deferred = Q.defer();
  if (help.f$().esResultValido(clientes)) {
    for (let i = 0; i < clientes.data.length; i += 1) {
      credito.actualizarCredito(clientes.data[i].Cliente, clientes.data[i].Credito)
        .catch(error => deferred.reject(error));
    }
    deferred.resolve(help.r$(1, 'Clientes actualizados'));
  }
  return deferred.promise;
};

// Actualiza el crédito de un cliente en el ERP
credito.actualizarCredito = (cliente, credito) => {
  const deferred = Q.defer();
  if (cliente) {
    if (credito) {
      request.post(config.ApiErp + 'Credito', { headers: { token: config.TokenERP }, form: { Cliente: cliente, Credito: credito } },
        (error, response, body) => {
          if (body) {
            try {
              const json = JSON.parse(body);
              if (json) {
                if (json[0].Success === false) {
                  deferred.resolve(help.r$(0, json[0].Message, json[0].Dato));
                } else {
                  deferred.resolve(help.r$(1, json[0].Message, json[0].Dato));
                }
              } else {
                deferred.reject(help.r$(0, 'No se regresa información al actualizar el crédito del cliente'));
              }
            } catch (exception) {
              deferred.reject(help.r$(0, 'No se pudo parsear el body'));
            }
          } else {
            if (error) { deferred.reject(help.r$(0, error)); } else { deferred.reject(help.r$(0, 'Error con el body', body)); }
          }
        });
    } else { deferred.reject(help.r$(0, 'No hay crédito a actualizar')); }
  } else { deferred.reject(help.r$(0, 'No hay cliente a actualizar')); }
  return deferred.promise;
};

module.exports = credito;
