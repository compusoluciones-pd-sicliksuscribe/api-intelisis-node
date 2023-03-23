const help = require('../helpers/help');
const { IdProductoComisionTuClick } = require('../config');
const { AZURE_PLAN } = require('../helpers/enums/renewal-schema-types');

const billing = {};

billing.selectPendingOrdersToBill = () => help.d$().query(`
SELECT DISTINCT
P.IdPedido, P.IdPrimerPedido, Distribuidor.IdERP AS Cliente, IFNULL(Distribuidor.Credito, 0) Credito,
UsuarioFinal.NombreEmpresa AS Proyecto, P.IdFabricante, UsuarioFinal.RFC, UsuarioFinal.DominioMicrosoftUF,
F.UEN, P.MonedaPago, P.TipoCambio, P.IdFormaPago, fn_CalcularTotalPedido(P.IdPedido) AS Total, 
fn_CalcularIVA(fn_CalcularTotalPedido(P.IdPedido), Distribuidor.ZonaImpuesto) AS IVA,
IF (P.IdFabricante = 2, contrato.FechaFin, P.FechaFin) AS Vencimiento,
(CASE
  WHEN (P.IdFabricante = 2) THEN IF(P.IdAccionAutodesk > 3, Distribuidor.AgenteAutodeskRenovacion, Distribuidor.AgenteAutodesk)
  ELSE Distribuidor.AgenteMicrosoft
END) AS Agente,
CASE WHEN (P.IdFabricante = 1 AND P.IdEsquemaRenovacion = 1) THEN 'Mensual'
  WHEN (P.IdFabricante = 1 AND P.IdEsquemaRenovacion = 2) THEN 'Anual'
  WHEN (P.IdFabricante = 1 AND P.IdEsquemaRenovacion = 9) THEN 'Anual con facturación mensual'
ELSE '' END AS EsquemaRenovacion, '' AS Observaciones, OC.OrdenCompra
FROM traPedidos P
LEFT JOIN traContratoAutodesk contrato ON contrato.IdContrato = P.IdContrato AND contrato.Activo = TRUE
INNER JOIN traEmpresas Distribuidor ON Distribuidor.IdEmpresa = P.IdEmpresaDistribuidor 
INNER JOIN traEmpresas UsuarioFinal ON UsuarioFinal.IdEmpresa = P.IdEmpresaUsuarioFinal 
INNER JOIN traFabricantes F ON F.IdFabricante = P.IdFabricante 
INNER JOIN traPedidoDetalles PD ON PD.IdPedido = P.IdPedido 
AND (PD.Activo = 1 OR PD.PorCancelar = 1) AND PD.PedidoAFabricante = 1 AND PD.IdProducto != 75 AND PD.ResultadoFabricante1 IS NOT NULL
INNER JOIN traProductos Pro ON Pro.IdProducto = PD.IdProducto
LEFT JOIN traPedidosPadre TPP ON TPP.IdPedido=P.IdPedido
LEFT JOIN traOrdenesCompra OC ON OC.IdPedido = P.IdPedido
WHERE P.Facturado = 0 AND P.IdEstatusPedido IN (2, 3) AND Distribuidor.IdERP IS NOT NULL AND P.PedidoImportado IS NULL
AND UsuarioFinal.NombreEmpresa IS NOT NULL AND F.UEN IS NOT NULL AND P.MonedaPago IS NOT NULL AND P.TipoCambio IS NOT NULL
AND ((P.IdFabricante = 2 AND contrato.FechaFin IS NOT NULL) 
	OR (P.FechaFin IS NOT NULL))
AND P.IdEsquemaRenovacion != 8
AND P.IdPedidoPadre IS NULL
AND ((P.IdFormaPago = 2 AND P.IdFabricante = 1 AND PD.ResultadoFabricante7 != 'RENEWAL')
   OR (P.IdFormaPago = 2 AND P.IdFabricante = 1 AND P.IdEsquemaRenovacion = 2)	
   OR (P.IdFabricante != 1 AND (PD.ResultadoFabricante7 IS NULL OR PD.ResultadoFabricante7 != 'RENEWAL'))
   OR (P.IdFormaPago in (1,3,4) AND ((P.IdFabricante = 1 AND (PD.ResultadoFabricante7 IS NULL OR PD.ResultadoFabricante7 in ('CREATEORDER','ADDSEAT','COTERM','RENEWAL')))
   OR P.IdFabricante != 1)))
AND (((Pro.IdTipoProducto = 2 OR Pro.IdTipoProducto = 4) AND Pro.IdTipoProducto != 3) 
   OR (Pro.IdTipoProducto = 3 AND P.FechaFin <= NOW() AND Pro.IdTipoProducto = 3))
GROUP BY PD.IdPedido;
`);

