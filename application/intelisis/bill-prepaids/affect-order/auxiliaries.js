const { requestPromise } = require('../../../../helpers/logged-request');
const config = require('../../../../config');
const { putResponseBilling } = require('../../../../data/billing');
const throwCustomError = require('../../../../helpers/factories/errorFactory');

const processBillRequest = async (billResponse, { IdPedido }) => {
  const { oResultado, ID } = billResponse[0];
  if (oResultado.success) {
    return putResponseBilling(ID, IdPedido);
  }
  return throwCustomError(`Error al afectar el pedido ${IdPedido}`);
};

const applyaffectOrder = () => {
  const mapOrderParameters = billId => ({
    ID: billId,
  });

  const getOptions = billId => ({
    method: 'PUT',
    uri: `${config.ApiErp}PedidoD`,
    body: mapOrderParameters(billId),
    headers: {
      token: config.TokenERP,
    },
    json: true,
  });

  const affectOrderIntelisis = (billId, order) => {
    const requestOptions = getOptions(billId);
    return requestPromise(requestOptions)
    .then(billResponse => processBillRequest(billResponse, order));
  };

  return {
    affectOrderIntelisis,
  };
};

module.exports = applyaffectOrder;
