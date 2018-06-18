const config = require('../../../config');
const { requestPromise } = require('../../../helpers/logged-request');
const clientData = require('../../../data/enterprise');

const createOrder = params => {
  const parameters = {
    Cliente: params.Cliente,
    Total: params.Total,
    Moneda: params.MonedaPago,
    TipoCambio: params.TipoCambio,
    IdFormaPago: params.IdFormaPago,
    UEN: params.UEN,
    IVA: params.IVA,
    IdPedidoMarketPlace: params.IdPedido,
    Proyecto: params.Proyecto,
    Vencimiento: params.Vencimiento,
    Agente: params.Agente,
  };

  const createDataOrder = () => ({
    method: 'POST',
    uri: `${config.ApiErp}/Pedido`,
    form: parameters,
    headers: {
      token: config.TokenERP,
    },
    //json: true,
  });

  const applyDataOrder = () => {
    const requestOptions = createDataOrder();
    return requestPromise(requestOptions);
  };

  return {
    applyDataOrder,
  };
};

module.exports = createOrder;
