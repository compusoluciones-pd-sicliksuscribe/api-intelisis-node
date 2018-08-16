const { requestPromise } = require('../../../../helpers/logged-request');
const config = require('../../../../config');
const throwCustomError = require('../../../../helpers/factories/errorFactory');

const applyClientsBalance = () => {
  const mapOrderParameters = orders => ({
    Cliente: orders.Cliente,
    Proyecto: orders.Proyecto,
    Total: orders.Total,
    IVA: orders.IVA,
    Moneda: orders.MonedaPago,
    TipoCambio: orders.TipoCambio,
    IdFormaPago: orders.IdFormaPago,
    UEN: orders.UEN,
    IdPedidoMarketPlace: orders.IdPedido,
    Referencia: orders.IdPedido,
    Vencimiento: orders.Vencimiento,
    Agente: orders.Agente,
  });

  const getOptions = orders => ({
    method: 'POST',
    uri: `${config.ApiErp}/Pedido`,
    body: mapOrderParameters(orders),
    headers: {
      token: config.TokenERP,
    },
    json: true,
  });

  const applyOrderBalance = orders => {
    const requestOptions = getOptions(orders);
    return requestPromise(requestOptions)
      .catch(error => throwCustomError(`Error al generar el pedido en intelisis ${error}`));
  };

  return {
    applyOrderBalance,
  };
};

module.exports = applyClientsBalance;
