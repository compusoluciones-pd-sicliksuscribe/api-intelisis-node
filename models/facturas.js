'use strict';

const help = require('../helpers/help');
const config = require('../config');
const { request } = require('../helpers/logged-request');
const Q = require('q');
const Promise = require('bluebird');

const facturas = {};

const promiseFor = Promise.method((condition, action, value) => {
  if (!condition(value)) return value;
  return action(value).then(promiseFor.bind(null, condition, action));
});

// Proceso que dispara los procesos para generar todas las facturas pendientes
facturas.generar = () => facturas.obtenerPendientes().then(facturas.barrerPedidos);
facturas.generarBajoConsumo = () => facturas.obtenerBajoConsumoPendientes().then(facturas.barrerPedidos);

// Consulta en la base de datos del MarketPlace todas los pedidos pendientes de facturar, es decir Facturado = 0 y que el IdEstatusPedido sea 2, 4 o 5
facturas.obtenerPendientes = () => help.d$().query(`
  SELECT DISTINCT
  P.IdPedido, Distribuidor.IdERP AS Cliente, IFNULL(Distribuidor.Credito, 0) Credito, UsuarioFinal.NombreEmpresa AS Proyecto, F.UEN, P.MonedaPago, P.TipoCambio, P.IdFormaPago,
  fn_CalcularTotalPedido(P.IdPedido) AS Total,
  fn_CalcularIVA(fn_CalcularTotalPedido(P.IdPedido), Distribuidor.ZonaImpuesto) AS IVA,
  IF (P.IdFabricante = 2, contrato.FechaFin, P.FechaFin) AS Vencimiento,
  IF (P.IdFabricante = 2, Distribuidor.AgenteAutodesk, Distribuidor.AgenteMicrosoft) AS Agente
  FROM traPedidos P
  LEFT JOIN traContratoAutodesk contrato ON contrato.IdContrato = P.IdContrato AND contrato.Activo = 1
  INNER JOIN traEmpresas Distribuidor ON Distribuidor.IdEmpresa = P.IdEmpresaDistribuidor
  INNER JOIN traEmpresas UsuarioFinal ON UsuarioFinal.IdEmpresa = P.IdEmpresaUsuarioFinal
  INNER JOIN traFabricantes F ON F.IdFabricante = P.IdFabricante
  INNER JOIN traPedidoDetalles PD ON PD.IdPedido = P.IdPedido AND (PD.Activo = 1 OR PD.PorCancelar = 1) AND PD.PedidoAFabricante = 1
  INNER JOIN traProductos Pro ON Pro.IdProducto = PD.IdProducto AND Pro.IdTipoProducto != 3
  WHERE P.Facturado = 0 AND P.IdEstatusPedido IN (2, 3, 4, 5) AND Distribuidor.IdERP IS NOT NULL AND P.PedidoImportado IS NULL
  AND UsuarioFinal.NombreEmpresa IS NOT NULL AND F.UEN IS NOT NULL AND P.MonedaPago IS NOT NULL AND P.TipoCambio IS NOT NULL
  AND CASE WHEN P.IdFabricante = 2 THEN contrato.FechaFin IS NOT NULL ELSE P.FechaFin IS NOT NULL END;
`);

