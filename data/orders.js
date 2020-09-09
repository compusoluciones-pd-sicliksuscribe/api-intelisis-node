const help = require('../helpers/help');
const { AWS } = require('../helpers/enums/makers');

const orders = {};

orders.patch = (fields, IdPedido) => help.d$().update('traPedidos', fields, { IdPedido }).then(data => data).catch(err => err);

orders.updatePaidOrders = ({ ID }) => help.d$().query(`
UPDATE traPedidos SET IdEstatusPedido = 3 WHERE IdFactura = ? AND IdEstatusPedido in (2)`, [ID]);


orders.getPrepaidOrdersWithoutBill = IdERP => (
    help.d$().query(`
    SELECT sum(fn_CalcularTotalPedido(IdPedido)) * 1.16 AS totalDebt
    FROM traPedidos P
    INNER JOIN traEmpresas dist on dist.IdEmpresa = P.IdEmpresaDistribuidor
    WHERE IdERP = ? AND IdFormaPago = 4 and IdEstatusPedido not in (1,6) and (Facturado = 0 or (P.CargoRealizadoProximoPedido = 1 and Renovado = 0));
    `, [IdERP])
      .then(result => result.data[0])
);

orders.getPendingOrdersUpdate = () => (
  help.d$().query(`
  SELECT 
  *
  FROM
    traPedidos
  WHERE
    IdFabricante = ? AND Facturado = 2
        AND IdFactura IS NOT NULL
        AND IdEstatusPedido NOT IN (1 , 6, 3, 0);
  `, [AWS])
    .then(result => result.data)
);

module.exports = orders;
