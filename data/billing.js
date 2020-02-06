const help = require('../helpers/help');
const { IdProductoComisionTuClick } = require('../config');

const billing = {};

billing.selectPendingOrdersToBill = () => help.d$().query(`
SELECT DISTINCT
P.IdPedido, P.IdPrimerPedido, Distribuidor.IdERP AS Cliente, IFNULL(Distribuidor.Credito, 0) Credito,
(CASE WHEN (P.IdFabricante = 10)
	THEN IF(CxE.IdConsola IS NULL, Distribuidor.NombreEmpresa, 
		IF( CxE.NombreEmpresa IS NULL,Distribuidor.NombreEmpresa, CxE.NombreEmpresa))
    ELSE  Distribuidor.NombreEmpresa
END)
 AS Proyecto,
F.UEN, P.MonedaPago, P.TipoCambio, P.IdFormaPago, 
fn_CalcularTotalPedido(P.IdPedido) AS Total, 
fn_CalcularIVA(fn_CalcularTotalPedido(P.IdPedido), Distribuidor.ZonaImpuesto) AS IVA,
IF (P.IdFabricante = 2, contrato.FechaFin, P.FechaFin) AS Vencimiento,
(CASE
  WHEN (P.IdFabricante = 2 AND TPP.IdPedidoPadre IS NOT NULL) THEN Distribuidor.AgenteAutodeskRenovacion
  WHEN (P.IdFabricante = 2 ) THEN Distribuidor.AgenteAutodesk
  WHEN (P.IdFabricante = 10 ) THEN Distribuidor.AgenteAmazonRenovacion
  ELSE Distribuidor.AgenteMicrosoft
END) AS Agente,
CASE WHEN (P.IdFabricante = 1 AND P.IdEsquemaRenovacion = 2) THEN 'Anual Microsoft'
     WHEN (P.IdFabricante = 10) THEN 'Mensual AWS'
ELSE '' END AS EsquemaRenovacion,
(CASE
    WHEN (P.IdFabricante = 10 ) THEN IF(isnull(Serv.NombreEmpresa), Distribuidor.NombreEmpresa, Serv.NombreConsola)
    When (P.IdFabricante != 10) THEN ''
END) AS Observaciones
FROM traPedidos P
LEFT JOIN traContratoAutodesk contrato ON contrato.IdContrato = P.IdContrato
AND CASE WHEN contrato.Activo = 0 THEN contrato.PorActivar = 1 ELSE contrato.Activo = 1 END
INNER JOIN traEmpresas Distribuidor ON Distribuidor.IdEmpresa = P.IdEmpresaDistribuidor 
INNER JOIN traEmpresas UsuarioFinal ON UsuarioFinal.IdEmpresa = P.IdEmpresaUsuarioFinal 
INNER JOIN traFabricantes F ON F.IdFabricante = P.IdFabricante 
INNER JOIN traPedidoDetalles PD ON PD.IdPedido = P.IdPedido AND (PD.Activo = 1 OR PD.PorCancelar = 1) AND PD.PedidoAFabricante = 1
INNER JOIN traProductos Pro ON Pro.IdProducto = PD.IdProducto
LEFT JOIN traPedidosXConsola PxC on PxC.IdPedido = P.IdPedido
LEFT JOIN traServiciosAWS Serv on Serv.IdConsola = PxC.IdConsola
LEFT JOIN traConsolasXEmpresa CxE on CxE.IdConsola = PxC.IdConsola
LEFT JOIN traPedidosPadre TPP ON TPP.IdPedido=P.IdPedido
WHERE P.Facturado = 0 AND P.IdEstatusPedido IN (2, 3, 4, 5, 8) AND Distribuidor.IdERP IS NOT NULL AND P.PedidoImportado IS NULL
AND UsuarioFinal.NombreEmpresa IS NOT NULL AND F.UEN IS NOT NULL AND P.MonedaPago IS NOT NULL AND P.TipoCambio IS NOT NULL
AND CASE WHEN P.IdFabricante = 2 THEN contrato.FechaFin IS NOT NULL ELSE P.FechaFin IS NOT NULL END
AND P.IdFormaPago != 4
AND CASE 
	WHEN Pro.IdTipoProducto = 2 OR Pro.IdTipoProducto = 4 THEN Pro.IdTipoProducto != 3
	WHEN Pro.IdTipoProducto = 1 AND P.IdFabricante = 10 THEN P.FechaFin <= NOW() 
	WHEN Pro.IdTipoProducto = 3 THEN P.FechaFin <= NOW() AND Pro.IdTipoProducto = 3
END;
`);