billing.selectPendingMsOrdersToBill = () => help.d$().query(`SELECT DISTINCT
P.IdPedido,
P.IdPrimerPedido,
Distribuidor.IdERP AS Cliente,
IFNULL(Distribuidor.Credito, 0) Credito,
UsuarioFinal.NombreEmpresa AS Proyecto,
F.UEN,
P.MonedaPago,
P.TipoCambio,
P.IdFormaPago,
FN_CALCULARTOTALPEDIDO(P.IdPedido) AS Total,
FN_CALCULARIVA(FN_CALCULARTOTALPEDIDO(P.IdPedido),
        Distribuidor.ZonaImpuesto) AS IVA,
P.FechaFin AS Vencimiento,
Distribuidor.AgenteMicrosoft AS Agente,
P.IdEsquemaRenovacion AS EsquemaRenovacion,
P.IdEmpresaDistribuidor,
P.IdEmpresaUsuarioFinal
FROM
traPedidos P
    INNER JOIN
traEmpresas Distribuidor ON Distribuidor.IdEmpresa = P.IdEmpresaDistribuidor
    INNER JOIN
traEmpresas UsuarioFinal ON UsuarioFinal.IdEmpresa = P.IdEmpresaUsuarioFinal
    INNER JOIN
traFabricantes F ON F.IdFabricante = P.IdFabricante
    INNER JOIN
traPedidoDetalles PD ON PD.IdPedido = P.IdPedido
    AND PD.PedidoAFabricante = 1
    AND PD.IdProducto != 75
    AND PD.ResultadoFabricante1 IS NOT NULL
    INNER JOIN
traProductos Pro ON Pro.IdProducto = PD.IdProducto
    LEFT JOIN
traPedidosPadre TPP ON TPP.IdPedido = P.IdPedido
WHERE
P.Facturado = 0
    AND P.IdEstatusPedido IN (2 , 3, 4, 5, 8)
    AND Distribuidor.IdERP IS NOT NULL
    AND P.PedidoImportado IS NULL
    AND UsuarioFinal.NombreEmpresa IS NOT NULL
    AND F.UEN IS NOT NULL
    AND P.MonedaPago IS NOT NULL
    AND P.TipoCambio IS NOT NULL
    AND P.IdFormaPago != 4
    AND P.IdPedidoPadre = 1
    AND P.IdEsquemaRenovacion = 1
    AND IdFormaPago = 2
    AND Pro.IdTipoProducto != 3
    AND P.FechaInicio <= Date_format(now(),'%Y-%m-22')
  AND P.FechaFin IS NOT NULL;`).then(res => res.data);