facturas.obtenerBajoConsumoPendientes = () => help.d$().query(`
  SELECT DISTINCT
  P.IdPedido, Distribuidor.IdERP AS Cliente, IFNULL(Distribuidor.Credito, 0) Credito, UsuarioFinal.NombreEmpresa AS Proyecto, F.UEN, P.MonedaPago, P.TipoCambio, P.IdFormaPago,
  fn_CalcularTotalPedido(P.IdPedido) AS Total,
  fn_CalcularIVA(fn_CalcularTotalPedido(P.IdPedido), Distribuidor.ZonaImpuesto) AS IVA,
  IF (P.IdFabricante = 2, contrato.FechaFin, P.FechaFin) AS Vencimiento,
  IF (P.IdFabricante = 2, Distribuidor.AgenteAutodesk, Distribuidor.AgenteMicrosoft) AS Agente
  FROM traPedidos P
  LEFT JOIN traContratoAutodesk contrato ON contrato.IdContrato = P.IdContrato AND contrato.Activo = 1
  INNER JOIN traEmpresas Distribuidor ON Distribuidor.IdEmpresa = P.IdEmpresaDistribuidor
  INNER JOIN traEmpresas UsuarioFinal ON UsuarioFinal.IdEmpresa = P.IdEmpresaUsuarioFinal
  INNER JOIN traFabricantes F ON F.IdFabricante = P.IdFabricante
  INNER JOIN traPedidoDetalles PD ON PD.IdPedido = P.IdPedido AND (PD.Activo = 1 OR PD.PorCancelar = 1) AND PD.PedidoAFabricante = 1
  INNER JOIN traProductos Pro ON Pro.IdProducto = PD.IdProducto AND Pro.IdTipoProducto = 3
  WHERE P.Facturado = 0 AND P.IdEstatusPedido IN (2, 3, 4, 5) AND Distribuidor.IdERP IS NOT NULL AND P.PedidoImportado IS NULL
  AND UsuarioFinal.NombreEmpresa IS NOT NULL AND F.UEN IS NOT NULL AND P.MonedaPago IS NOT NULL AND P.TipoCambio IS NOT NULL AND P.FechaFin IS NOT NULL
  AND P.FechaFin <= DATE(NOW());
`);

// Barrer pedidos pendientes de facturar y mandarlos a facturar
facturas.barrerPedidos = (pedidos) => {
  const deferred = Q.defer();
  if (help.f$().esResultValido(pedidos)) {
    if (pedidos.data.length > 0) {
      for (let i = 0; i < pedidos.data.length; i += 1) {
        facturas.valida(pedidos.data[i]).then((r$) => {
          if (r$.success === 1) {
            facturas.facturar(r$.data)
              .then(facturas.actualizarPedido)
              .catch(error => deferred.reject(error));
          }
        }).catch(error => deferred.reject(error));
      }
      deferred.resolve(help.r$(1, pedidos.data.length + ' actualizados'));
    } else { deferred.resolve(help.r$(0, 'Todos los pedidos ya están actualizados')); }
  } else { deferred.reject(help.r$(0, 'Sin un pedido a leer')); }
  return deferred.promise;
};

// Validar factura antes de enviarla a Intelisis
facturas.valida = (factura) => {
  const deferred = Q.defer();
  let valido = true;
  let errores = '';
  if (!factura.IdPedido) { valido = false; errores += 'el id del pedido está vacio '; }
  if (factura.Cliente.esVacio()) { valido = false; errores += 'el cliente está vacio '; }
  if (!factura.Cliente.longitudValida()) { valido = false; errores += 'el cliente tiene longitud inválida '; }
  if (factura.Proyecto.esVacio()) { valido = false; errores += 'el proyecto está vacio '; }
  if (!factura.Proyecto.longitudValida()) { valido = false; errores += 'el proyecto tiene longitud inválida '; }
  if (!factura.UEN) { valido = false; errores += 'la UEN está vacia '; }
  if (!factura.MonedaPago) { valido = false; errores += 'la moneda de pago está vacia '; }
  if (!factura.TipoCambio) { valido = false; errores += 'el tipo de cambio está vacio '; }
  if (!factura.IdFormaPago) { valido = false; errores += 'el id forma de pago está vacia '; }
  if (!factura.Vencimiento) { valido = false; errores += 'la fecha de vencimiento está vacia '; }
  if (valido) { deferred.resolve(help.r$(1, 'factura valida', factura)); } else { deferred.resolve(help.r$(0, errores, factura)); }
  return deferred.promise;
};

