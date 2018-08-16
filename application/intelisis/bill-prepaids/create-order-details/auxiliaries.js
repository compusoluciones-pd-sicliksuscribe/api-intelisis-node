const { requestPromise } = require('../../../../helpers/logged-request');
const config = require('../../../../config');
const throwCustomError = require('../../../../helpers/factories/errorFactory');

const applyClientsBalanceDetails = () => {
  const mapOrderDetailsParameters = orderDetail => ({
    ID: orderDetail.ID,
    Articulo: orderDetail.Articulo,
    Cantidad: orderDetail.Cantidad,
    Precio: orderDetail.Precio,
    RenglonID: orderDetail.RenglonID,
    Renglon: orderDetail.Renglon,
  });

  const getOptions = orderDetail => ({
    method: 'POST',
    uri: `${config.ApiErp}/PedidoD`,
    body: mapOrderDetailsParameters(orderDetail),
    headers: {
      token: config.TokenERP,
    },
    json: true,
  });

  const applyOrderDetailsBalance = orderDetail => {
    const requestOptions = getOptions(orderDetail);
    return requestPromise(requestOptions)
      .catch(error => throwCustomError(`Error al generar las partidas ${error}`));
  };

  return {
    applyOrderDetailsBalance,
  };
};

module.exports = applyClientsBalanceDetails;