billing.selectPendingAWSOrdersToBill = () => help.d$().query(`
SELECT DISTINCT
    P.IdPedido,
    P.IdPrimerPedido,
    Distribuidor.IdERP AS Cliente,
    IFNULL(Distribuidor.Credito, 0) Credito,
    (CASE
        WHEN
            (P.IdFabricante = 10)
        THEN
            IF(CxE.IdConsola IS NULL,
                Distribuidor.NombreEmpresa,
                IF(CxE.NombreEmpresa IS NULL,
                    Distribuidor.NombreEmpresa,
                    CxE.NombreEmpresa))
        ELSE UsuarioFinal.NombreEmpresa
    END) AS Proyecto,
    F.UEN,
    P.MonedaPago,
    P.TipoCambio,
    P.IdFormaPago,
    FN_CALCULARTOTALPEDIDO(P.IdPedido) AS Total,
    FN_CALCULARIVA(FN_CALCULARTOTALPEDIDO(P.IdPedido),
            Distribuidor.ZonaImpuesto) AS IVA,
    P.FechaFin AS Vencimiento,
    Distribuidor.AgenteAmazon AS Agente,
    CASE
        WHEN (P.IdFabricante = 10) THEN PxC.IdGasto
        ELSE ''
    END AS EsquemaRenovacion,
    (CASE
        WHEN
            (P.IdFabricante = 10)
        THEN
            CONCAT(Serv.IdConsola,
                    ' - ',
                    IF(ISNULL(Serv.NombreEmpresa),
                        Distribuidor.NombreEmpresa,
                        Serv.NombreConsola))
        WHEN (P.IdFabricante != 10) THEN ''
    END) AS Observaciones
FROM
    traPedidos P
        INNER JOIN
    traEmpresas Distribuidor ON Distribuidor.IdEmpresa = P.IdEmpresaDistribuidor
        INNER JOIN
    traEmpresas UsuarioFinal ON UsuarioFinal.IdEmpresa = P.IdEmpresaUsuarioFinal
        INNER JOIN
    traFabricantes F ON F.IdFabricante = P.IdFabricante
        INNER JOIN
    traPedidoDetalles PD ON PD.IdPedido = P.IdPedido
        AND (PD.Activo = 1 OR PD.PorCancelar = 1)
        AND PD.PedidoAFabricante = 1
        INNER JOIN
    traProductos Pro ON Pro.IdProducto = PD.IdProducto
        LEFT JOIN
    traPedidosXConsola PxC ON PxC.IdPedido = P.IdPedido
        LEFT JOIN
    traServiciosAWS Serv ON Serv.IdConsola = PxC.IdConsola
        LEFT JOIN
    traConsolasXEmpresa CxE ON CxE.IdConsola = PxC.IdConsola
WHERE
    P.Facturado = 0
        AND P.IdEstatusPedido IN (2 , 3, 4, 5, 8)
        AND Distribuidor.IdERP IS NOT NULL
        AND F.UEN IS NOT NULL
        AND P.MonedaPago IS NOT NULL
        AND P.TipoCambio IS NOT NULL
        AND P.FechaFin IS NOT NULL
        AND P.IdFormaPago IN (2 , 4)
        AND P.IdPedidoPadre = 1
        AND P.IdFabricante = 10
        AND P.FechaFin <= NOW();`);

billing.getOrdersToBillAzurePlan = () => help.d$().query(`
SELECT DISTINCT
  P.IdPedido,
  P.IdPrimerPedido,
  Distribuidor.IdERP AS Cliente,
  IFNULL(Distribuidor.Credito, 0) Credito,
  UsuarioFinal.NombreEmpresa AS Proyecto,
  F.UEN,
  P.MonedaPago,
  P.TipoCambio AS TipoCambio,
  P.IdFormaPago,
  FN_CALCULARTOTALPEDIDO(P.IdPedido) AS Total,
  FN_CALCULARIVA(FN_CALCULARTOTALPEDIDO(P.IdPedido),
          Distribuidor.ZonaImpuesto) AS IVA,
  P.FechaFin AS Vencimiento,
  Distribuidor.AgenteMicrosoft AS Agente,
  '' AS EsquemaRenovacion,
  '' AS Observaciones,
  0 AS SinCredito,
  '' AS FormaPago
FROM
  traPedidos P
      INNER JOIN
  traEmpresas Distribuidor ON Distribuidor.IdEmpresa = P.IdEmpresaDistribuidor
      INNER JOIN
  traEmpresas UsuarioFinal ON UsuarioFinal.IdEmpresa = P.IdEmpresaUsuarioFinal
      INNER JOIN
  traFabricantes F ON F.IdFabricante = P.IdFabricante
      INNER JOIN
  traPedidoDetalles PD ON PD.IdPedido = P.IdPedido
      AND PD.PedidoAFabricante = 1
      INNER JOIN
  traProductos Pro ON Pro.IdProducto = PD.IdProducto
WHERE
  P.Facturado = 0
    AND P.IdEstatusPedido NOT IN (1, 6)
    AND Distribuidor.IdERP IS NOT NULL
    AND P.PedidoImportado IS NULL
    AND UsuarioFinal.NombreEmpresa IS NOT NULL
    AND F.UEN IS NOT NULL
    AND P.MonedaPago IS NOT NULL
    AND P.TipoCambio IS NOT NULL
    AND P.Facturado != 1
    AND P.IdEsquemaRenovacion IN (?)
    AND P.FechaFin = Date_format(now(),'%Y-%m-06')
    AND PD.PrecioUnitario > 0.1
    LIMIT 20;`, [AZURE_PLAN]);