// Genera una factura haciendo una petición a la API de Intelisis en el GLITIO en C#
facturas.facturar = (params) => {
  const deferred = Q.defer();
  if (params) {
    const parametros = {
      Cliente: params.Cliente,
      Total: params.Total,
      Moneda: params.MonedaPago,
      TipoCambio: params.TipoCambio,
      IdFormaPago: params.IdFormaPago,
      UEN: params.UEN,
      IVA: params.IVA,
      CreditoDistribuidor: params.Credito,
      IdPedidoMarketPlace: params.IdPedido,
      Proyecto: params.Proyecto,
      Vencimiento: params.Vencimiento,
      Agente: params.Agente,
    };
    request.post(config.ApiErp + 'Venta', {
      headers: { token: config.TokenERP },
      form: parametros,
    }, (error, response, body) => {
      if (error) { deferred.reject(help.r$(0, error.toString())); }
      if (body) {
        const json = JSON.parse(body);
        if (json) {
          facturas.obtenerDetalle(json[0])
            .then(facturas.barrerDetalle)
            .then((resultado) => {
              parametros.ID = resultado.data;
              return deferred.resolve(help.r$(1, 'Detalles insertados', parametros));
            })
            .catch(errorObtenerDetalle => deferred.reject(errorObtenerDetalle))
        } else { deferred.reject(help.r$(0, 'Error con el json al generar la factura')); }
      } else { deferred.reject(help.r$(0, 'Error con el body al generar la factura')); }
    });
  } else { deferred.reject(help.r$(0, 'Sin parametros para facturar')); }
  return deferred.promise;
};

// Esta funcion regresa el detalle del pedido recien insertado
facturas.obtenerDetalle = (pedidoInsertado) => {
  const deferred = Q.defer();
  if (pedidoInsertado) {
    help.d$().query(`
    SELECT
      ? AS ID, P.IdERP AS Articulo, PD.Cantidad, PD.IdPedido,
      CASE
        WHEN PD.MonedaPrecio = Ped.MonedaPago
          THEN PD.PrecioUnitario
        WHEN Ped.MonedaPago = 'Pesos' AND PD.MonedaPrecio = 'Dolares'
          THEN PD.PrecioUnitario * Ped.TipoCambio
        WHEN Ped.MonedaPago = 'Dolares' AND PD.MonedaPrecio = 'Pesos'
          THEN PD.PrecioUnitario / Ped.TipoCambio END AS Precio
    FROM traPedidoDetalles PD
    INNER JOIN traProductos P ON P.IdProducto = PD.IdProducto
    INNER JOIN traPedidos Ped ON Ped.IdPedido = PD.IdPedido
    WHERE PD.IdPedido = ?;`,
      [pedidoInsertado.ID, pedidoInsertado.IdPedidoMarketPlace])
      .catch(error => deferred.reject(error))
      .done(result => deferred.resolve(result));
  } else { deferred.reject(help.r$(0, 'Sin un pedido insertado que actualizar')); }
  return deferred.promise;
};

// Barro todo el detalle de un pedido para mandarlo a la función de guardar el detalle en Intelisis
facturas.barrerDetalle = (pedidoDetalles) => {
  const ID = pedidoDetalles.data[0].ID;
  const deferred = Q.defer();
  if (help.f$().esResultValido(pedidoDetalles)) {
    promiseFor(count => count < pedidoDetalles.data.length, (count) => {
      pedidoDetalles.data[count].RenglonID = count + 1;
      pedidoDetalles.data[count].Renglon = (count + 1) * 2048;
      return facturas.guardarDetalle(pedidoDetalles.data[count])
        .then(() => ++count);
    }, 0).then(() => {
      facturas.insertarRP(ID, pedidoDetalles.data[0].IdPedido)
        .then((pedido) => deferred.resolve(help.r$(1, 'Detalles insertados 1', ID)))
        .catch(error => deferred.reject(help.r$(0, 'Error al insertar RP', error)));
    }).catch((err) => deferred.reject(help.r$(0, 'Error con el detalle del pedido ' + err)));
  } else { deferred.reject(help.r$(0, 'Error con el detalle del pedido ' + pedidoDetalles)); }
  return deferred.promise;
};

