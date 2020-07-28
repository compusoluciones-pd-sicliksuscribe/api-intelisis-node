const { requestPromise } = require('../../../helpers/logged-request');
const config = require('../../../config');

const insertOrderDetail = orderDetail => {
  const params = {
    ID: orderDetail.ID,
    Articulo: orderDetail.Articulo,
    Cantidad: orderDetail.Cantidad,
    Precio: orderDetail.Precio,
    Descuento: orderDetail.Descuento,
    RenglonID: orderDetail.RenglonID,
    Renglon: orderDetail.Renglon,
  };

  const options = {
    method: 'POST',
    uri: config.ApiErp + 'VentaD',
    form: params,
    headers: {
      token: config.TokenERP,
    },
  };

  return requestPromise(options)
    .catch((error) => {
      throw error;
    })
    .then(result => result);
};

module.exports = insertOrderDetail;