billing.selectPendingOrderDetail = IdPedido => help.d$().query(`
SELECT 
P.IdERP AS Articulo, PD.IdPedido, PD.IdProducto,
CASE 
    WHEN P.IdFabricante = 5
        THEN 1
    ELSE PD.Cantidad
END AS Cantidad,
CASE 
    WHEN PD.MonedaPrecio = Ped.MonedaPago
        THEN PD.PrecioUnitario
    WHEN Ped.MonedaPago = 'Pesos' AND PD.MonedaPrecio = 'Dolares'
        THEN PD.PrecioUnitario * Ped.TipoCambio
    WHEN Ped.MonedaPago = 'Dolares' AND PD.MonedaPrecio = 'Pesos'
        THEN PD.PrecioUnitario / Ped.TipoCambio END AS Precio,
CASE
    WHEN P.IdFabricante = 10 THEN PD.PorcentajeDescuento
    ELSE 0
END AS Descuento,
PP.Meses AS DescripcionExtra,
PD.ResultadoFabricante7 AS serialNumber,
CASE 
    WHEN SP.Aprobado = 1
        THEN PD.PorcentajeDescuentoProxima
    ELSE 0
END AS DescuentoSP
FROM traPedidoDetalles PD
INNER JOIN traProductos P ON P.IdProducto = PD.IdProducto
INNER JOIN traPedidos Ped ON Ped.IdPedido = PD.IdPedido
LEFT JOIN traPedidosProrrateados PP ON PP.IdPedido = PD.IdPedido
LEFT JOIN traSPAutodesk SP ON SP.IdPedido = PD.IdPedido
WHERE PD.IdPedido = ?
AND PD.Activo = 1
AND CASE
WHEN Ped.IdFabricante = 10 THEN PD.PrecioUnitario >= 0.05
ELSE PD.PrecioUnitario
END;`,
[IdPedido, IdProductoComisionTuClick]);

billing.selectPendingMsOrderDetail = (ID, IdPedido, TipoCambio) => help.d$().query(`
SELECT
? AS ID, P.IdERP AS Articulo, PD.IdPedido, PD.IdProducto,
CASE WHEN P.IdFabricante = 5
THEN 1
ELSE PD.Cantidad
END AS Cantidad,
CASE
  WHEN PD.MonedaPrecio = Ped.MonedaPago AND Ped.IdEsquemaRenovacion != 9 and Ped.Facturado = 0
        THEN PD.PrecioUnitario
  WHEN PD.MonedaPrecio = Ped.MonedaPago AND Ped.IdEsquemaRenovacion = 9 and Ped.Facturado = 0
    THEN PD.PrecioUnitario
  WHEN PD.MonedaPrecio = Ped.MonedaPago AND Ped.IdEsquemaRenovacion = 9 and Ped.Facturado = 1
    THEN PD.PrecioRenovacion
  WHEN Ped.MonedaPago = 'Pesos' AND PD.MonedaPrecio = 'Dolares' AND Ped.IdEsquemaRenovacion != 9 
    THEN PD.PrecioUnitario * ?
  WHEN Ped.MonedaPago = 'Pesos' AND PD.MonedaPrecio = 'Dolares' AND Ped.IdEsquemaRenovacion = 9 and Ped.Facturado = 0
    THEN PD.PrecioUnitario * ?
  WHEN Ped.MonedaPago = 'Pesos' AND PD.MonedaPrecio = 'Dolares' AND Ped.IdEsquemaRenovacion = 9 and Ped.Facturado = 1
    THEN PD.PrecioRenovacion * ?
  WHEN Ped.MonedaPago = 'Dolares' AND PD.MonedaPrecio = 'Pesos'
    THEN PD.PrecioRenovacion / Ped.TipoCambio END AS Precio
FROM traPedidoDetalles PD
INNER JOIN traProductos P ON P.IdProducto = PD.IdProducto
INNER JOIN traPedidos Ped ON Ped.IdPedido = PD.IdPedido
WHERE PD.IdPedido = ? AND P.IdProducto <> ?;`,
[ID, TipoCambio, TipoCambio, TipoCambio, IdPedido, IdProductoComisionTuClick]).then(res => res.data);

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

