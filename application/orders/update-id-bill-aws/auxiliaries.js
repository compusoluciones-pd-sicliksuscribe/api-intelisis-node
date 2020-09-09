const { requestPromise } = require('../../../helpers/logged-request');
const config = require('../../../config');
const ordersData = require('../../../data/orders');

const auxiliariesFactory = () => {
  const auxiliaries = { };

  const getOptions = movId => ({
    method: 'PUT',
    uri: config.ApiErp + `Venta/${movId}`,
    headers: {
      token: config.TokenERP,
    },
  });

  auxiliaries.updateBill = async orders => {
    const updateOrders = orders.map(async order => {
      const bill = await auxiliaries.checkBill(order);
      if (bill[0]) {
        ordersData.patch({ Facturado: 1, IdFactura: bill[0].ID }, order.IdPedido);
        return { Pedido: order.IdPedido, IdFactura: bill[0].ID, Estatus: 'Actualizado' };
      }
      return { Pedido: order.IdPedido, Estatus: 'Pendiente' };
    });
    return Promise.all(updateOrders);
  };

  auxiliaries.selectPendingOrders = async () => await ordersData.getPendingOrdersUpdate();

  auxiliaries.checkBill = async order => {
    const requestOptions = getOptions(order.IdFactura);
    return requestPromise(requestOptions)
      .then(result => JSON.parse(result));
  };

  return auxiliaries;
};

module.exports = auxiliariesFactory;