billing.selectPendingOrderDetail = (ID, IdPedido) => help.d$().query(`
    SELECT 
      ? AS ID, P.IdERP AS Articulo, PD.IdPedido, PD.IdProducto,
      CASE WHEN P.IdFabricante = 5 
      THEN 1
      ELSE PD.Cantidad 
    END AS Cantidad,
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
    WHERE PD.IdPedido = ? AND P.IdProducto <> ?;`,
  [ID, IdPedido, IdProductoComisionTuClick]);

billing.selectRP = IdPedido => help.d$().query(`
     SELECT IFNULL(TipoCambioRP, 0 ) AS TipoCambioRP FROM traPedidos P 
    INNER JOIN traPedidoDetalles PD ON P.IdPedido = PD.IdPedido 
    INNER JOIN traEmpresasXEmpresas EXE ON EXE.IdEmpresaDistribuidor = P.IdEmpresaDistribuidor AND EXE.IdEmpresaUsuarioFinal = P.IdEmpresaUsuarioFinal
    WHERE PD.IdPedido = ? AND PD.Activo = 1 LIMIT 1`,
  [IdPedido]);

billing.putResponseBilling = (ID, IdPedido) => help.d$().query(`
  UPDATE traPedidos SET Facturado = 1, IdFactura = ?, IdEstatusPedido = 2
  WHERE IdPedido = ?`,
[ID, IdPedido]);

billing.getBillData = IdPedido => help.d$().query(`
SELECT DISTINCT
P.IdPedido, Distribuidor.IdERP AS Cliente, IFNULL(Distribuidor.Credito, 0) Credito, Distribuidor.NombreEmpresa AS Proyecto, F.UEN, P.MonedaPago, P.TipoCambio, P.IdFormaPago, 
fn_CalcularTotalPedido(P.IdPedido) AS Total, 
fn_CalcularIVA(fn_CalcularTotalPedido(P.IdPedido), Distribuidor.ZonaImpuesto) AS IVA,
IF (P.IdFabricante = 2, contrato.FechaFin, P.FechaFin) AS Vencimiento,
(CASE
  WHEN (P.IdFabricante = 2 AND TPP.IdPedidoPadre IS NOT NULL) THEN Distribuidor.AgenteAutodeskRenovacion
  WHEN (P.IdFabricante = 2 ) THEN Distribuidor.AgenteAutodesk
  WHEN (P.IdFabricante = 9 ) THEN 'JORGONZA'
  ELSE Distribuidor.AgenteMicrosoft
END) as Agente
FROM traPedidos P
LEFT JOIN traContratoAutodesk contrato ON contrato.IdContrato = P.IdContrato
AND CASE WHEN contrato.Activo = 0 THEN contrato.PorActivar = 1 ELSE contrato.Activo = 1 END
INNER JOIN traEmpresas Distribuidor ON Distribuidor.IdEmpresa = P.IdEmpresaDistribuidor 
INNER JOIN traFabricantes F ON F.IdFabricante = P.IdFabricante 
INNER JOIN traPedidoDetalles PD ON PD.IdPedido = P.IdPedido AND (PD.Activo = 1 OR PD.PorCancelar = 1) AND PD.PedidoAFabricante = 1
INNER JOIN traProductos Pro ON Pro.IdProducto = PD.IdProducto
LEFT JOIN traPedidosPadre TPP ON TPP.IdPedido=P.IdPedido
WHERE P.IdPedido = ? AND P.Facturado = 0 AND P.IdEstatusPedido IN (2, 3, 4, 5, 8) AND Distribuidor.IdERP IS NOT NULL AND P.PedidoImportado IS NULL
AND Distribuidor.NombreEmpresa IS NOT NULL AND F.UEN IS NOT NULL AND P.MonedaPago IS NOT NULL AND P.TipoCambio IS NOT NULL
AND CASE WHEN P.IdFabricante = 2 THEN contrato.FechaFin IS NOT NULL ELSE P.FechaFin IS NOT NULL END
AND P.IdFormaPago != 4;
  `, [IdPedido]);

module.exports = billing;
