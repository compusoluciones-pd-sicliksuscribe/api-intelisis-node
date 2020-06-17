const help = require('../helpers/help');
const SICLIK_ORDENES = require('../configs/databaseSiclickOrdenes');
const siclik = require('../helpers/gateway')(SICLIK_ORDENES);
const orders = {};

orders.patch = (fields, IdPedido) => help.d$().update('traPedidos', fields, { IdPedido }).then(data => data).catch(err => err);

orders.updatePaidOrders = ({ ID }) => help.d$().query(`
UPDATE traPedidos SET IdEstatusPedido = 3 WHERE IdFactura = ? AND IdEstatusPedido in (2)`, [ID]);


orders.getPrepaidOrdersWithoutBill = IdERP => (
    help.d$().query(`
    SELECT sum(fn_CalcularTotalPedido(IdPedido)) * 1.16 AS totalDebt
    FROM traPedidos P
    INNER JOIN traEmpresas dist on dist.IdEmpresa = P.IdEmpresaDistribuidor
    WHERE IdERP = ? AND IdFormaPago = 4 and IdEstatusPedido not in (1,6) and (Facturado != 1 or (P.CargoRealizadoProximoPedido = 1 and Renovado = 0));
    `, [IdERP])
      .then(result => result.data[0])
);

orders.getOpenPayDetails = IdPedido => (
  help.d$().query(`
    SELECT 
      TarjetaResultIndicator
    FROM
      traPedidos
    WHERE
      IdPedido = ?
  `, [IdPedido])
    .then(result => result.data[0])
);

orders.getAgenteCXC = IdEmpresa => (
  help.d$().query(`
    SELECT 
      *
    FROM
      catContactoCXC
    WHERE
      IdEmpresa = ?
  `, [IdEmpresa])
    .then(result => result.data[0])
);

orders.getAgenteXMarca = UEN => (
  help.d$().query(`
  SELECT 
    com.Nombre, com.Correo
  FROM
    catCorreosCompusoluciones com
        INNER JOIN
    traFabricantes fab ON fab.IdFabricante = com.IdFabricante
  WHERE
    fab.UEN = ? AND ContactoOperaciones = 1;
  `, [UEN]
)).then(res => res.data);

module.exports = orders;
