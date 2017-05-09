'use strict';

const help = require('../helpers/help');
const config = require('../config');
const request = require('request');
const Q = require('q');
const promiseFor = require('../helpers/promise-for');

const distribuidores = {};

// Obtener toda la lista de distribuidores del ERP y los barre para meterlos en el marketplace
distribuidores.obtener = () => {
  const deferred = Q.defer();
  request.get(config.ApiErp + 'Cliente', { headers: { token: config.TokenERP } }, (error, response, body) => {
    if (body) {
      const jsonEmpresas = JSON.parse(body);
      distribuidores.barrerDistribuidores(jsonEmpresas)
        .catch(errorBarrerDistribuidores => deferred.reject(errorBarrerDistribuidores))
        .done(result => deferred.resolve(result));
    } else { if (error) { deferred.reject(help.r$(0, error)); } else { deferred.reject(help.r$(0, 'Error con el body al obtener los distribuidores')); } }
  });
  return deferred.promise;
};

// Guarda los distribuidores en el marketplace o los actualiza si ya existe
distribuidores.barrerDistribuidores = (distribuidoresERP) => {
  const deferred = Q.defer();
  let contador = 0;
  if (distribuidoresERP) {
    return promiseFor(count => count < distribuidoresERP.length,
      (count) => {
        return distribuidores.valido(distribuidoresERP[count]).then((r$) => {
          if (r$.success === 1) {
            const empresa = {
              pIdERP: r$.data.IdERP, pRFC: r$.data.RFC, pNombreEmpresa: r$.data.NombreEmpresa, pDireccion: r$.data.Direccion,
              pCiudad: r$.data.Ciudad, pEstado: r$.data.Estado, pCodigoPostal: r$.data.CodigoPostal, pNombreContacto: null, pApellidosContacto: null,
              pCorreoContacto: null, pTelefonoContacto: null, pCredito: null, pZonaImpuesto: r$.data.ZonaImpuesto, pLada: null, IdMicrosoftUF: null,
              IdMicrosoftDist: r$.data.IdMicrosoft, IdAutodeskUF: null, IdAutodeskDist: r$.data.IdAutodesk, ContratoAutodeskUF: null, DominioMicrosoftUF: null,
              RazonSocial: r$.data.RazonSocial,
            };
            console.log(empresa.RazonSocial);
            return help.d$().callStoredProcedure('traEmpresas_insert', empresa)
              .then(res => ++count)
          } else {
            ++contador;
            return ++count;
          }
        });
      }, 0).then((res) => deferred.resolve(help.r$(1, 'distribuidores actualizados')));
  } else { deferred.reject(help.r$(0, 'Sin distribuidores que actualizar')); }
  return deferred.promise;
};

// Valido a un distribuidor
distribuidores.valido = (distribuidor) => {
  const deferred = Q.defer();
  let valido = true;
  let errores = '';
  if (distribuidor) {
    if (distribuidor.RFC.esVacio()) { valido = false; errores += 'el RFC está vacio '; }
    if (!distribuidor.RFC.longitudValida()) { valido = false; errores += 'el RFC tiene longitud inválida '; }
    if (!distribuidor.RFC.esRFCValido()) { valido = false; errores += 'el RFC no es válido '; }
    if (distribuidor.IdERP.esVacio()) { valido = false; errores += 'el id ERP está vacio '; }
    if (!distribuidor.IdERP.longitudValida()) { valido = false; errores += 'el id ERP tiene longitud inválida '; }
    if (distribuidor.NombreEmpresa.esVacio()) { valido = false; errores += 'el nombre está vacio '; }
    if (!distribuidor.NombreEmpresa.longitudValida()) { valido = false; errores += 'el nombre tiene una longitud inválida '; }
    if (distribuidor.Direccion.esVacio()) { valido = false; errores += 'la dirección está vacia '; }
    if (!distribuidor.Direccion.longitudValida()) { valido = false; errores += 'la dirección tiene una longitud inválida '; }
    if (distribuidor.Ciudad.esVacio()) { valido = false; errores += 'la ciudad está vacia '; }
    if (!distribuidor.Ciudad.longitudValida()) { valido = false; errores += 'la ciudad tiene una longitud inválida '; }
    if (distribuidor.Estado.esVacio()) { valido = false; errores += 'el estado está vacio '; }
    if (!distribuidor.Estado.longitudValida()) { valido = false; errores += 'el estado tiene una longitud inválida '; }
    if (!distribuidor.CodigoPostal) { valido = false; errores += 'el código postal está vacio '; }
    if (!distribuidor.Activo) { valido = false; errores += 'el campo activo está vacio '; }
    if (distribuidor.ZonaImpuesto.esVacio()) { valido = false; errores += 'el campo zona impuesto está vacio '; }
    if (!distribuidor.ZonaImpuesto.longitudValida()) { valido = false; errores += 'el campo zona impuesto tiene una longitud inválida '; }
  } else { valido = false; errores += 'el distribuidor está vacio '; }
  if (valido) { deferred.resolve(help.r$(1, 'Distribuidor valido', distribuidor)); } else { deferred.resolve(help.r$(0, errores, distribuidor)); }
  return deferred.promise;
};

module.exports = distribuidores;