billing.getExchangeRate = ({ IdEmpresaUsuarioFinal, IdEmpresaDistribuidor, IdFormaPago }, IdFabricante) => help.d$().query(`
  SELECT getExchangeRate(? , ?, ?, ?) AS TipoCambio`, [IdEmpresaUsuarioFinal, IdEmpresaDistribuidor, IdFabricante, IdFormaPago])
    .then(res => res.data[0]);

billing.getLastBillId = () => help.d$().query(`
  SELECT 
  MAX(IdFactura) as IdFactura
  FROM
  traFacturaXPedidos;
`).then(res => res.data[0]);

billing.insertOrderToBill = (order, lastBillId) => help.d$().query(`
INSERT INTO traFacturaXPedidos
(IdFactura,
IdPedido)
VALUES
(? , ?);`, [lastBillId, order]);

billing.insertActualBill = (order, lastBillId) => help.d$().query(`
INSERT INTO traFacturacionAnnualMensual
(IdPedido, IdFactura, MesFactura) 
VALUES 
(? , ?, month(now()));`, [order, lastBillId]);

billing.selectPendingMsNCEMonthlyOrdersToBill = () => help.d$().query(`
SELECT DISTINCT
    P.IdPedido,
    P.IdPrimerPedido,
    Distribuidor.IdERP AS Cliente,
    IFNULL(Distribuidor.Credito, 0) Credito,
    UsuarioFinal.NombreEmpresa AS Proyecto,
    F.UEN,
    P.MonedaPago,
    P.TipoCambio,
    P.IdFormaPago,
    FN_CALCULARTOTALPEDIDO(P.IdPedido) AS Total,
    FN_CALCULARIVA(FN_CALCULARTOTALPEDIDO(P.IdPedido),
            Distribuidor.ZonaImpuesto) AS IVA,
    P.FechaFin AS Vencimiento,
    Distribuidor.AgenteMicrosoft AS Agente,
    'Mensual' AS EsquemaRenovacion,
    P.IdEmpresaDistribuidor,
    P.IdEmpresaUsuarioFinal
FROM
    traPedidos P
        INNER JOIN
    traEmpresas Distribuidor ON Distribuidor.IdEmpresa = P.IdEmpresaDistribuidor
        INNER JOIN
    traEmpresas UsuarioFinal ON UsuarioFinal.IdEmpresa = P.IdEmpresaUsuarioFinal
        INNER JOIN
    traFabricantes F ON F.IdFabricante = P.IdFabricante
        INNER JOIN
    traPedidoDetalles PD ON PD.IdPedido = P.IdPedido
        AND PD.PedidoAFabricante = 1
        AND PD.ResultadoFabricante1 IS NOT NULL
        INNER JOIN
    traProductos Pro ON Pro.IdProducto = PD.IdProducto
        LEFT JOIN
    traPedidosPadre TPP ON TPP.IdPedido = P.IdPedido
WHERE
    P.IdEstatusPedido IN (2 , 3)
        AND Distribuidor.IdERP IS NOT NULL
        AND P.PedidoImportado IS NULL
        AND UsuarioFinal.NombreEmpresa IS NOT NULL
        AND F.UEN IS NOT NULL
        AND P.MonedaPago IS NOT NULL
        AND P.TipoCambio IS NOT NULL
        AND P.IdFormaPago != 4
        AND P.IdEsquemaRenovacion = 1
        AND IdFormaPago = 2
        AND Pro.IdTipoProducto != 3
        AND P.FechaInicio <= DATE_FORMAT(NOW(), '%Y-%m-06')
        AND P.FechaFin IS NOT NULL
        AND IF(P.IdEsquemaRenovacion = 1 && P.Facturado = 0 && PD.ResultadoFabricante7 = 'RENEWAL', 1, 0 ) = 1
        `).then(res => res.data);

