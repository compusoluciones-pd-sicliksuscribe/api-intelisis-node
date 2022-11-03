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
    DescripcionExtra: orderDetail.DescripcionExtra,
    DescuentoSP: orderDetail.DescuentoSP,
  });

  const getOptions = orderDetail => ({
    method: 'POST',
    uri: `${config.ApiErp}PedidoD`,
    body: mapOrderDetailsParameters(orderDetail),
    headers: {
      token: config.TokenERP,
    },
    json: true,
  });

  const processResponse = response => {
    const { oResultado, Message } = response[0];
    if (!oResultado.Success) {
      return throwCustomError(Message);
    }
    return response;
  };

  const applyOrderDetailsBalance = orderDetail => {
    const requestOptions = getOptions(orderDetail);
    return requestPromise(requestOptions)
      .then(processResponse)
      .catch(error => throwCustomError(`Error al generar las partidas ${error}`));
  };

  return {
    applyOrderDetailsBalance,
  };
};

module.exports = applyClientsBalanceDetails;
