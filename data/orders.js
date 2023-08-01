const help = require('../helpers/help');
const orders = {};

orders.patch = (fields, IdPedido) => help.d$().update('traPedidos', fields, { IdPedido }).then(data => data).catch(err => err);

orders.updatePaidOrders = ID => help.d$().query(`
UPDATE traPedidos SET IdEstatusPedido = 3 WHERE IdFactura = ? AND IdEstatusPedido in (2)`, [ID]);

orders.getPendingPayBill = () => (
  help.d$().query(`
  SELECT 
    IdPedido, IdFactura
  FROM
      traPedidos
  WHERE
      IdEstatusPedido NOT IN (1 , 3, 6)
          AND IdFactura > 1;`)
        .then(result => result.data));

orders.getPrepaidOrdersWithoutBill = IdERP => (
    help.d$().query(`
    SELECT sum(fn_CalcularTotalPedido(IdPedido)) * 1.16 AS totalDebt
    FROM traPedidos P
    INNER JOIN traEmpresas dist on dist.IdEmpresa = P.IdEmpresaDistribuidor
    WHERE IdERP = ? AND IdFormaPago = 4 and IdEstatusPedido not in (1,6) and (Facturado != 1 or (P.CargoRealizadoProximoPedido = 1 and Renovado = 0));
    `, [IdERP])
      .then(result => result.data[0])
);

orders.getPaymentMethod = order => (
  help.d$().query(`
  SELECT 
    CASE
        WHEN card_type = 'debito' THEN 'Tarjeta de Débito'
        WHEN card_type = 'credito' THEN 'Tarjeta de Crédito'
        ELSE null
    END AS type
  FROM
    clicksuscribe.openpay_click
  WHERE
      cart_id LIKE '%${order}%'
  `)
    .then(result => result.data[0])
);


orders.getOpenpayCCInfo = order => (
  help.d$().query(`
  SELECT 
    op.name,
    op.cart_id,
    op.amount,
    op.register_date
  FROM
      clicksuscribe.openpay_click op
          INNER JOIN
      traPedidos P ON P.TarjetaResultIndicator = op.openpay_payment_id
          INNER JOIN
      traUsuariosXEmpresas usu ON usu.IdUsuario = op.user_id
  WHERE
    P.IdPedido IN (${order});
  `)
    .then(result => result.data[0])
);

orders.getOpenpaySpeiInfo = order => (
  help.d$().query(`
    SELECT 
      usu.NombreEmpresa,
      op.descripcion,
      op.monto,
      op.moneda,
      op.fechaCreacion
  FROM
      clicksuscribe.traSpeiTransaccion op
          INNER JOIN
      traPedidos P ON P.IdPedido = op.idPedido
          INNER JOIN
      traEmpresas usu ON usu.IdEmpresa = op.idEmpresa
  WHERE
      P.IdPedido IN (${order});
    `)
    .then(result => result.data[0])
);

module.exports = orders;