billing.selectPendingMsNCEAnnualMonthlyOrdersToBill = () => help.d$().query(`
SELECT DISTINCT
    P.IdPedido,
    P.IdPrimerPedido,
    Distribuidor.IdERP AS Cliente,
    IFNULL(Distribuidor.Credito, 0) Credito,
    UsuarioFinal.NombreEmpresa AS Proyecto,
    F.UEN,
    P.MonedaPago,
    P.TipoCambio,
    P.IdFormaPago,
    FN_CALCULARTOTALPEDIDO(P.IdPedido) AS Total,
    FN_CALCULARIVA(FN_CALCULARTOTALPEDIDO(P.IdPedido),
            Distribuidor.ZonaImpuesto) AS IVA,
    P.FechaFin AS Vencimiento,
    Distribuidor.AgenteMicrosoft AS Agente,
    'Anual con facturación mensual' AS EsquemaRenovacion,
    P.IdEmpresaDistribuidor,
    P.IdEmpresaUsuarioFinal
FROM
    traPedidos P
        INNER JOIN
    traEmpresas Distribuidor ON Distribuidor.IdEmpresa = P.IdEmpresaDistribuidor
        INNER JOIN
    traEmpresas UsuarioFinal ON UsuarioFinal.IdEmpresa = P.IdEmpresaUsuarioFinal
        INNER JOIN
    traFabricantes F ON F.IdFabricante = P.IdFabricante
        INNER JOIN
    traPedidoDetalles PD ON PD.IdPedido = P.IdPedido
        AND PD.Activo = 1
        AND PD.PedidoAFabricante = 1
        AND PD.ResultadoFabricante1 IS NOT NULL
        INNER JOIN
    traProductos Pro ON Pro.IdProducto = PD.IdProducto
	    LEFT JOIN
     traFacturacionAnnualMensual FAM ON FAM.IdPedido = P.IdPedido
AND FAM.MesFactura = month(now())
WHERE
    P.IdEstatusPedido IN (2 , 3)
        AND Distribuidor.IdERP IS NOT NULL
        AND P.PedidoImportado IS NULL
        AND P.Facturado = 1
        AND UsuarioFinal.NombreEmpresa IS NOT NULl
        AND F.UEN IS NOT NULL
        AND P.MonedaPago IS NOT NULL
        AND P.TipoCambio IS NOT NULL
        AND P.IdEsquemaRenovacion = 9
        AND IdFormaPago = 2
        AND Pro.IdTipoProducto != 3
        AND P.FechaFin IS NOT NULL
        AND DATE_FORMAT(NOW(), '%m %Y') != DATE_FORMAT(P.FechaInicio, '%m %Y')
        AND DATE_FORMAT(NOW(), '%06 %m %Y') < DATE_FORMAT(P.FechaFin, '%d %m %Y')
        AND IF(DATE_FORMAT(P.FechaInicio, '%d') <= 6, 1, IF(DATE_FORMAT(P.FechaFin, '%m') + 1 != DATE_FORMAT(NOW(), '%m'), 1, 0 )) = 1
        AND FAM.MesFactura IS NULL;
        `).then(res => res.data);

module.exports = billing;
