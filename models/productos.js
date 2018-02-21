const { isNil } = require('ramda');

const help = require('../helpers/help');
const config = require('../config');
const { request } = require('../helpers/logged-request');
const Q = require('q');
const logger = require('../helpers/logger').debugLogger;

const productos = {};

// Obtener toda la lista de productos del ERP y los barre para meterlos en el marketplace
productos.obtener = () => {
  logger.info('Updating products');
  const deferred = Q.defer();
  request.get(config.ApiErp + 'Articulo', { headers: { token: config.TokenERP } }, (error, response, body) => {
    if (body) {
      const jsonProductos = JSON.parse(body);
      productos.barrerProductos(jsonProductos)
        .catch(errorBarrerProductos => deferred.reject(errorBarrerProductos))
        .done(result => deferred.resolve(result));
    } else {
      if (error) {
        logger.error(error);
        deferred.reject(help.r$(0, error));
      } else {
        logger.error('Unknown error while updating products');
        deferred.reject(help.r$(0, 'Error con el body al obtener los productos'));
      }
    }
  });
  return deferred.promise;
};

// Guarda los productos en el marketplace o lo actualiza si ya existe
productos.barrerProductos = productosERP => {
  const deferred = Q.defer();
  if (productosERP) {
    for (let i = 0; i < productosERP.length; i += 1) {
      if (productosERP[i].CantidadMinima === 0) { productosERP[i].CantidadMinima = 1; }
      if (productosERP[i].CantidadMaxima === 0) { productosERP[i].CantidadMaxima = 1000; }
      productos.valido(productosERP[i]).then(r$ => {
        if (r$.success === 1) {
          help.d$().callStoredProcedure('traProductos_insert',
            {
              IdERP: r$.data.IdERP,
              IdProductoFabricante: r$.data.IdProductoFabricante,
              Nombre: r$.data.Nombre,
              Descripcion: r$.data.Descripcion,
              IdFabricante: r$.data.IdFabricante,
              CantidadMinima: r$.data.CantidadMinima,
              CantidadMaxima: r$.data.CantidadMaxima,
              PrecioNormal: r$.data.PrecioNormal,
              MonedaPrecio: r$.data.MonedaPrecio,
              IdTipoProducto: r$.data.IdTipoProducto,
              IdEsquemaRenovacion: r$.data.IdEsquemaRenovacion,
              IdProductoFabricanteExtra: r$.data.IdProductoFabricanteExtra,
              Especializacion: r$.data.Especializacion,
              Activo: r$.data.Activo,
              Visible: r$.data.Visible,
              ClaveProdServ: r$.data.ClaveProdServ,
              ClaveUnidad: r$.data.ClaveUnidad,
            })
            .catch(error => deferred.reject(error))
            .done(result => deferred.resolve(result));
        }
      }).catch(error => deferred.reject(error));
    }
    deferred.resolve(help.r$(1, 'Productos actualizados'));
  } else { deferred.reject(help.r$(0, 'Sin productos que actualizar')); }
  logger.info('finished updating products');
  return deferred.promise;
};

// Valido el producto antes de insertarlo en la base de datos
productos.valido = producto => {
  const deferred = Q.defer();
  let valido = true;
  let errores = '';
  if (producto.IdERP.esVacio()) { valido = false; errores += 'el id ERP está vacio '; }
  if (!producto.IdERP.longitudValida()) { valido = false; errores += 'el id ERP tiene longitud inválida '; }
  if (producto.Nombre.esVacio()) { valido = false; errores += 'el nombre está vacio '; }
  if (!producto.Nombre.longitudValida()) { valido = false; errores += 'el nombre tiene longitud inválida '; }
  if (!producto.IdFabricante) { valido = false; errores += 'el id fabricante está vacio '; }
  if (!producto.IdTipoProducto) { valido = false; errores += 'el id tipo producto está vacio '; }
  if (isNil(producto.PrecioNormal)) { valido = false; errores += 'el precio normal está vacio '; }
  if (producto.PrecioNormal <= 0) { valido = false; errores += 'el precio normal es igual o menor a 0'; }
  if (producto.MonedaPrecio.esVacio()) { valido = false; errores += 'la moneda precio está vacio '; }
  if (!producto.Activo) { valido = false; errores += 'el campo activo está vacio '; }
  if (!producto.IdProductoFabricante) { valido = false; errores += 'el id producto fabricante está vacio '; }
  if (producto.CantidadMinima >= producto.CantidadMaxima) { valido = false; errores += 'la cantidad mínima es igual o mayor a la cantidad máxima '; }
  if (valido) { deferred.resolve(help.r$(1, 'Producto valido', producto)); } else {
    deferred.resolve(help.r$(0, errores, producto)); }
  return deferred.promise;
};

module.exports = productos;
