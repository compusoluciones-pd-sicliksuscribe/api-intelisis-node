const help = require('../helpers/help');

const billing = {};

billing.selectPendingOrdersToBill = () => help.d$().query(`
  SELECT DISTINCT
  P.IdPedido, Distribuidor.IdERP AS Cliente, IFNULL(Distribuidor.Credito, 0) Credito, UsuarioFinal.NombreEmpresa AS Proyecto, F.UEN, P.MonedaPago, P.TipoCambio, P.IdFormaPago, 
  fn_CalcularTotalPedido(P.IdPedido) AS Total, 
  fn_CalcularIVA(fn_CalcularTotalPedido(P.IdPedido), Distribuidor.ZonaImpuesto) AS IVA,
  CASE WHEN P.IdFabricante = 1 THEN P.FechaFin WHEN P.IdFabricante = 2 THEN contrato.FechaFin END AS Vencimiento,
  CASE WHEN P.IdFabricante = 1 THEN Distribuidor.AgenteMicrosoft WHEN P.IdFabricante = 2 THEN Distribuidor.AgenteAutodesk ELSE NULL END AS Agente
  FROM traPedidos P
  LEFT JOIN traContratoAutodesk contrato ON contrato.IdContrato = P.IdContrato AND contrato.Activo = 1
  INNER JOIN traEmpresas Distribuidor ON Distribuidor.IdEmpresa = P.IdEmpresaDistribuidor 
  INNER JOIN traEmpresas UsuarioFinal ON UsuarioFinal.IdEmpresa = P.IdEmpresaUsuarioFinal 
  INNER JOIN traFabricantes F ON F.IdFabricante = P.IdFabricante 
  INNER JOIN traPedidoDetalles PD ON PD.IdPedido = P.IdPedido AND (PD.Activo = 1 OR PD.PorCancelar = 1) AND PD.PedidoAFabricante = 1
  INNER JOIN traProductos Pro ON Pro.IdProducto = PD.IdProducto 
  WHERE P.Facturado = 0 AND P.IdEstatusPedido IN (2, 3, 4, 5) AND Distribuidor.IdERP IS NOT NULL AND P.PedidoImportado IS NULL
  AND UsuarioFinal.NombreEmpresa IS NOT NULL AND F.UEN IS NOT NULL AND P.MonedaPago IS NOT NULL AND P.TipoCambio IS NOT NULL
  AND CASE WHEN P.IdFabricante = 1 THEN P.FechaFin IS NOT NULL WHEN P.IdFabricante = 2 THEN contrato.FechaFin IS NOT NULL END
  AND CASE WHEN Pro.IdTipoProducto = 2 OR Pro.IdTipoProducto = 4 THEN Pro.IdTipoProducto != 3
  WHEN Pro.IdTipoProducto = 3 THEN P.FechaFin <= NOW() AND Pro.IdTipoProducto = 3
  END;
  `);

billing.selectPendingOrderDetail = (ID, IdPedido) => help.d$().query(`
    SELECT 
      ? AS ID, P.IdERP AS Articulo, PD.Cantidad, PD.IdPedido, PD.IdProducto,
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
  [ID, IdPedido]);

billing.selectRP = IdPedido => help.d$().query(`
     SELECT IFNULL(TipoCambioRP, 0 ) AS TipoCambioRP FROM traPedidos P 
    INNER JOIN traPedidoDetalles PD ON P.IdPedido = PD.IdPedido 
    INNER JOIN traEmpresasXEmpresas EXE ON EXE.IdEmpresaDistribuidor = P.IdEmpresaDistribuidor AND EXE.IdEmpresaUsuarioFinal = P.IdEmpresaUsuarioFinal
    WHERE PD.IdPedido = ? AND PD.Activo = 1 LIMIT 1`,
  [IdPedido]);

module.exports = billing;