// En caso de tener un tipo de cambio especial se inserta un RP
facturas.insertarRP = (ID, IdPedido) => {
  const deferred = Q.defer();
  help.d$().query(`
     SELECT IFNULL(TipoCambioRP, 0 ) AS TipoCambioRP FROM traPedidos P
    INNER JOIN traPedidoDetalles PD ON P.IdPedido = PD.IdPedido
    INNER JOIN traEmpresasXEmpresas EXE ON EXE.IdEmpresaDistribuidor = P.IdEmpresaDistribuidor AND EXE.IdEmpresaUsuarioFinal = P.IdEmpresaUsuarioFinal
    WHERE PD.IdPedido = ? AND PD.Activo = 1 LIMIT 1`,
    [IdPedido])
    .then((RP) => {
      const TipoCambioRP = RP.data[0].TipoCambioRP;
      request.put(config.ApiErp + 'VentaD', {
        headers: { token: config.TokenERP },
        form: {
          ID,
          TipoCambioRP,
        },
      }, (error, response, body) => {
        if (JSON.parse(body)[0].oResultado) {
          deferred.resolve(help.r$(1, 'RP actualizado', body));
        } else {
          deferred.reject(help.r$(0, 'Error al actualizar RP', JSON.parse(body)[0].oResultado))
        }
      });
    });
  return deferred.promise;
};

// Guardo un detalle de un pedido en Intelisis
facturas.guardarDetalle = (pedidoDetalle) => {
  const deferred = Q.defer();
  if (pedidoDetalle) {
    const parametros = {
      ID: pedidoDetalle.ID,
      Articulo: pedidoDetalle.Articulo,
      Cantidad: pedidoDetalle.Cantidad,
      Precio: pedidoDetalle.Precio,
      RenglonID: pedidoDetalle.RenglonID,
      Renglon: pedidoDetalle.Renglon
    };
    request.post(config.ApiErp + 'VentaD', {
      headers: { token: config.TokenERP },
      form: parametros,
    },
      (error, response, body) => {
        if (error) { deferred.reject(help.r$(0, error.toString())); }
        if (body) {
          const json = JSON.parse(body);
          if (json) {
            if (json[0].oResultado.Success === 1) {
              deferred.resolve(help.r$(1, 'Detalle insertado', pedidoDetalle));
            } else {
              deferred.resolve(help.r$(0, json[0].oResultado.Message.toString(), pedidoDetalle));
            }
          } else { deferred.resolve(help.r$(0, 'Error del body al guardar el detalle de la factura')); }
        } else { deferred.reject(help.r$(0, 'Error con el json al generar el detalle de la factura')); }
      });
  } else { deferred.reject(help.r$(0, 'Error con el detalle del pedido')); }
  return deferred.promise;
};

// Actualizar el movimiento poniendole el MovId de la factura y Facturado = 1
facturas.actualizarPedido = (pedido) => {
  const deferred = Q.defer();
  if (help.f$().esResultValido(pedido)) {
    help.d$().insert('logPedidos', { IdPedido: pedido.data.IdPedidoMarketPlace, Facturado: 1, IdFactura: pedido.data.ID, Fecha: help.d$().now() })
      .then(help.d$().update('traPedidos', { Facturado: 1, IdFactura: pedido.data.ID }, { IdPedido: pedido.data.IdPedidoMarketPlace }))
      .catch(error => deferred.reject(error))
      .done(result => deferred.resolve(result));
  } else { deferred.reject(help.r$(0, 'Sin un pedido que actualizar')); }
  return deferred.promise;
};

module.exports = facturas;
