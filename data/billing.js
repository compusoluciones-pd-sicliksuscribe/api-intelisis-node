const help = require('../helpers/help');

const billing = {};

billing.selectPendingOrdersToBill = () => help.d$().query(`
SELECT DISTINCT
    P.IdPedido, Distribuidor.IdERP AS Cliente, IFNULL(Distribuidor.Credito, 0) Credito, UsuarioFinal.NombreEmpresa AS Proyecto, F.UEN, P.MonedaPago, P.TipoCambio, P.IdFormaPago, 
    fn_CalcularTotalPedido(P.IdPedido) AS Total, 
    fn_CalcularIVA(fn_CalcularTotalPedido(P.IdPedido), Distribuidor.ZonaImpuesto) AS IVA, P.FechaFin AS Vencimiento,
    CASE WHEN P.IdFabricante = 1 THEN Distribuidor.AgenteMicrosoft WHEN P.IdFabricante = 2 THEN Distribuidor.AgenteAutodesk ELSE NULL END AS Agente
  FROM traPedidos P 
  INNER JOIN traEmpresas Distribuidor ON Distribuidor.IdEmpresa = P.IdEmpresaDistribuidor 
  INNER JOIN traEmpresas UsuarioFinal ON UsuarioFinal.IdEmpresa = P.IdEmpresaUsuarioFinal 
  INNER JOIN traFabricantes F ON F.IdFabricante = P.IdFabricante 
  INNER JOIN traPedidoDetalles PD ON PD.IdPedido = P.IdPedido AND (PD.Activo = 1 OR PD.PorCancelar = 1) AND PD.PedidoAFabricante = 1
  INNER JOIN traProductos Pro ON Pro.IdProducto = PD.IdProducto 
  WHERE P.Facturado = 0 AND P.IdEstatusPedido IN (2, 3, 4, 5) AND Distribuidor.IdERP IS NOT NULL AND P.PedidoImportado IS NULL
  AND UsuarioFinal.NombreEmpresa IS NOT NULL AND F.UEN IS NOT NULL AND P.MonedaPago IS NOT NULL AND P.TipoCambio IS NOT NULL AND P.FechaFin IS NOT NULL
  AND CASE WHEN Pro.IdTipoProducto = 2 OR Pro.IdTipoProducto = 4 THEN Pro.IdTipoProducto != 3
    WHEN Pro.IdTipoProducto = 3 THEN P.FechaFin <= '2017-05-22' AND Pro.IdTipoProducto = 3
  END
  `);



module.exports = billing;
